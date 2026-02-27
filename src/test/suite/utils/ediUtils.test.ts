import * as assert from "assert";
import * as vscode from "vscode";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiType, EdiSegment, EdiElement } from "../../../parser/entities";
import { EdiMockFactory } from "../mocks/ediMockFactory";
import { X12Parser } from "../../../parser/x12Parser";
import { EdifactParser } from "../../../parser/edifactParser";
import { VdaParser } from "../../../parser/vdaParser";

suite("EdiUtils Test Suite", () => {
  let originalSetTextDocumentLanguage: typeof vscode.languages.setTextDocumentLanguage;

  setup(() => {
    originalSetTextDocumentLanguage = vscode.languages.setTextDocumentLanguage;
    EdiUtils.clearCache();
  });

  teardown(() => {
    vscode.languages.setTextDocumentLanguage = originalSetTextDocumentLanguage;
    EdiUtils.clearCache();
  });

  suite("Document Type Detection", () => {
    test("isX12 should detect by languageId and content", () => {
      const x12Doc = EdiMockFactory.createMockDocument("ISA*00*...~", EdiType.X12);
      const plainX12Doc = EdiMockFactory.createMockDocument("  \n ISA*00*...~", "plaintext");

      assert.strictEqual(EdiUtils.isX12(x12Doc), true);
      assert.strictEqual(EdiUtils.isX12(plainX12Doc), true);
    });

    test("isEdifact should detect by UNA/UNB/UNH", () => {
      assert.strictEqual(EdiUtils.isEdifact(EdiMockFactory.createMockDocument("UNA:+.?*'", "plaintext")), true);
      assert.strictEqual(EdiUtils.isEdifact(EdiMockFactory.createMockDocument("UNB+UNOA:2+S:R+R:S+240101:1010+1'", "plaintext")), true);
      assert.strictEqual(EdiUtils.isEdifact(EdiMockFactory.createMockDocument("UNH+1+ORDERS:D:96A:UN'", "plaintext")), true);
    });

    test("isVda should detect by 511/711", () => {
      assert.strictEqual(EdiUtils.isVda(EdiMockFactory.createMockDocument("51102....", "plaintext")), true);
      assert.strictEqual(EdiUtils.isVda(EdiMockFactory.createMockDocument("71103....", "plaintext")), true);
    });

    test("isDocumentSupported and isLanguageSupported should work", () => {
      const unsupported = EdiMockFactory.createMockDocument("ABC", "plaintext");
      const supported = EdiMockFactory.createMockDocument("ISA*00*...~", "plaintext");

      assert.strictEqual(EdiUtils.isDocumentSupported(unsupported), false);
      assert.strictEqual(EdiUtils.isDocumentSupported(supported), true);
      assert.strictEqual(EdiUtils.isLanguageSupported(EdiType.X12), true);
      assert.strictEqual(EdiUtils.isLanguageSupported("plaintext"), false);
    });
  });

  suite("Parser Resolution", () => {
    test("getEdiParserInternal should return expected parser by content", () => {
      const x12Result = EdiUtils.getEdiParserInternal(EdiMockFactory.createMockDocument("ISA*00*...~", "plaintext"));
      const edifactResult = EdiUtils.getEdiParserInternal(EdiMockFactory.createMockDocument("UNA:+.?*'", "plaintext"));
      const vdaResult = EdiUtils.getEdiParserInternal(EdiMockFactory.createMockDocument("51102....", "plaintext"));
      const unknownResult = EdiUtils.getEdiParserInternal(EdiMockFactory.createMockDocument("RANDOM", "plaintext"));

      assert.strictEqual(x12Result.ediType, EdiType.X12);
      assert.strictEqual(x12Result.parser instanceof X12Parser, true);
      assert.strictEqual(edifactResult.ediType, EdiType.EDIFACT);
      assert.strictEqual(edifactResult.parser instanceof EdifactParser, true);
      assert.strictEqual(vdaResult.ediType, EdiType.VDA);
      assert.strictEqual(vdaResult.parser instanceof VdaParser, true);
      assert.strictEqual(unknownResult.ediType, EdiType.UNKNOWN);
      assert.strictEqual(unknownResult.parser, undefined);
    });

    test("getEdiParser should cache result and set language when needed", async () => {
      const doc = EdiMockFactory.createMockDocument("ISA*00*...~", "plaintext");
      let setLanguageCallCount = 0;
      vscode.languages.setTextDocumentLanguage = async () => {
        setLanguageCallCount += 1;
        return doc;
      };

      const first = EdiUtils.getEdiParser(doc);
      const second = EdiUtils.getEdiParser(doc);

      assert.strictEqual(first.ediType, EdiType.X12);
      assert.strictEqual(first.parser === second.parser, true);
      assert.strictEqual(setLanguageCallCount >= 1, true);
    });

    test("clearCache should force parser recreation", () => {
      const doc = EdiMockFactory.createMockDocument("ISA*00*...~", "plaintext");
      vscode.languages.setTextDocumentLanguage = async () => doc;

      const beforeClear = EdiUtils.getEdiParser(doc);
      EdiUtils.clearCache();
      const afterClear = EdiUtils.getEdiParser(doc);

      assert.strictEqual(beforeClear.parser === afterClear.parser, false);
    });
  });

  suite("Range and Position Helpers", () => {
    test("getSegmentIdRange should return exact segment id span", async () => {
      const content = "ST*850*0001~";
      const parser = new X12Parser(content);
      const ediDocument = await parser.parse();
      const segment = ediDocument.getSegments()[0] as EdiSegment;
      const document = EdiMockFactory.createMockDocument(content, "x12");

      const range = EdiUtils.getSegmentIdRange(document, segment);
      const selected = content.substring(document.offsetAt(range.start), document.offsetAt(range.end));

      assert.strictEqual(selected, "ST");
    });

    test("getElementRange and getElementWithoutSeparatorRange should locate element text", async () => {
      const content = "ST*850*0001~";
      const parser = new X12Parser(content);
      const ediDocument = await parser.parse();
      const segment = ediDocument.getSegments()[0] as EdiSegment;
      const element = segment.elements[0] as EdiElement;
      const document = EdiMockFactory.createMockDocument(content, "x12");

      const range = EdiUtils.getElementRange(document, segment, element);
      const withoutSeparatorRange = EdiUtils.getElementWithoutSeparatorRange(document, segment, element);

      const withSeparatorText = content.substring(document.offsetAt(range.start), document.offsetAt(range.end));
      const withoutSeparatorText = content.substring(document.offsetAt(withoutSeparatorRange.start), document.offsetAt(withoutSeparatorRange.end));

      assert.strictEqual(withSeparatorText, "*850");
      assert.strictEqual(withoutSeparatorText, "850");
    });

    test("getSegmentOrElementByPosition should find active segment and element", async () => {
      const content = "ST*850*0001~SE*2*0001~";
      const parser = new X12Parser(content);
      const ediDocument = await parser.parse();
      const segments = ediDocument.getSegments();
      const first = segments[0] as EdiSegment;
      const firstElement = first.elements[0] as EdiElement;
      const position = first.startIndex + firstElement.startIndex + 2;

      const active = EdiUtils.getSegmentOrElementByPosition(position, segments);

      assert.strictEqual(active.segment?.id, "ST");
      assert.strictEqual(active.element?.value, "850");
    });
  });
});
