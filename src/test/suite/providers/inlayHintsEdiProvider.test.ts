import * as assert from "assert";
import * as vscode from "vscode";
import { InlayHintsEdiProvider } from "../../../providers/inlayHintsEdiProvider";
import { InlayHintsEdiEdifactProvider } from "../../../providers/inlayHintsEdiEdifactProvider";
import { InlayHintsEdiVdaProvider } from "../../../providers/inlayHintsEdiVdaProvider";
import { InlayHintsEdiX12Provider } from "../../../providers/inlayHintsEdiX12Provider";
import { EdiType } from "../../../parser/entities";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";
import * as constants from "../../../constants";

// 具体实现用于测试抽象类
class TestInlayHintsEdiProvider extends InlayHintsEdiProvider {
  getLanguageId(): string {
    return "x12";
  }
}

suite("InlayHintsEdiProvider Test Suite", () => {
  let provider: TestInlayHintsEdiProvider;
  let originalGetConfiguration: any;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalRegisterInlayHintsProvider: typeof vscode.languages.registerInlayHintsProvider;

  setup(() => {
    provider = new TestInlayHintsEdiProvider();
    originalGetConfiguration = vscode.workspace.getConfiguration;
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalRegisterInlayHintsProvider = vscode.languages.registerInlayHintsProvider;
  });

  teardown(() => {
    vscode.workspace.getConfiguration = originalGetConfiguration;
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    vscode.languages.registerInlayHintsProvider = originalRegisterInlayHintsProvider;
  });

  suite("provideInlayHints", () => {
    test("Should return empty array when both hints are disabled", async () => {
      // Mock configuration
      const mockConfig = EdiMockFactory.createMockConfiguration({
        [constants.configuration.inlayHints.segmentNames]: false,
        [constants.configuration.inlayHints.qualifierCodes]: false,
      });
      vscode.workspace.getConfiguration = () => mockConfig;

      const documentContent = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
GS*PO*  *  *20241111*0300*1*T*004010~
ST*850*0001~
BEG*00*DS*PO1**20150708~
SE*3*0001~
GE*1*1~
IEA*1*000000001~`;

      const document = EdiMockFactory.createMockDocument(documentContent, "x12");
      const range = EdiMockFactory.createMockRange(documentContent);
      const token = EdiMockFactory.createMockCancellationToken();

      const result = await provider.provideInlayHints(document, range, token);

      assert.strictEqual(result?.length, 0);
    });

    test("Should provide segment name inlay hints when enabled", async () => {
      const mockConfig = EdiMockFactory.createMockConfiguration({
        [constants.configuration.inlayHints.segmentNames]: true,
        [constants.configuration.inlayHints.qualifierCodes]: false,
      });
      vscode.workspace.getConfiguration = () => mockConfig;

      const documentContent = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
GS*PO*  *  *20241111*0300*1*T*004010~
ST*850*0001~
BEG*00*DS*PO1**20150708~
SE*3*0001~
GE*1*1~
IEA*1*000000001~`;

      const document = EdiMockFactory.createMockDocument(documentContent);
      const range = EdiMockFactory.createMockRange(documentContent);
      const token = EdiMockFactory.createMockCancellationToken();

      const result = await provider.provideInlayHints(document, range, token);

      assert.ok(result?.length === 7);
      // ISA segment should have description
      assert.ok(result[0].label === "Interchange Control Header");
    });

    test("Should provide qualifier code inlay hints when enabled", async () => {
      const mockConfig = EdiMockFactory.createMockConfiguration({
        [constants.configuration.inlayHints.segmentNames]: false,
        [constants.configuration.inlayHints.qualifierCodes]: true,
      });
      vscode.workspace.getConfiguration = () => mockConfig;

      const documentContent = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
GS*PO*  *  *20241111*0300*1*T*004010~
ST*850*0001~
BEG*00*DS*PO1**20150708~
SE*3*0001~
GE*1*1~
IEA*1*000000001~`;

      const document = EdiMockFactory.createMockDocument(documentContent);
      const range = EdiMockFactory.createMockRange(documentContent);
      const token = EdiMockFactory.createMockCancellationToken();

      const result = await provider.provideInlayHints(document, range, token);

      assert.ok(result?.length === 3);
      // ST01 850
      assert.ok(result[0].label === "Purchase Order");
      // BEG01 00
      assert.ok(result[1].label === "Original");
      // BEG02 DS
      assert.ok(result[2].label === "Dropship");
    });

    test("Should provide both segment names and qualifier hints when both enabled", async () => {
      const mockConfig = EdiMockFactory.createMockConfiguration({
        [constants.configuration.inlayHints.segmentNames]: true,
        [constants.configuration.inlayHints.qualifierCodes]: true,
      });
      vscode.workspace.getConfiguration = () => mockConfig;

      const documentContent = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
GS*PO*  *  *20241111*0300*1*T*004010~
ST*850*0001~
BEG*00*DS*PO1**20150708~
SE*3*0001~
GE*1*1~
IEA*1*000000001~`;

      const document = EdiMockFactory.createMockDocument(documentContent);
      const range = EdiMockFactory.createMockRange(documentContent);
      const token = EdiMockFactory.createMockCancellationToken();

      const result = await provider.provideInlayHints(document, range, token);

      assert.ok(result?.length === 10);
      assert.ok(result.some(h => h.label === "Interchange Control Header"));
      assert.ok(result.some(h => h.label === "Purchase Order"));
    });

    test("Should handle valid EDIFACT document", async () => {
      const mockConfig = EdiMockFactory.createMockConfiguration({
        [constants.configuration.inlayHints.segmentNames]: true,
        [constants.configuration.inlayHints.qualifierCodes]: true,
      });
      vscode.workspace.getConfiguration = () => mockConfig;

      const documentContent = `UNA:+.?*'
UNB+UNOA:2+SENDER+RECEIVER+210101:1200+1'
UNH+1+ORDERS:D:96A:UN'
BGM+220+PO001+9'
UNT+3+1'
UNZ+1+1'`;

      const document = EdiMockFactory.createMockDocument(documentContent, "edifact");
      const range = EdiMockFactory.createMockRange(documentContent);
      const token = EdiMockFactory.createMockCancellationToken();

      const result = await provider.provideInlayHints(document, range, token);

      assert.ok(result && result.length >= 0);
    });

    test("Should handle segments with nested components", async () => {
      const mockConfig = EdiMockFactory.createMockConfiguration({
        [constants.configuration.inlayHints.segmentNames]: true,
        [constants.configuration.inlayHints.qualifierCodes]: true,
      });
      vscode.workspace.getConfiguration = () => mockConfig;

      // SV2 segment with composite element containing qualifier codes
      const documentContent = `ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
ST*850*0001~
BEG*00*BK*0019-1234567-1234**20000130~
PO1*1*3*EA*12.3*PE*IN*15013163*SK*7680-02009152*UP*846186077111*CB*790-01-20*EN*12345~
PID*F*08***WR CARGO SHO 38 BLK SOLID~
CTT*1*200~
SE*6*0001~
GE*1*7080~
IEA*1*000007080~`;

      const document = EdiMockFactory.createMockDocument(documentContent);
      const range = EdiMockFactory.createMockRange(documentContent);
      const token = EdiMockFactory.createMockCancellationToken();

      const result = await provider.provideInlayHints(document, range, token);

      assert.equal(result?.length, 21);

      // PO1Loop1/PID02
      assert.ok(result?.some(h => h.label === "Product"));
    });
  });

  suite("getLanguageId", () => {
    test("Should return correct language ID", () => {
      assert.strictEqual(provider.getLanguageId(), "x12");
    });
  });

  suite("resolveInlayHint", () => {
    test("Should return the original hint", () => {
      const hint = new vscode.InlayHint(new vscode.Position(0, 0), "value");
      assert.strictEqual(provider.resolveInlayHint!(hint, EdiMockFactory.createMockCancellationToken()), hint);
    });
  });
});

