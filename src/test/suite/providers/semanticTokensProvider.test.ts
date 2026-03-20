import * as assert from "assert";
import * as vscode from "vscode";

import { EdiComment, EdiElement, EdiMessageSeparators, EdiSegment, EdiType, ElementType } from "../../../parser/entities";
import { SemanticTokensProvider } from "../../../providers/semanticTokensProvider";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("SemanticTokensProvider Test Suite", () => {
  let provider: SemanticTokensProvider;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalRegisterDocumentSemanticTokensProvider: typeof vscode.languages.registerDocumentSemanticTokensProvider;
  let originalSemanticTokensBuilder: typeof vscode.SemanticTokensBuilder;

  setup(() => {
    provider = new SemanticTokensProvider();
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalRegisterDocumentSemanticTokensProvider = vscode.languages.registerDocumentSemanticTokensProvider;
    originalSemanticTokensBuilder = vscode.SemanticTokensBuilder;
  });

  teardown(() => {
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    vscode.languages.registerDocumentSemanticTokensProvider = originalRegisterDocumentSemanticTokensProvider;
    (vscode as any).SemanticTokensBuilder = originalSemanticTokensBuilder;
  });

  test("Should return undefined when parser is unavailable", async () => {
    (EdiUtils as any).getEdiParser = () => ({
      parser: undefined,
      ediType: EdiType.UNKNOWN,
    });

    const document = EdiMockFactory.createMockDocument("BEG*00~", "x12");
    const result = await provider.provideDocumentSemanticTokens(document, EdiMockFactory.createMockCancellationToken());

    assert.strictEqual(result, undefined);
  });

  test("Should build semantic tokens for segment, values, separators and comments", async () => {
    const pushes: { range: vscode.Range; tokenType: string }[] = [];
    (vscode as any).SemanticTokensBuilder = class {
      push(range: vscode.Range, tokenType: string) {
        pushes.push({ range, tokenType });
      }

      build() {
        return pushes;
      }
    };

    const content = "BEG*00*12*20240101*AB>CD~// seg\n// tail";
    const document = EdiMockFactory.createMockDocument(content, "x12");
    const segment = new EdiSegment("BEG", 0, 24, 25, "~");
    const qualifierElement = new EdiElement(segment, ElementType.dataElement, 3, 5, "*", "BEG", 0, "01");
    qualifierElement.value = "00";
    qualifierElement.ediReleaseSchemaElement = { qualifierRef: "Purpose code" } as any;

    const numberElement = new EdiElement(segment, ElementType.dataElement, 6, 8, "*", "BEG", 0, "02");
    numberElement.value = "12";
    numberElement.ediReleaseSchemaElement = { dataType: "N" } as any;

    const datetimeElement = new EdiElement(segment, ElementType.dataElement, 9, 17, "*", "BEG", 0, "03");
    datetimeElement.value = "20240101";
    datetimeElement.ediReleaseSchemaElement = { dataType: "DT" } as any;

    const compositeElement = new EdiElement(segment, ElementType.dataElement, 18, 23, "*", "BEG", 0, "04");
    compositeElement.value = "AB>CD";
    const component1 = new EdiElement(segment, ElementType.componentElement, 18, 20, "*", "BEG", 0, "04-01");
    component1.value = "AB";
    const component2 = new EdiElement(segment, ElementType.componentElement, 21, 23, ">", "BEG", 0, "04-02");
    component2.value = "CD";
    compositeElement.components = [component1, component2];

    segment.elements = [qualifierElement, numberElement, datetimeElement, compositeElement];
    segment.comments = [new EdiComment(25, 30, "// seg")];

    const separators = new EdiMessageSeparators();
    separators.segmentSeparator = "~";
    separators.dataElementSeparator = "*";
    separators.componentElementSeparator = ">";

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          separators,
          commentsAfterDocument: [new EdiComment(32, 38, "// tail")],
          getSegments: () => [segment],
        }),
      },
      ediType: EdiType.X12,
    });

    const result = await provider.provideDocumentSemanticTokens(document, EdiMockFactory.createMockCancellationToken());

    assert.strictEqual(result, pushes);
    assert.deepStrictEqual(
      pushes.map(item => item.tokenType),
      [
        "edisupportsegmentid",
        "edisupportcomment",
        "edisupportseparator",
        "edisupportseparator",
        "edisupportvaluetypequalifer",
        "edisupportseparator",
        "edisupportvaluetypenumber",
        "edisupportseparator",
        "edisupportvaluetypedatetime",
        "edisupportseparator",
        "edisupportvaluetypeother",
        "edisupportseparator",
        "edisupportvaluetypeother",
        "edisupportcomment",
      ],
    );
    assert.deepStrictEqual(
      pushes[0].range,
      new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 3)),
    );
    assert.deepStrictEqual(
      pushes[2].range,
      new vscode.Range(new vscode.Position(0, 24), new vscode.Position(0, 25)),
    );
    assert.deepStrictEqual(
      pushes[13].range,
      new vscode.Range(new vscode.Position(1, 0), new vscode.Position(1, 7)),
    );
  });

  test("Should register semantic token providers for x12, edifact and vda", () => {
    const registeredLanguages: string[] = [];
    vscode.languages.registerDocumentSemanticTokensProvider = (
      selector: vscode.DocumentSelector,
      semanticTokensProvider: vscode.DocumentSemanticTokensProvider,
      legend: vscode.SemanticTokensLegend,
    ): vscode.Disposable => {
      const language = (selector as vscode.DocumentFilter).language;
      if (language) {
        registeredLanguages.push(language);
      }
      assert.strictEqual(semanticTokensProvider, provider);
      assert.ok(legend);
      return { dispose: () => {} };
    };

    const result = provider.registerFunctions();

    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(registeredLanguages, [EdiType.X12, EdiType.EDIFACT, EdiType.VDA]);
  });
});
