import * as assert from "assert";

import { X12Parser } from "../../parser/x12Parser";
import { EdifactParser } from "../../parser/edifactParser";

suite("EDI Document with Comments Test Suite", () => {
  suite("X12 Document with Comments", () => {
    test("X12 Document with Inline Comments - Parsing and Validation", async () => {
      const documentStr = `// Purchase Order Header
ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~// ISA segment
GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~// Functional Group
ST*850*0001~// Start Transaction
BEG*00*BK*0019-1234567-1234**20000130~// Begin
REF*IA*3688063*VENDOR NAME~// Reference
SE*5*0001~// End Transaction
GE*1*7080~// End Functional Group
IEA*1*000007080~// End Interchange`;
      
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      // Verify document parsed correctly despite comments
      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);
      
      // Verify metadata
      const interchange = ediDocument.interchanges[0];
      assert.strictEqual(interchange.meta.senderQualifer, "ZZ");
      assert.strictEqual(interchange.meta.senderID, "DERICL         ");
      assert.strictEqual(interchange.meta.receiverQualifer, "ZZ");
      assert.strictEqual(interchange.meta.receiverID, "TEST01         ");
      
      // Verify segments were parsed
      const allSegments = ediDocument.getSegments(true);
      const segmentIds = allSegments.map(s => s.id);
      assert.ok(segmentIds.includes("ISA"));
      assert.ok(segmentIds.includes("GS"));
      assert.ok(segmentIds.includes("ST"));
      assert.ok(segmentIds.includes("BEG"));
      assert.ok(segmentIds.includes("REF"));
      assert.ok(segmentIds.includes("SE"));
      assert.ok(segmentIds.includes("GE"));
      assert.ok(segmentIds.includes("IEA"));
    });

    test("X12 850 Purchase Order with Comments - Real Document Example", async () => {
      // Real example from 850-comments.x12
      const documentStr = `// 1
ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~// 2
// 3
GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~// 4 // 4
// 5
ST*850*0001~// 6
// 7
BEG*00*BK*0019-1234567-1234**20000130~REF*IA*3688063*VENDOR NAME~REF*2H*AD*Ad~// 7.1
N1*BT*Example.com Accounts Payable~// 7.2
N2*asde~// 8
// 9
CTT*1*200~// 10
SE*8*0001~// 11
GE*1*7080~// 12
IEA*1*000007080~// 13
// 14
// 15
// 16
//    17
//18`;
      
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      // Verify document structure
      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);
      
      // Verify interchange metadata
      const interchange = ediDocument.interchanges[0];
      assert.strictEqual(interchange.meta.senderQualifer, "ZZ");
      assert.strictEqual(interchange.meta.senderID, "DERICL         ");
      assert.strictEqual(interchange.meta.receiverQualifer, "ZZ");
      assert.strictEqual(interchange.meta.receiverID, "TEST01         ");
      assert.strictEqual(interchange.meta.date, "210517");
      assert.strictEqual(interchange.meta.time, "0643");
      assert.strictEqual(interchange.meta.id, "000007080");
      
      // Verify functional group metadata
      const fg = interchange.functionalGroups[0];
      assert.strictEqual(fg.meta.date, "20210517");
      assert.strictEqual(fg.meta.time, "0643");
      assert.strictEqual(fg.meta.id, "7080");
      
      // Verify transaction set metadata
      const ts = fg.transactionSets[0];
      assert.strictEqual(ts.meta.version, "850");
      assert.strictEqual(ts.meta.release, "00401");
      assert.strictEqual(ts.meta.id, "0001");
      
      // Verify key segments are present
      const allSegments = ediDocument.getSegments(true);
      const segmentIds = allSegments.map(s => s.id);
      
      assert.ok(segmentIds.includes("ISA"));
      assert.ok(segmentIds.includes("GS"));
      assert.ok(segmentIds.includes("ST"));
      assert.ok(segmentIds.includes("BEG"));
      assert.ok(segmentIds.includes("REF"));
      assert.ok(segmentIds.includes("CTT"));
      assert.ok(segmentIds.includes("SE"));
      assert.ok(segmentIds.includes("GE"));
      assert.ok(segmentIds.includes("IEA"));
      
      // Verify BEG segment content
      const begSegment = allSegments.find(s => s.id === "BEG");
      assert.ok(begSegment);
      assert.strictEqual(begSegment!.elements[0].value, "00");
      assert.strictEqual(begSegment!.elements[1].value, "BK");
      assert.strictEqual(begSegment!.elements[2].value, "0019-1234567-1234");
      assert.strictEqual(begSegment!.elements[4].value, "20000130");
      
      // Verify CTT segment (contains control total)
      const cttSegment = allSegments.find(s => s.id === "CTT");
      assert.ok(cttSegment);
      assert.strictEqual(cttSegment!.elements[0].value, "1");
      assert.strictEqual(cttSegment!.elements[1].value, "200");
    });
  });

  suite("EDIFACT Document with Comments", () => {
    test("EDIFACT Document with Inline Comments - Parsing and Validation", async () => {
      const documentStr = `// EDIFACT Message Header
UNA:+.?*'
UNB+UNOA:2+SUPPLIER:14+BUYER:14+200115:1430+ORDER001'// Interchange
UNH+001+ORDERS:D:96A:UN'// Message Header
BGM+220+PO-001+9'// Beginning
QTY+1:100'// Quantity
UNT+4+001'// Message Trailer
UNZ+1+ORDER001'// End Interchange`;
      
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      // Verify document parsed correctly despite comments
      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);
      
      // Verify metadata
      const interchange = ediDocument.interchanges[0];
      assert.strictEqual(interchange.meta.senderQualifer, "14");
      assert.strictEqual(interchange.meta.senderID, "SUPPLIER");
      assert.strictEqual(interchange.meta.receiverQualifer, "14");
      assert.strictEqual(interchange.meta.receiverID, "BUYER");
      
      // Verify core segments were parsed
      const allSegments = ediDocument.getSegments(true);
      const segmentIds = allSegments.map(s => s.id);
      assert.ok(segmentIds.includes("UNA"));
      assert.ok(segmentIds.includes("UNB"));
      assert.ok(segmentIds.includes("UNH"));
      assert.ok(segmentIds.includes("BGM"));
      assert.ok(segmentIds.includes("UNT"));
      assert.ok(segmentIds.includes("UNZ"));
    });
  });
});