suite("InlayHintsEdiVdaProvider Test Suite", () => {
  let provider: InlayHintsEdiVdaProvider;
  let originalGetConfiguration: typeof vscode.workspace.getConfiguration;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalGetElementStartPosition: typeof EdiUtils.getElementStartPosition;

  setup(() => {
    provider = new InlayHintsEdiVdaProvider();
    originalGetConfiguration = vscode.workspace.getConfiguration;
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalGetElementStartPosition = EdiUtils.getElementStartPosition;
  });

  teardown(() => {
    vscode.workspace.getConfiguration = originalGetConfiguration;
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).getElementStartPosition = originalGetElementStartPosition;
  });

  test("Should return empty array when VDA element index annotations are disabled", async () => {
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableElementIndexAnnotation]: false,
    });

    const result = await provider.provideInlayHints(
      EdiMockFactory.createMockDocument("5110200000000000000000000", "vda"),
      new vscode.Range(0, 0, 0, 0),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.deepStrictEqual(result, []);
  });

  test("Should return empty array when parser is unavailable", async () => {
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableElementIndexAnnotation]: true,
    });
    (EdiUtils as any).getEdiParser = () => ({ parser: undefined });

    const result = await provider.provideInlayHints(
      EdiMockFactory.createMockDocument("5110200000000000000000000", "vda"),
      new vscode.Range(0, 0, 0, 0),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.deepStrictEqual(result, []);
  });

  test("Should provide element index hints for VDA elements", async () => {
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableElementIndexAnnotation]: true,
    });

    const document = EdiMockFactory.createMockDocument("5110200000000000000000000", "vda");
    const segment = {
      elements: [
        { designatorIndex: "01" },
        { designatorIndex: "02" },
      ],
    };
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
    });
    (EdiUtils as any).getElementStartPosition = (_document: vscode.TextDocument, _segment: unknown, element: { designatorIndex: string }) =>
      new vscode.Position(0, element.designatorIndex === "01" ? 1 : 5);

    const result = await provider.provideInlayHints(
      document,
      new vscode.Range(0, 0, 0, 10),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.strictEqual(result?.length, 2);
    assert.strictEqual(result?.[0].label, "01");
    assert.strictEqual(result?.[1].label, "02");
    assert.strictEqual(result?.[0].paddingLeft, true);
  });
});

