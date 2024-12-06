import * as assert from "assert";

import { EdifactParser } from "../../parser/edifactParser";
import { X12Parser } from "../../parser/x12Parser";
import { EdiSegment, ElementType, EdiDocument } from "../../parser/entities";
import { EdiReleaseSchema } from "../../schemas/schemas";

suite("Extension Test Suite", () => {

  test("Edifact Parse Meta", async () => {
    const documentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
    const parser = new EdifactParser(documentStr);
    const ediDocument: EdiDocument = await parser.parse()!;

    assert.strictEqual(ediDocument.interchanges.length, 1);
    assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
    assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);

    const meta = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta;
    assert.strictEqual(meta.release, "D96A");
    assert.strictEqual(meta.version, "ORDERS");
    assert.strictEqual(meta.id, "1");
  });

  test("Edifact Parse Segment", async () => {
    const documentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
    const parser = new EdifactParser(documentStr);

    const ediDocument: EdiDocument = await parser.parse()!;
    const segments = ediDocument.getSegments();
    assert.strictEqual(segments.length, 1);

    const segment = segments[0];
    assert.strictEqual(segment.id, "UNH");
    assert.strictEqual(segment.elements.length, 2);
    assert.strictEqual(segment.endingDelimiter, "'");
    assert.strictEqual(segment.length, 29);
    assert.strictEqual(segment.startIndex, 0);
    assert.strictEqual(segment.endIndex, 28);

    // +1
    assert.strictEqual(segment.elements[0].designatorIndex, "01");
    assert.strictEqual(segment.elements[0].separator, "+");
    assert.strictEqual(segment.elements[0].startIndex, 3);
    assert.strictEqual(segment.elements[0].endIndex, 4);
    assert.strictEqual(segment.elements[0].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[0].value, "1");
    assert.strictEqual(segment.elements[0].components, undefined);

    // +ORDERS:D:96A:UN:EAN008
    assert.strictEqual(segment.elements[1].designatorIndex, "02");
    assert.strictEqual(segment.elements[1].separator, "+");
    assert.strictEqual(segment.elements[1].startIndex, 5);
    assert.strictEqual(segment.elements[1].endIndex, 27);
    assert.strictEqual(segment.elements[1].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[1].value, "ORDERS:D:96A:UN:EAN008");
    assert.strictEqual(segment.elements[1].components!.length, 5);

    // +ORDERS
    assert.strictEqual(segment.elements[1].components![0].designatorIndex, "0201");
    assert.strictEqual(segment.elements[1].components![0].separator, "+");
    assert.strictEqual(segment.elements[1].components![0].startIndex, 5);
    assert.strictEqual(segment.elements[1].components![0].endIndex, 11);
    assert.strictEqual(segment.elements[1].components![0].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components![0].value, "ORDERS");

    // :D
    assert.strictEqual(segment.elements[1].components![1].designatorIndex, "0202");
    assert.strictEqual(segment.elements[1].components![1].separator, ":");
    assert.strictEqual(segment.elements[1].components![1].startIndex, 12);
    assert.strictEqual(segment.elements[1].components![1].endIndex, 13);
    assert.strictEqual(segment.elements[1].components![1].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components![1].value, "D");

    // :96A
    assert.strictEqual(segment.elements[1].components![2].designatorIndex, "0203");
    assert.strictEqual(segment.elements[1].components![2].separator, ":");
    assert.strictEqual(segment.elements[1].components![2].startIndex, 14);
    assert.strictEqual(segment.elements[1].components![2].endIndex, 17);
    assert.strictEqual(segment.elements[1].components![2].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components![2].value, "96A");

    // :UN
    assert.strictEqual(segment.elements[1].components![3].designatorIndex, "0204");
    assert.strictEqual(segment.elements[1].components![3].separator, ":");
    assert.strictEqual(segment.elements[1].components![3].startIndex, 18);
    assert.strictEqual(segment.elements[1].components![3].endIndex, 20);
    assert.strictEqual(segment.elements[1].components![3].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components![3].value, "UN");

    // :EAN008
    assert.strictEqual(segment.elements[1].components![4].designatorIndex, "0205");
    assert.strictEqual(segment.elements[1].components![4].separator, ":");
    assert.strictEqual(segment.elements[1].components![4].startIndex, 21);
    assert.strictEqual(segment.elements[1].components![4].endIndex, 27);
    assert.strictEqual(segment.elements[1].components![4].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components![4].value, "EAN008");
  });

  test("Edifact Load Schema", async () => {
    const rawReleaseSchema = await import("./test-files/D96A-sample.json");
    const releaseSchema = new EdiReleaseSchema(rawReleaseSchema);
    assert.strictEqual(releaseSchema.release, "D96A");
    assert.strictEqual(releaseSchema.qualifiers["Process type identification"].find(q => q.value ==="1")!.desc, "Wood preparation");

    const ADR = releaseSchema.segments["ADR"];
    assert.strictEqual(ADR.desc, "ADDRESS");
    assert.strictEqual(ADR.purpose, "To specify an address.");
    assert.strictEqual(ADR.elements.length, 7);

    const ADR01 = ADR.elements[0];
    assert.strictEqual(ADR01.id, "C817");
    assert.strictEqual(ADR01.desc, "ADDRESS USAGE");
    assert.strictEqual(ADR01.required, false);
    assert.strictEqual(ADR01.definition, "To describe the usage of an address.");
    assert.strictEqual(ADR01.components.length, 3);

    const ADR0101 = ADR01.components[0];
    assert.strictEqual(ADR0101.id, "3299");
    assert.strictEqual(ADR0101.desc, "Address purpose, coded");
    assert.strictEqual(ADR0101.dataType, "AN");
    assert.strictEqual(ADR0101.required, false);
    assert.strictEqual(ADR0101.minLength, 0);
    assert.strictEqual(ADR0101.maxLength, 3);
    assert.strictEqual(ADR0101.qualifierRef, "Address purpose, coded");
    assert.strictEqual(ADR0101.definition, "To specify the purpose of the address.");
  });

  test("X12 Parse Version", async () => {
    const documentStr = `
    ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
    GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
    ST*850*0001~`;
    const parser = new X12Parser(documentStr);
    const ediDocument: EdiDocument = await parser.parse()!;

    assert.strictEqual(ediDocument.interchanges.length, 1);
    assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
    assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);

    const meta = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta;
    assert.strictEqual(meta.release, "00401");
    assert.strictEqual(meta.version, "850");
    assert.strictEqual(meta.id, "0001");
  });

  test("X12 Parse Version 2", async () => {
    const documentStr = `
    ISA+00+          +00+          +ZZ+DERICL         +ZZ+TEST01         +210517+0643+U+00401+000007080+0+P+>~
    GS+PO+DERICL+TEST01+20210517+0643+7080+X+004010~
    ST+850+0001~`;
    const parser = new X12Parser(documentStr);
    const ediDocument: EdiDocument = await parser.parse()!;

    assert.strictEqual(ediDocument.interchanges.length, 1);
    assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
    assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);

    const meta = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta;
    assert.strictEqual(meta.release, "00401");
    assert.strictEqual(meta.version, "850");
    assert.strictEqual(meta.id, "0001");
  });

  test("X12 Parse Version 3", async () => {
    const documentStr = `
    ISA+00+          +00+          +ZZ+DERICL         +ZZ+TEST01         +210517+0643+U+00400+000007080+0+P+>~
    GS+PO+DERICL+TEST01+20210517+0643+7080+X+004010~
    ST+850+0001~`;
    const parser = new X12Parser(documentStr);
    const ediDocument: EdiDocument = await parser.parse()!;

    assert.strictEqual(ediDocument.interchanges.length, 1);
    assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
    assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);

    const meta = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta;
    assert.strictEqual(meta.release, "00401");
    assert.strictEqual(meta.version, "850");
    assert.strictEqual(meta.id, "0001");
  });

  test("X12 Parse Segment", async () => {
    const documentStr = "SV2*0730*HC>93010*76.56*UN*3~";
    const parser = new X12Parser(documentStr);
    parser.setMessageSeparators({ segmentSeparator: "~", dataElementSeparator: "*", componentElementSeparator: ">" });
    await parser.loadSchema({release: "00401", version: "850"})

    const segment: EdiSegment = await parser.parseSegment(documentStr, 0, documentStr.length - 1, "~");

    assert.strictEqual(segment.id, "SV2");
    assert.strictEqual(segment.elements.length, 5);
    assert.strictEqual(segment.endingDelimiter, "~");
    assert.strictEqual(segment.length, 29);
    assert.strictEqual(segment.startIndex, 0);
    assert.strictEqual(segment.endIndex, 28);

    // *0730
    assert.strictEqual(segment.elements[0].designatorIndex, "01");
    assert.strictEqual(segment.elements[0].separator, "*");
    assert.strictEqual(segment.elements[0].startIndex, 3);
    assert.strictEqual(segment.elements[0].endIndex, 7);
    assert.strictEqual(segment.elements[0].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[0].value, "0730");
    assert.strictEqual(segment.elements[0].components, undefined);

    // *HC>93010
    assert.strictEqual(segment.elements[1].designatorIndex, "02");
    assert.strictEqual(segment.elements[1].separator, "*");
    assert.strictEqual(segment.elements[1].startIndex, 8);
    assert.strictEqual(segment.elements[1].endIndex, 16);
    assert.strictEqual(segment.elements[1].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[1].value, "HC>93010");
    assert.strictEqual(segment.elements[1].components!.length, 2);

    // *HC
    assert.strictEqual(segment.elements[1].components![0].designatorIndex, "0201");
    assert.strictEqual(segment.elements[1].components![0].separator, "*");
    assert.strictEqual(segment.elements[1].components![0].startIndex, 8);
    assert.strictEqual(segment.elements[1].components![0].endIndex, 10);
    assert.strictEqual(segment.elements[1].components![0].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components![0].value, "HC");

    // >93010
    assert.strictEqual(segment.elements[1].components![1].designatorIndex, "0202");
    assert.strictEqual(segment.elements[1].components![1].separator, ">");
    assert.strictEqual(segment.elements[1].components![1].startIndex, 11);
    assert.strictEqual(segment.elements[1].components![1].endIndex, 16);
    assert.strictEqual(segment.elements[1].components![1].type, ElementType.componentElement);
    assert.strictEqual(segment.elements[1].components![1].value, "93010");

    // *76.56
    assert.strictEqual(segment.elements[2].designatorIndex, "03");
    assert.strictEqual(segment.elements[2].separator, "*");
    assert.strictEqual(segment.elements[2].startIndex, 17);
    assert.strictEqual(segment.elements[2].endIndex, 22);
    assert.strictEqual(segment.elements[2].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[2].value, "76.56");
    assert.strictEqual(segment.elements[2].components, undefined);

    // *UN
    assert.strictEqual(segment.elements[3].designatorIndex, "04");
    assert.strictEqual(segment.elements[3].separator, "*");
    assert.strictEqual(segment.elements[3].startIndex, 23);
    assert.strictEqual(segment.elements[3].endIndex, 25);
    assert.strictEqual(segment.elements[3].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[3].value, "UN");
    assert.strictEqual(segment.elements[3].components, undefined);

    // *3
    assert.strictEqual(segment.elements[4].designatorIndex, "05");
    assert.strictEqual(segment.elements[4].separator, "*");
    assert.strictEqual(segment.elements[4].startIndex, 26);
    assert.strictEqual(segment.elements[4].endIndex, 27);
    assert.strictEqual(segment.elements[4].type, ElementType.dataElement);
    assert.strictEqual(segment.elements[4].value, "3");
    assert.strictEqual(segment.elements[4].components, undefined);
  });

  test("X12 Parse Separators 1", async () => {
    const documentStr = `ISA*00*          *00*          *ZZ*1234567890     *ZZ*ABCDEFGH       *230705*1100*U*00400*000000001*0*P*>^`;
    const parser = new X12Parser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "^");
    assert.strictEqual(separators.dataElementSeparator, "*");
    assert.strictEqual(separators.componentElementSeparator, ">");
  });

  test("X12 Parse Separators 2", async () => {
    const documentStr = `ISA*00**00* *ZZ*1234567890*ZZ*ABCDEFGH*230705*1100*U*00400*000000001*0*P*>^
    GS*PO*1234567890*ABCDEFGH*20030705*1100*1*X*004010^`;
    const parser = new X12Parser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "^");
    assert.strictEqual(separators.dataElementSeparator, "*");
    assert.strictEqual(separators.componentElementSeparator, ">");
  });

  test("X12 Parse Separators 3", async () => {
    const documentStr = `ISA*00**00* *ZZ*1234567890*ZZ*ABCDEFGH*230705*1100*U*00400*000000001*0*P*>\nGS*PO*1234567890*ABCDEFGH*20030705*1100*1*X*004010\n`;
    const parser = new X12Parser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "\n");
    assert.strictEqual(separators.dataElementSeparator, "*");
    assert.strictEqual(separators.componentElementSeparator, ">");
  });

  test("Edifact Parse Separators 1", async () => {
    const documentStr = ``;
    const parser = new EdifactParser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "'");
    assert.strictEqual(separators.dataElementSeparator, "+");
    assert.strictEqual(separators.componentElementSeparator, ":");
    assert.strictEqual(separators.releaseCharacter, "?");
  });

  test("Edifact Parse Separators 2", async () => {
    const documentStr = `UNB+UNOB:3+ + +180123:1127+000000128`;
    const parser = new EdifactParser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "'");
    assert.strictEqual(separators.dataElementSeparator, "+");
    assert.strictEqual(separators.componentElementSeparator, ":");
    assert.strictEqual(separators.releaseCharacter, "?");
  });

  test("Edifact Parse Separators 3-1", async () => {
    const documentStr = `UNA:+.?*'`;
    const parser = new EdifactParser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "'");
    assert.strictEqual(separators.dataElementSeparator, "+");
    assert.strictEqual(separators.componentElementSeparator, ":");
    assert.strictEqual(separators.releaseCharacter, "?");
  });

  test("Edifact Parse Separators 3-2", async () => {
    const documentStr = `UNA123456`;
    const parser = new EdifactParser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "6");
    assert.strictEqual(separators.dataElementSeparator, "2");
    assert.strictEqual(separators.componentElementSeparator, "1");
    assert.strictEqual(separators.releaseCharacter, "4");
  });

  test("Edifact Parse Separators 4", async () => {
    const documentStr = `UNA:+.?*\r\nUNB+UNOB:3+ + +180123:1127+000000128'`;
    const parser = new EdifactParser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "\r");
    assert.strictEqual(separators.dataElementSeparator, "+");
    assert.strictEqual(separators.componentElementSeparator, ":");
    assert.strictEqual(separators.releaseCharacter, "?");
  });

  test("Edifact Parse Separators 5", async () => {
    const documentStr = `UNA:+.?*\nUNB+UNOB:3+ + +180123:1127+000000128`;
    const parser = new EdifactParser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "\n");
    assert.strictEqual(separators.dataElementSeparator, "+");
    assert.strictEqual(separators.componentElementSeparator, ":");
    assert.strictEqual(separators.releaseCharacter, "?");
  });

  suite("Parse Document", () => {
    test("X12 1", async () => {
      const documentStr = `
ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~

GS*PO*  *  *20241111*0300*1*T*004010~

ST*850*0001~
BEG*00*DS*PO1**20150708~
SE*3*0001~

ST*864*0002~
BMG*00**03~
SE*3*0002~

GE*2*1~

GS*PO*  *  *20241111*0300*2*T*004010~
ST*850*0003~
BEG*00*DS*PO3**20150708~
SE*3*0003~
GE*1*2~

IEA*2*000000001~
`;
      const parser = new X12Parser(documentStr);
      const document = await parser.parse();


      assert.strictEqual(document.separatorsSegment, undefined);
      assert.strictEqual(document.startSegment, undefined);
      assert.strictEqual(document.endSegment, undefined);
      assert.strictEqual(document.interchanges.length, 1);

      // Interchange 1
      assert.strictEqual(document.interchanges[0].getId(), "000000001");
      assert.ok(document.interchanges[0].startSegment);
      assert.strictEqual(document.interchanges[0].startSegment.id, "ISA");
      assert.ok(document.interchanges[0].endSegment);
      assert.strictEqual(document.interchanges[0].endSegment.id, "IEA");
      assert.strictEqual(document.interchanges[0].functionalGroups.length, 2);

      // Interchange 1 - FunctionalGroup 1
      assert.strictEqual(document.interchanges[0].functionalGroups[0].getId(), "1");
      assert.strictEqual(document.interchanges[0].functionalGroups[0].isFake(), false);
      assert.ok(document.interchanges[0].functionalGroups[0].startSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].startSegment.id, "GS");
      assert.ok(document.interchanges[0].functionalGroups[0].endSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].endSegment.id, "GE");
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets.length, 2);

      // Interchange 1 - FunctionalGroup 1 - TransactionSet 1
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[0].getId(), "0001");
      assert.ok(document.interchanges[0].functionalGroups[0].transactionSets[0].startSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[0].startSegment.id, "ST");
      assert.ok(document.interchanges[0].functionalGroups[0].transactionSets[0].endSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[0].endSegment.id, "SE");
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[0].segments.length, 1);

      // Interchange 1 - FunctionalGroup 1 - TransactionSet 2
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[1].getId(), "0002");
      assert.ok(document.interchanges[0].functionalGroups[0].transactionSets[1].startSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[1].startSegment.id, "ST");
      assert.ok(document.interchanges[0].functionalGroups[0].transactionSets[1].endSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[1].endSegment.id, "SE");
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[1].segments.length, 1);

      // Interchange 1 - FunctionalGroup 2
      assert.strictEqual(document.interchanges[0].functionalGroups[1].getId(), "2");
      assert.strictEqual(document.interchanges[0].functionalGroups[1].isFake(), false);
      assert.ok(document.interchanges[0].functionalGroups[1].startSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[1].startSegment.id, "GS");
      assert.ok(document.interchanges[0].functionalGroups[1].endSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[1].endSegment.id, "GE");
      assert.strictEqual(document.interchanges[0].functionalGroups[1].transactionSets.length, 1);

      // Interchange 1 - FunctionalGroup 2 - TransactionSet 1
      assert.strictEqual(document.interchanges[0].functionalGroups[1].transactionSets[0].getId(), "0003");
      assert.ok(document.interchanges[0].functionalGroups[1].transactionSets[0].startSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[1].transactionSets[0].startSegment.id, "ST");
      assert.ok(document.interchanges[0].functionalGroups[1].transactionSets[0].endSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[1].transactionSets[0].endSegment.id, "SE");
      assert.strictEqual(document.interchanges[0].functionalGroups[1].transactionSets[0].segments.length, 1);
    });

    test("Edifact 1", async () => {
      const documentStr = `
UNA:+.?*'

UNB+UNOA:2+<Sender GLN>:14+<Receiver GLN>:14+140407:0910+0001'
UNH+001+ORDERS:D:96A:UN:EAN001'
BGM+220+PO1+9'
UNT+3+001'

UNH+002+DESADV:D:96A:UN:EAN001'
BGM+351+20171229'
UNT+3+002'
UNZ+2+0001'

UNB+UNOA:2+<Sender GLN>:14+<Receiver GLN>:14+140407:0910+0002'
UNH+003+ORDERS:D:96A:UN:EAN001'
BGM+220+PO3+9'
UNT+3+003'
UNZ+1+0002'
`;
      const parser = new EdifactParser(documentStr);
      const document = await parser.parse();

      assert.ok(document.separatorsSegment !== undefined);
      assert.strictEqual(document.startSegment, undefined);
      assert.strictEqual(document.endSegment, undefined);
      assert.strictEqual(document.interchanges.length, 2);

      // Interchange 1
      assert.strictEqual(document.interchanges[0].getId(), "0001");
      assert.ok(document.interchanges[0].startSegment);
      assert.strictEqual(document.interchanges[0].startSegment.id, "UNB");
      assert.ok(document.interchanges[0].endSegment);
      assert.strictEqual(document.interchanges[0].endSegment.id, "UNZ");
      assert.strictEqual(document.interchanges[0].functionalGroups.length, 1);

      // Interchange 1 - FunctionalGroup 1
      assert.strictEqual(document.interchanges[0].functionalGroups[0].isFake(), true);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].startSegment, undefined);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].endSegment, undefined);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets.length, 2);

      // Interchange 1 - FunctionalGroup 1 - TransactionSet 1
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[0].getId(), "001");
      assert.ok(document.interchanges[0].functionalGroups[0].transactionSets[0].startSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[0].startSegment.id, "UNH");
      assert.ok(document.interchanges[0].functionalGroups[0].transactionSets[0].endSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[0].endSegment.id, "UNT");
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[0].segments.length, 1);

      // Interchange 1 - FunctionalGroup 1 - TransactionSet 2
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[1].getId(), "002");
      assert.ok(document.interchanges[0].functionalGroups[0].transactionSets[1].startSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[1].startSegment.id, "UNH");
      assert.ok(document.interchanges[0].functionalGroups[0].transactionSets[1].endSegment);
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[1].endSegment.id, "UNT");
      assert.strictEqual(document.interchanges[0].functionalGroups[0].transactionSets[1].segments.length, 1);

      // Interchange 2
      assert.strictEqual(document.interchanges[1].getId(), "0002");
      assert.ok(document.interchanges[1].startSegment);
      assert.strictEqual(document.interchanges[1].startSegment.id, "UNB");
      assert.ok(document.interchanges[1].endSegment);
      assert.strictEqual(document.interchanges[1].endSegment.id, "UNZ");
      assert.strictEqual(document.interchanges[1].functionalGroups.length, 1);

      // Interchange 2 - FunctionalGroup 1
      assert.strictEqual(document.interchanges[1].functionalGroups[0].isFake(), true);
      assert.strictEqual(document.interchanges[1].functionalGroups[0].startSegment, undefined);
      assert.strictEqual(document.interchanges[1].functionalGroups[0].endSegment, undefined);
      assert.strictEqual(document.interchanges[1].functionalGroups[0].transactionSets.length, 1);

      // Interchange 2 - FunctionalGroup 1 - TransactionSet 1
      assert.strictEqual(document.interchanges[1].functionalGroups[0].transactionSets[0].getId(), "003");
      assert.ok(document.interchanges[1].functionalGroups[0].transactionSets[0].startSegment);
      assert.strictEqual(document.interchanges[1].functionalGroups[0].transactionSets[0].startSegment.id, "UNH");
      assert.ok(document.interchanges[1].functionalGroups[0].transactionSets[0].endSegment);
      assert.strictEqual(document.interchanges[1].functionalGroups[0].transactionSets[0].endSegment.id, "UNT");
      assert.strictEqual(document.interchanges[1].functionalGroups[0].transactionSets[0].segments.length, 1);
    });
  });
});
