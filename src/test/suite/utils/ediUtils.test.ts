import * as assert from "assert";
import * as vscode from "vscode";
import { EdiUtils } from "../../../utils/ediUtils";
import {
  EdiComment,
  EdiDocument,
  EdiDocumentSeparators,
  EdiElement,
  EdiFunctionalGroup,
  EdiInterchange,
  EdiSegment,
  EdiTransactionSet,
  EdiType,
  ElementType,
} from "../../../parser/entities";
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

    test("getEdiParser should keep unknown documents unchanged", () => {
      const doc = EdiMockFactory.createMockDocument("not edi", "plaintext");
      let setLanguageCallCount = 0;
      vscode.languages.setTextDocumentLanguage = async () => {
        setLanguageCallCount += 1;
        return doc;
      };

      const result = EdiUtils.getEdiParser(doc);

      assert.strictEqual(result.ediType, EdiType.UNKNOWN);
      assert.strictEqual(result.parser, undefined);
      assert.strictEqual(setLanguageCallCount, 0);
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

    test("Should compute hierarchy, delimiter and comment ranges", () => {
      const fixture = createHierarchyFixture();

      const interchangeRange = EdiUtils.getInterchangeRange(fixture.document, fixture.interchange);
      const functionalGroupRange = EdiUtils.getFunctionalGroupRange(fixture.document, fixture.functionalGroup);
      const transactionSetRange = EdiUtils.getTransactionSetRange(fixture.document, fixture.transactionSet);
      const segmentRange = EdiUtils.getSegmentRange(fixture.document, fixture.refSegment);
      const segmentRangeWithDelimiter = EdiUtils.getSegmentRange(fixture.document, fixture.refSegment, true);
      const delimiterRange = EdiUtils.getSegmentDelimiterRange(fixture.document, fixture.refSegment);
      const commentRange = EdiUtils.getCommentRange(fixture.document, fixture.comment);

      assert.strictEqual(interchangeRange.start.line, 0);
      assert.strictEqual(interchangeRange.end.line, 6);
      assert.strictEqual(functionalGroupRange.start.line, 1);
      assert.strictEqual(functionalGroupRange.end.line, 5);
      assert.strictEqual(transactionSetRange.start.line, 2);
      assert.strictEqual(transactionSetRange.end.line, 4);

      assert.strictEqual(fixture.content.substring(fixture.document.offsetAt(segmentRange.start), fixture.document.offsetAt(segmentRange.end)), "REF*ZZ:AA");
      assert.strictEqual(fixture.content.substring(fixture.document.offsetAt(segmentRangeWithDelimiter.start), fixture.document.offsetAt(segmentRangeWithDelimiter.end)), "REF*ZZ:AA~");
      assert.strictEqual(fixture.content.substring(fixture.document.offsetAt(delimiterRange!.start), fixture.document.offsetAt(delimiterRange!.end)), "~");
      assert.strictEqual(fixture.content.substring(fixture.document.offsetAt(commentRange.start), fixture.document.offsetAt(commentRange.end)), "// memo");

      const newlineDocument = EdiMockFactory.createMockDocument("NTE*NOTE\n", "x12");
      const newlineSegment = createSegmentFromContent("NTE*NOTE\n", "NTE", "NTE*NOTE\n", "\n");
      assert.strictEqual(EdiUtils.getSegmentDelimiterRange(newlineDocument, newlineSegment), null);
    });

    test("Should resolve element separator positions and nested composite elements", () => {
      const fixture = createHierarchyFixture();

      const separatorRange = EdiUtils.getElementSeparatorRange(fixture.document, fixture.refSegment, fixture.compositeElement);
      const componentPosition = fixture.refSegment.startIndex + fixture.componentElement.startIndex + 2;
      const active = EdiUtils.getSegmentOrElementByPosition(componentPosition, [fixture.loopSegment]);
      const missing = EdiUtils.getSegmentOrElementByPosition(fixture.content.length + 5, [fixture.loopSegment]);

      assert.strictEqual(fixture.content.substring(fixture.document.offsetAt(separatorRange.start), fixture.document.offsetAt(separatorRange.end)), "*");
      assert.strictEqual(active.segment?.id, "REF");
      assert.strictEqual(active.element?.designatorIndex, "01-1");
      assert.deepStrictEqual(missing, {});
    });

    test("isOnlySegmentInLine should handle standalone, commented and invalid line layouts", () => {
      const standaloneContent = "REF*ZZ~";
      const standaloneDocument = EdiMockFactory.createMockDocument(standaloneContent, "x12");
      const standaloneSegment = createSegmentFromContent(standaloneContent, "REF", "REF*ZZ~", "~");

      const commentedContent = "REF*ZZ~ // note";
      const commentedDocument = EdiMockFactory.createMockDocument(commentedContent, "x12");
      const commentedSegment = createSegmentFromContent(commentedContent, "REF", "REF*ZZ~", "~");

      const trailingContent = "REF*ZZ~ EXTRA";
      const trailingDocument = EdiMockFactory.createMockDocument(trailingContent, "x12");
      const trailingSegment = createSegmentFromContent(trailingContent, "REF", "REF*ZZ~", "~");

      const multilineContent = "REF*ZZ\nAA~";
      const multilineDocument = EdiMockFactory.createMockDocument(multilineContent, "x12");
      const multilineSegment = createSegmentFromContent(multilineContent, "REF", "REF*ZZ\nAA~", "~");

      assert.strictEqual(EdiUtils.isOnlySegmentInLine(standaloneDocument, standaloneSegment), true);
      assert.strictEqual(EdiUtils.isOnlySegmentInLine(commentedDocument, commentedSegment), true);
      assert.strictEqual(EdiUtils.isOnlySegmentInLine(trailingDocument, trailingSegment), false);
      assert.strictEqual(EdiUtils.isOnlySegmentInLine(multilineDocument, multilineSegment), false);
      assert.strictEqual(EdiUtils.isOnlySegmentInLine(standaloneDocument, undefined as any), false);
    });
  });
});