suite("InlayHints Concrete Provider Test Suite", () => {
  let originalRegisterInlayHintsProvider: typeof vscode.languages.registerInlayHintsProvider;

  setup(() => {
    originalRegisterInlayHintsProvider = vscode.languages.registerInlayHintsProvider;
  });

  teardown(() => {
    vscode.languages.registerInlayHintsProvider = originalRegisterInlayHintsProvider;
  });

  test("Should expose concrete language IDs", () => {
    assert.strictEqual(new InlayHintsEdiX12Provider().getLanguageId(), EdiType.X12);
    assert.strictEqual(new InlayHintsEdiEdifactProvider().getLanguageId(), EdiType.EDIFACT);
    assert.strictEqual(new InlayHintsEdiVdaProvider().getLanguageId(), EdiType.VDA);
  });

  test("Should register inlay hint providers for each concrete language", () => {
    const registeredLanguages: string[] = [];
    vscode.languages.registerInlayHintsProvider = (
      selector: vscode.DocumentSelector,
      providerInstance: vscode.InlayHintsProvider,
    ): vscode.Disposable => {
      const language = (selector as vscode.DocumentFilter).language;
      if (language) {
        registeredLanguages.push(language);
      }
      assert.ok(providerInstance instanceof InlayHintsEdiProvider);
      return new vscode.Disposable(() => {});
    };

    const disposables = [
      ...new InlayHintsEdiX12Provider().registerFunctions(),
      ...new InlayHintsEdiEdifactProvider().registerFunctions(),
      ...new InlayHintsEdiVdaProvider().registerFunctions(),
    ];

    assert.strictEqual(disposables.length, 3);
    assert.deepStrictEqual(registeredLanguages, [EdiType.X12, EdiType.EDIFACT, EdiType.VDA]);
  });
});
