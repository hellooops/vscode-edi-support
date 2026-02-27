import * as assert from "assert";
import * as vscode from "vscode";
import { InlayHintsEdiProvider } from "../../../providers/inlayHintsEdiProvider";
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

  setup(() => {
    provider = new TestInlayHintsEdiProvider();
    originalGetConfiguration = vscode.workspace.getConfiguration;
  });

  teardown(() => {
    // 恢复原始的getConfiguration方法
    vscode.workspace.getConfiguration = originalGetConfiguration;
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
});