function createHierarchyFixture() {
  const content = [
    "ISA*00~",
    "GS*PO~",
    "ST*850*0001~",
    "REF*ZZ:AA~",
    "SE*2*0001~",
    "GE*1*1~",
    "IEA*1*0001~",
    "// memo",
  ].join("\n");
  const document = EdiMockFactory.createMockDocument(content, EdiType.X12);

  const separators = new EdiDocumentSeparators();
  separators.segmentSeparator = "~";
  separators.dataElementSeparator = "*";
  separators.componentElementSeparator = ":";

  const ediDocument = new EdiDocument(separators, {
    interchangeStartSegmentName: "ISA",
    interchangeEndSegmentName: "IEA",
    functionalGroupStartSegmentName: "GS",
    functionalGroupEndSegmentName: "GE",
    transactionSetStartSegmentName: "ST",
    transactionSetEndSegmentName: "SE",
  });
  const interchange = new EdiInterchange({ id: "0001" }, ediDocument);
  const functionalGroup = new EdiFunctionalGroup({ id: "1" }, interchange);
  const transactionSet = new EdiTransactionSet({ id: "0001", release: "00401", version: "850" }, functionalGroup);

  const isa = createSegmentFromContent(content, "ISA", "ISA*00~", "~");
  const gs = createSegmentFromContent(content, "GS", "GS*PO~", "~");
  const st = createSegmentFromContent(content, "ST", "ST*850*0001~", "~");
  const refSegment = createSegmentFromContent(content, "REF", "REF*ZZ:AA~", "~");
  const se = createSegmentFromContent(content, "SE", "SE*2*0001~", "~");
  const ge = createSegmentFromContent(content, "GE", "GE*1*1~", "~");
  const iea = createSegmentFromContent(content, "IEA", "IEA*1*0001~", "~");

  const compositeElement = new EdiElement(refSegment, ElementType.dataElement, 3, 8, "*", "REF", refSegment.startIndex, "01");
  compositeElement.value = "ZZ:AA";
  compositeElement.ediReleaseSchemaElement = {
    isComposite: () => true,
  } as any;

  const componentElement = new EdiElement(refSegment, ElementType.componentElement, 6, 8, ":", "REF", refSegment.startIndex, "01-1");
  componentElement.value = "AA";
  compositeElement.components = [componentElement];
  refSegment.elements = [compositeElement];

  const loopSegment = new EdiSegment("REF_LOOP", refSegment.startIndex, refSegment.endIndex, refSegment.length, "~");
  loopSegment.Loop = [refSegment];

  interchange.startSegment = isa;
  interchange.endSegment = iea;
  interchange.functionalGroups.push(functionalGroup);

  functionalGroup.startSegment = gs;
  functionalGroup.endSegment = ge;
  functionalGroup.transactionSets.push(transactionSet);

  transactionSet.startSegment = st;
  transactionSet.segments.push(loopSegment);
  transactionSet.endSegment = se;

  ediDocument.interchanges.push(interchange);

  const commentStart = content.indexOf("// memo");
  const comment = new EdiComment(commentStart, commentStart + "// memo".length - 1, "// memo");

  return {
    content,
    document,
    ediDocument,
    interchange,
    functionalGroup,
    transactionSet,
    refSegment,
    compositeElement,
    componentElement,
    loopSegment,
    comment,
  };
}

function createSegmentFromContent(content: string, id: string, segmentText: string, endingDelimiter: string): EdiSegment {
  const startIndex = content.indexOf(segmentText);
  const endIndex = startIndex + segmentText.length - 1;
  const segment = new EdiSegment(id, startIndex, endIndex, segmentText.length, endingDelimiter);
  segment.segmentStr = segmentText;
  return segment;
}
