import * as assert from "assert";

import { EdifactParser } from "../../parser/edifactParser";
import { X12Parser } from "../../parser/x12Parser";
import { EdiReleaseSchema } from "../../schemas/schemas";

suite("Extension Integration Test Suite", () => {
  suite("Schema Integration", () => {
    test("EDIFACT Load Schema", async () => {
      const rawReleaseSchema = await import("./test-files/D96A-sample.json");
      const releaseSchema = new EdiReleaseSchema(rawReleaseSchema);
      assert.strictEqual(releaseSchema.release, "D96A");
      assert.strictEqual(releaseSchema.qualifiers["Process type identification"].find(q => q.value === "1")!.desc, "Wood preparation");

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
  });

  suite("Cross-Format Integration", () => {
    test("Both X12 and EDIFACT can be parsed in same session", async () => {
      // Parse X12 document
      const x12DocumentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*004010~
      ST*850*0001~
      BEG*00*DS*PO1**20150708~
      SE*3*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const x12Parser = new X12Parser(x12DocumentStr);
      const x12Document = await x12Parser.parse();

      // Parse EDIFACT document
      const edifactDocumentStr = `
      UNA:+.?*'
      UNB+UNOA:2+<Sender GLN>:14+<Receiver GLN>:14+140407:0910+0001'
      UNH+001+ORDERS:D:96A:UN:EAN001'
      BGM+220+PO1+9'
      UNT+3+001'
      UNZ+1+0001'
      `;
      const edifactParser = new EdifactParser(edifactDocumentStr);
      const edifactDocument = await edifactParser.parse();

      // Verify both were parsed
      assert.strictEqual(x12Document.interchanges.length, 1);
      assert.strictEqual(x12Document.interchanges[0].functionalGroups.length, 1);
      assert.strictEqual(x12Document.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "850");

      assert.strictEqual(edifactDocument.interchanges.length, 1);
      assert.strictEqual(edifactDocument.interchanges[0].functionalGroups.length, 1);
      assert.strictEqual(edifactDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "ORDERS");
    });
  });
});
