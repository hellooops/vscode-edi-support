import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../../constants";
import { HoverProviderBase } from "../../../providers/hoverProviderBase";
import { HoverEdifactProvider } from "../../../providers/hoverEdifactProvider";
import { HoverVdaProvider } from "../../../providers/hoverVdaProvider";
import { HoverX12Provider } from "../../../providers/hoverX12Provider";
import { EdiType } from "../../../parser/entities";
import { EdiUtils } from "../../../utils/ediUtils";
import { SchemaViewerUtils } from "../../../utils/schemaViewerUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("HoverProvider Test Suite", () => {
  let provider: TestHoverProvider;
  let originalGetConfiguration: typeof vscode.workspace.getConfiguration;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalGetSegmentOrElementByPosition: typeof EdiUtils.getSegmentOrElementByPosition;
  let originalGetSegmentUrl: typeof SchemaViewerUtils.getSegmentUrl;
  let originalGetElementUrl: typeof SchemaViewerUtils.getElementUrl;
  let originalRegisterHoverProvider: typeof vscode.languages.registerHoverProvider;

  setup(() => {
    provider = new TestHoverProvider();
    originalGetConfiguration = vscode.workspace.getConfiguration;
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalGetSegmentOrElementByPosition = EdiUtils.getSegmentOrElementByPosition;
    originalGetSegmentUrl = SchemaViewerUtils.getSegmentUrl;
    originalGetElementUrl = SchemaViewerUtils.getElementUrl;
    originalRegisterHoverProvider = vscode.languages.registerHoverProvider;
  });

  teardown(() => {
    vscode.workspace.getConfiguration = originalGetConfiguration;
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).getSegmentOrElementByPosition = originalGetSegmentOrElementByPosition;
    (SchemaViewerUtils as any).getSegmentUrl = originalGetSegmentUrl;
    (SchemaViewerUtils as any).getElementUrl = originalGetElementUrl;
    vscode.languages.registerHoverProvider = originalRegisterHoverProvider;
  });

  test("Should return null when hover is disabled", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~");
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableHover]: false,
    });

    const result = await provider.provideHover(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.strictEqual(result, null);
  });

  test("Should return null when parser is unavailable", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~");
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableHover]: true,
    });
    (EdiUtils as any).getEdiParser = () => ({ parser: undefined, ediType: EdiType.X12 });

    const result = await provider.provideHover(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.strictEqual(result, null);
  });

  test("Should return undefined when parser returns no document or no segment", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~");
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableHover]: true,
    });

    (EdiUtils as any).getEdiParser = () => ({
      parser: { parse: async () => undefined },
      ediType: EdiType.X12,
    });

    let result = await provider.provideHover(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.strictEqual(result, undefined);

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [],
        }),
      },
      ediType: EdiType.X12,
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment: undefined, element: undefined });

    result = await provider.provideHover(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.strictEqual(result, undefined);
  });

  test("Should build segment hover markdown with schema reference", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~");
    const segment = {
      id: "ISA",
      getDesc: () => "Interchange Control Header",
      ediReleaseSchemaSegment: {
        purpose: "To start and identify an interchange.",
      },
      transactionSetParent: {
        meta: {
          release: "00401",
        },
      },
      toString: () => "ISA*00*~",
    };

    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableHover]: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
      ediType: EdiType.X12,
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment, element: undefined });
    (SchemaViewerUtils as any).getSegmentUrl = () => "https://schema.example/segment";

    const result = await provider.provideHover(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.ok(result instanceof vscode.Hover);
    const contents = result.contents as vscode.MarkdownString[];
    assert.strictEqual(contents.length, 3);
    assert.strictEqual(contents[0].value, "**ISA** (Segment)");
    assert.ok(contents[1].value.includes("**Interchange Control Header**"));
    assert.ok(contents[1].value.includes("To start and identify an interchange."));
    assert.ok(contents[1].value.includes("```x12\nISA*00*~\n```"));
    assert.strictEqual(contents[2].value, "[EDI Schema Reference](https://schema.example/segment)\n");
  });

  test("Should build element hover markdown with qualifier details and schema reference", async () => {
    const document = EdiMockFactory.createMockDocument("REF*ZZ*123~");
    const segment = {
      id: "REF",
      transactionSetParent: {
        meta: {
          release: "00401",
        },
      },
      toString: () => "REF*ZZ*123~",
    };
    const codes = [{
      value: "ZZ",
      desc: "Mutually defined",
      getEscapedDesc: () => "Mutually defined",
    }];
    const element = {
      designatorIndex: "01",
      value: "ZZ",
      ediReleaseSchemaElement: {
        id: "128",
        dataType: "ID",
        minLength: 2,
        maxLength: 3,
        length: 2,
        desc: "Reference identification qualifier",
        definition: "Code qualifying the reference identification.",
        qualifierRef: "Reference identification qualifier",
        getCodes: () => codes,
        getCodeByValue: (value: string) => value === "ZZ" ? codes[0] : undefined,
      },
      getDesignator: () => "REF01",
    };

    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableHover]: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
      ediType: EdiType.X12,
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment, element });
    (SchemaViewerUtils as any).getElementUrl = () => "https://schema.example/element";

    const result = await provider.provideHover(
      document,
      new vscode.Position(0, 1),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.ok(result instanceof vscode.Hover);
    const contents = result.contents as vscode.MarkdownString[];
    assert.strictEqual(contents.length, 4);
    assert.ok(contents[0].value.includes("**REF**01 (Element)"));
    assert.ok(contents[0].value.includes("`Id 128`"));
    assert.ok(contents[0].value.includes("`Type ID`"));
    assert.ok(contents[0].value.includes("`Min 2 / Max 3`"));
    assert.ok(contents[0].value.includes("`Length 2`"));
    assert.ok(contents[1].value.includes("**Reference identification qualifier**"));
    assert.ok(contents[1].value.includes("Code qualifying the reference identification."));
    assert.ok(contents[1].value.includes("```x12\nREF*ZZ*123~\n```"));
    assert.ok(contents[2].value.includes("ZZ: `Mutually defined`"));
    assert.ok(contents[2].value.includes("Available codes: [`ZZ`](https://schema.example/element \"Mutually defined\")"));
    assert.strictEqual(contents[3].value, "[EDI Schema Reference](https://schema.example/element)\n");
  });

  test("Should register hover providers for x12, edifact and vda", () => {
    const registeredLanguages: string[] = [];
    vscode.languages.registerHoverProvider = (
      selector: vscode.DocumentSelector,
      hoverProvider: vscode.HoverProvider,
    ): vscode.Disposable => {
      const language = (selector as vscode.DocumentFilter).language;
      if (language) {
        registeredLanguages.push(language);
      }
      assert.ok(hoverProvider instanceof HoverProviderBase);
      return new vscode.Disposable(() => {});
    };

    const x12Provider = new HoverX12Provider();
    const edifactProvider = new HoverEdifactProvider();
    const vdaProvider = new HoverVdaProvider();

    const disposables = [
      ...x12Provider.registerFunctions(),
      ...edifactProvider.registerFunctions(),
      ...vdaProvider.registerFunctions(),
    ];

    assert.strictEqual(disposables.length, 3);
    assert.deepStrictEqual(registeredLanguages, [EdiType.X12, EdiType.EDIFACT, EdiType.VDA]);
  });
});

class TestHoverProvider extends HoverProviderBase {
  public getLanguageName(): string {
    return constants.ediDocument.x12.name;
  }

  public registerFunctions(): vscode.Disposable[] {
    return [];
  }
}
