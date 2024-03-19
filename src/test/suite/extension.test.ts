import * as assert from "assert";

import * as vscode from "vscode";
import { EdifactParser } from "../../parser/edifactParser";
import { X12Parser } from "../../parser/x12Parser";
import { EdiVersion, EdiSegment, ElementType } from "../../parser/entities";
import { EdiReleaseSchema } from "../../schemas/schemas";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Edifact Parse Version", async () => {
    const documentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
    const parser: EdifactParser = new EdifactParser(documentStr);
    const ediVersion: EdiVersion = (await parser.parseReleaseAndVersion())!;

    assert.strictEqual(ediVersion.release, "D96A");
    assert.strictEqual(ediVersion.version, "ORDERS");
  });

  test("Edifact Parse Segment", async () => {
    const documentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
    const parser: EdifactParser = new EdifactParser(documentStr);
    const segment: EdiSegment = await parser.parseSegment(documentStr, 0, documentStr.length - 1, "'");

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
    const parser: X12Parser = new X12Parser(documentStr);
    const ediVersion: EdiVersion = (await parser.parseReleaseAndVersion())!;

    assert.strictEqual(ediVersion.release, "00401");
    assert.strictEqual(ediVersion.version, "850");
  });

  test("X12 Parse Version 2", async () => {
    const documentStr = `
    ISA+00+          +00+          +ZZ+DERICL         +ZZ+TEST01         +210517+0643+U+00401+000007080+0+P+>~
    GS+PO+DERICL+TEST01+20210517+0643+7080+X+004010~
    ST+850+0001~`;
    const parser: X12Parser = new X12Parser(documentStr);
    const ediVersion: EdiVersion = (await parser.parseReleaseAndVersion())!;

    assert.strictEqual(ediVersion.release, "00401");
    assert.strictEqual(ediVersion.version, "850");
  });

  test("X12 Parse Version 3", async () => {
    const documentStr = `
    ISA+00+          +00+          +ZZ+DERICL         +ZZ+TEST01         +210517+0643+U+00400+000007080+0+P+>~
    GS+PO+DERICL+TEST01+20210517+0643+7080+X+004010~
    ST+850+0001~`;
    const parser: X12Parser = new X12Parser(documentStr);
    const ediVersion: EdiVersion = (await parser.parseReleaseAndVersion())!;

    assert.strictEqual(ediVersion.release, "00401");
    assert.strictEqual(ediVersion.version, "850");
  });

  test("X12 Parse Segment", async () => {
    const documentStr = "SV2*0730*HC>93010*76.56*UN*3~";
    const parser: X12Parser = new X12Parser(documentStr);
    parser.setMessageSeparators({ segmentSeparator: "~", dataElementSeparator: "*", componentElementSeparator: ">" });
    parser.setEdiVersion(new EdiVersion("00401", "850"));
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
    const parser: X12Parser = new X12Parser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "^");
    assert.strictEqual(separators.dataElementSeparator, "*");
    assert.strictEqual(separators.componentElementSeparator, ">");
  });

  test("X12 Parse Separators 2", async () => {
    const documentStr = `ISA*00**00* *ZZ*1234567890*ZZ*ABCDEFGH*230705*1100*U*00400*000000001*0*P*>^
    GS*PO*1234567890*ABCDEFGH*20030705*1100*1*X*004010^`;
    const parser: X12Parser = new X12Parser(documentStr);
    const separators = parser.getMessageSeparators();
    assert.strictEqual(separators.segmentSeparator, "^");
    assert.strictEqual(separators.dataElementSeparator, "*");
    assert.strictEqual(separators.componentElementSeparator, ">");
  });
});
