import * as assert from "assert";

import { EdifactParser } from "../../parser/edifactParser";
import { EdiSegment, ElementType } from "../../parser/entities";
import { EdiReleaseSchema } from "../../schemas/schemas";

suite("EDIFACT Parser Test Suite", () => {
  suite("Parse Meta", () => {
    test("EDIFACT Parse Interchange and Functional Group Meta", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+<Sender GLN>:14+<Receiver GLN>:14+140407:0910+0001'
      UNH+001+ORDERS:D:96A:UN:EAN001'
      BGM+220+PO1+9'
      UNT+3+001'
      UNZ+1+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      // Verify Interchange Meta
      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.ok(ediDocument.interchanges[0].meta !== undefined);
      assert.strictEqual(ediDocument.interchanges[0].meta.senderQualifer, "14");
      assert.strictEqual(ediDocument.interchanges[0].meta.senderID, "<Sender GLN>");
      assert.strictEqual(ediDocument.interchanges[0].meta.receiverQualifer, "14");
      assert.strictEqual(ediDocument.interchanges[0].meta.receiverID, "<Receiver GLN>");
      assert.strictEqual(ediDocument.interchanges[0].meta.date, "140407");
      assert.strictEqual(ediDocument.interchanges[0].meta.time, "0910");
      assert.strictEqual(ediDocument.interchanges[0].meta.id, "0001");

      // Verify Functional Group (EDIFACT uses fake functional group)
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
      assert.ok(ediDocument.interchanges[0].functionalGroups[0].isFake());

      // Verify Transaction Set Meta
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);
      assert.ok(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta !== undefined);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.release, "D96A");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "ORDERS");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.id, "001");
      assert.ok(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.messageInfo !== undefined);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.messageInfo.version, "ORDERS");
    });

    test("EDIFACT Parse Meta with Different Message Types", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SUPPLIER:14+BUYER:14+200115:1430+TX001'
      UNH+M001+INVOIC:D:96A:UN'
      BGM+380+INV-2020-001+9'
      UNT+3+M001'
      UNZ+1+TX001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      const meta = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta;
      assert.strictEqual(meta.version, "INVOIC");
      assert.strictEqual(meta.release, "D96A");
    });
  });

  suite("Parse Segments", () => {
    test("EDIFACT Parse Single Segment with Components", async () => {
      const documentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
      const parser = new EdifactParser(documentStr);
  
      const ediDocument = await parser.parse();
      const segments = ediDocument.getSegments();
      assert.strictEqual(segments.length, 1);
  
      const segment = segments[0];
      assert.strictEqual(segment.id, "UNH");
      assert.strictEqual(segment.elements.length, 2);
      assert.strictEqual(segment.endingDelimiter, "'");

      // Verify composite element (ORDERS:D:96A:UN:EAN008)
      assert.strictEqual(segment.elements[1].value, "ORDERS:D:96A:UN:EAN008");
      assert.strictEqual(segment.elements[1].components!.length, 5);
      assert.strictEqual(segment.elements[1].components![0].value, "ORDERS");
      assert.strictEqual(segment.elements[1].components![2].value, "96A");
    });

    test("EDIFACT Parse UNA Separator String Segment", async () => {
      const documentStr = "UNA:+.?*'";
      const parser = new EdifactParser(documentStr);
  
      const ediDocument = await parser.parse();
      assert.ok(ediDocument.separatorsSegment !== undefined);
      assert.strictEqual(ediDocument.separatorsSegment.id, "UNA");
    });

    test("EDIFACT Parse Multiple Segments", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SENDER:14+RECEIVER:14+200115:1430+0001'
      UNH+1+ORDERS:D:96A:UN:EAN001'
      BGM+220+ORDER1+9'
      UNT+3+1'
      UNZ+1+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      const allSegments = ediDocument.getSegments();
      const segmentIds = allSegments.map(s => s.id);
      
      assert.ok(segmentIds.includes("UNA"));
      assert.ok(segmentIds.includes("UNB"));
      assert.ok(segmentIds.includes("UNH"));
      assert.ok(segmentIds.includes("BGM"));
      assert.ok(segmentIds.includes("UNT"));
      assert.ok(segmentIds.includes("UNZ"));
    });

    test("EDIFACT Escaped Component Separator Should Stay In Plain Element Without Schema", async () => {
      const documentStr = "ZZZ+AB?:CD'";
      const parser = new EdifactParser(documentStr);
      parser.setMessageSeparators({
        segmentSeparator: "'",
        dataElementSeparator: "+",
        componentElementSeparator: ":",
        releaseCharacter: "?"
      });

      const segment: EdiSegment = await parser.parseSegment(documentStr, 0, "'");

      assert.strictEqual(segment.elements.length, 1);
      assert.strictEqual(segment.elements[0].value, "AB?:CD");
      assert.strictEqual(segment.elements[0].components?.length ?? 0, 0);
    });
  });

  suite("Parse Separators", () => {
    test("EDIFACT Parse Default Separators", async () => {
      const documentStr = ``;
      const parser = new EdifactParser(documentStr);
      const separators = parser.getMessageSeparators();
      assert.strictEqual(separators.segmentSeparator, "'");
      assert.strictEqual(separators.dataElementSeparator, "+");
      assert.strictEqual(separators.componentElementSeparator, ":");
      assert.strictEqual(separators.releaseCharacter, "?");
    });
  
    test("EDIFACT Parse Separators from UNA", async () => {
      const documentStr = `UNA:+.?*'`;
      const parser = new EdifactParser(documentStr);
      const separators = parser.getMessageSeparators();
      assert.strictEqual(separators.segmentSeparator, "'");
      assert.strictEqual(separators.dataElementSeparator, "+");
      assert.strictEqual(separators.componentElementSeparator, ":");
      assert.strictEqual(separators.releaseCharacter, "?");
    });
  
    test("EDIFACT Parse Custom Separators from UNA", async () => {
      const documentStr = `UNA123456`;
      const parser = new EdifactParser(documentStr);
      const separators = parser.getMessageSeparators();
      assert.strictEqual(separators.segmentSeparator, "6");
      assert.strictEqual(separators.dataElementSeparator, "2");
      assert.strictEqual(separators.componentElementSeparator, "1");
      assert.strictEqual(separators.releaseCharacter, "4");
    });

    test("EDIFACT Parse Separators with CRLF", async () => {
      const documentStr = `UNA:+.?*\r\nUNB+UNOB:3+ + +180123:1127+000000128'`;
      const parser = new EdifactParser(documentStr);
      const separators = parser.getMessageSeparators();
      assert.strictEqual(separators.segmentSeparator, "\r");
      assert.strictEqual(separators.dataElementSeparator, "+");
      assert.strictEqual(separators.componentElementSeparator, ":");
      assert.strictEqual(separators.releaseCharacter, "?");
    });

    test("EDIFACT Parse Separators with LF", async () => {
      const documentStr = `UNA:+.?*\nUNB+UNOB:3+ + +180123:1127+000000128`;
      const parser = new EdifactParser(documentStr);
      const separators = parser.getMessageSeparators();
      assert.strictEqual(separators.segmentSeparator, "\n");
      assert.strictEqual(separators.dataElementSeparator, "+");
      assert.strictEqual(separators.componentElementSeparator, ":");
      assert.strictEqual(separators.releaseCharacter, "?");
    });
  });

  suite("Load Schema", () => {
    test("EDIFACT Load Release Schema", async () => {
      const rawReleaseSchema = await import("./test-files/D96A-sample.json");
      const releaseSchema = new EdiReleaseSchema(rawReleaseSchema);
      assert.strictEqual(releaseSchema.release, "D96A");
      
      // Verify qualifier lookup
      assert.ok(releaseSchema.qualifiers["Process type identification"]);
      const qualifier = releaseSchema.qualifiers["Process type identification"].find(q => q.value === "1");
      assert.ok(qualifier);
      assert.strictEqual(qualifier!.desc, "Wood preparation");
    });

    test("EDIFACT Load Segment Schema", async () => {
      const rawReleaseSchema = await import("./test-files/D96A-sample.json");
      const releaseSchema = new EdiReleaseSchema(rawReleaseSchema);
      
      // Load specific segment
      const ADR = releaseSchema.segments["ADR"];
      assert.strictEqual(ADR.desc, "ADDRESS");
      assert.strictEqual(ADR.purpose, "To specify an address.");
      assert.strictEqual(ADR.elements.length, 7);
    });

    test("EDIFACT Load Element Schema", async () => {
      const rawReleaseSchema = await import("./test-files/D96A-sample.json");
      const releaseSchema = new EdiReleaseSchema(rawReleaseSchema);
      
      const ADR = releaseSchema.segments["ADR"];
      const ADR01 = ADR.elements[0];
      assert.strictEqual(ADR01.id, "C817");
      assert.strictEqual(ADR01.desc, "ADDRESS USAGE");
      assert.strictEqual(ADR01.required, false);
      assert.strictEqual(ADR01.definition, "To describe the usage of an address.");
      assert.strictEqual(ADR01.components.length, 3);
    });

    test("EDIFACT Load Component Schema", async () => {
      const rawReleaseSchema = await import("./test-files/D96A-sample.json");
      const releaseSchema = new EdiReleaseSchema(rawReleaseSchema);
      
      const ADR = releaseSchema.segments["ADR"];
      const ADR01 = ADR.elements[0];
      const ADR0101 = ADR01.components[0];
      assert.strictEqual(ADR0101.id, "3299");
      assert.strictEqual(ADR0101.desc, "Address purpose, coded");
      assert.strictEqual(ADR0101.dataType, "AN");
      assert.strictEqual(ADR0101.minLength, 0);
      assert.strictEqual(ADR0101.maxLength, 3);
      assert.strictEqual(ADR0101.qualifierRef, "Address purpose, coded");
    });
  });

  suite("Parse Complete Documents", () => {
    test("EDIFACT Document with Multiple Interchanges", async () => {
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
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 2);
      
      // First interchange
      assert.strictEqual(ediDocument.interchanges[0].getId(), "0001");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 2);

      // Second interchange
      assert.strictEqual(ediDocument.interchanges[1].getId(), "0002");
      assert.strictEqual(ediDocument.interchanges[1].functionalGroups[0].transactionSets.length, 1);
    });

    test("EDIFACT Document with UNG Functional Groups", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOB:3+ + +180123:1127+000000128'

      UNG+DESADV+APPSENDER:ZZZ+APPRECEIVER:ZZZ+20251204:1015+GRP001+UN+S:1:ABC001+PWD'
      UNH+001+DESADV:D:07A:UN:GMI001'
      BGM+351+20171229'
      UNT+3+001'
      UNE+1+GRP001'

      UNG+DESADV+APPSENDER:ZZZ+APPRECEIVER:ZZZ+20251204:1015+GRP002+UN+S:1:ABC001+PWD'
      UNH+002+DESADV:D:07A:UN:GMI002'
      BGM+351+20171229'
      UNT+3+002'
      UNE+1+GRP002'

      UNZ+2+000000128'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      const interchange = ediDocument.interchanges[0];
      assert.strictEqual(interchange.functionalGroups.length, 2);
      
      // Verify UNG functional groups
      const fg1 = interchange.functionalGroups[0];
      assert.strictEqual(fg1.startSegment?.id, "UNG");
      assert.strictEqual(fg1.endSegment?.id, "UNE");
      assert.strictEqual(fg1.transactionSets.length, 1);

      const fg2 = interchange.functionalGroups[1];
      assert.strictEqual(fg2.startSegment?.id, "UNG");
      assert.strictEqual(fg2.endSegment?.id, "UNE");
      assert.strictEqual(fg2.transactionSets.length, 1);
    });

    test("EDIFACT Document Structure Validation", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SENDER:14+RECEIVER:14+140407:0910+0001'
      UNH+001+ORDERS:D:96A:UN:EAN001'
      BGM+220+PO1+9'
      UNT+3+001'
      UNZ+1+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      // Verify UNA separator segment exists
      assert.ok(ediDocument.separatorsSegment !== undefined);
      assert.strictEqual(ediDocument.separatorsSegment.id, "UNA");

      // Verify interchange structure
      const interchange = ediDocument.interchanges[0];
      assert.ok(interchange.startSegment);
      assert.strictEqual(interchange.startSegment.id, "UNB");
      assert.ok(interchange.endSegment);
      assert.strictEqual(interchange.endSegment.id, "UNZ");

      // Verify transaction set structure
      const ts = interchange.functionalGroups[0].transactionSets[0];
      assert.ok(ts.startSegment);
      assert.strictEqual(ts.startSegment.id, "UNH");
      assert.ok(ts.endSegment);
      assert.strictEqual(ts.endSegment.id, "UNT");
    });

    test("EDIFACT Multiple Transaction Types in Same Interchange", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SENDER:14+RECEIVER:14+200115:1430+0001'
      UNH+001+ORDERS:D:96A:UN'
      BGM+220+ORDER1+9'
      UNT+3+001'
      UNH+002+INVOIC:D:96A:UN'
      BGM+380+INV001+9'
      UNT+3+002'
      UNH+003+DESADV:D:96A:UN'
      BGM+351+DELIV001+9'
      UNT+3+003'
      UNZ+3+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      const fg = ediDocument.interchanges[0].functionalGroups[0];
      assert.strictEqual(fg.transactionSets.length, 3);
      assert.strictEqual(fg.transactionSets[0].getId(), "001");
      assert.strictEqual(fg.transactionSets[1].getId(), "002");
      assert.strictEqual(fg.transactionSets[2].getId(), "003");
    });

    test("EDIFACT Complex Document with Multiple Groups", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOB:3+ + +180123:1127+000000128'

      UNH+2266+DESADV:D:07A:UN:GMI021'
      BGM+351+20171229'
      UNT+3+2266'

      UNH+2266+DESADV:D:07A:UN:GMI022'
      BGM+351+20171229'
      UNT+3+2266'

      UNH+2266+DESADV:D:07A:UN:GMI023'
      BGM+351+20171229'
      UNT+3+2266'

      UNZ+3+000000128'

      UNB+UNOB:3+ + +180123:1127+000000129'

      UNG+DESADV+APPSENDER:ZZZ+APPRECEIVER:ZZZ+20251204:1015+GRP001+UN+S:1:ABC001+PWD'
      UNH+2266+DESADV:D:07A:UN:GMI024'
      BGM+351+20171229'
      UNT+3+2266'
      UNE+1+GRP001'

      UNG+DESADV+APPSENDER:ZZZ+APPRECEIVER:ZZZ+20251204:1015+GRP002+UN+S:1:ABC001+PWD'
      UNH+2266+DESADV:D:07A:UN:GMI025'
      BGM+351+20171229'
      UNT+3+2266'
      UNE+1+GRP002'

      UNG+DESADV+APPSENDER:ZZZ+APPRECEIVER:ZZZ+20251204:1015+GRP003+UN+S:1:ABC001+PWD'
      UNH+2266+DESADV:D:07A:UN:GMI026'
      BGM+351+20171229'
      UNT+3+2266'
      UNH+2266+DESADV:D:07A:UN:GMI027'
      BGM+351+20171229'
      UNT+3+2266'
      UNH+2266+DESADV:D:07A:UN:GMI028'
      BGM+351+20171229'
      UNT+3+2266'
      UNE+3+GRP003'

      UNZ+3+000000129'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      // Two interchanges
      assert.strictEqual(ediDocument.interchanges.length, 2);

      // First interchange: 1 fake group with 3 transactions
      const inter1 = ediDocument.interchanges[0];
      assert.strictEqual(inter1.functionalGroups.length, 1);
      assert.strictEqual(inter1.functionalGroups[0].isFake(), true);
      assert.strictEqual(inter1.functionalGroups[0].transactionSets.length, 3);

      // Second interchange: 3 real UNG groups
      const inter2 = ediDocument.interchanges[1];
      assert.strictEqual(inter2.functionalGroups.length, 3);
      assert.strictEqual(inter2.functionalGroups[0].isFake(), false);
      assert.strictEqual(inter2.functionalGroups[1].isFake(), false);
      assert.strictEqual(inter2.functionalGroups[2].isFake(), false);
      
      assert.strictEqual(inter2.functionalGroups[0].transactionSets.length, 1);
      assert.strictEqual(inter2.functionalGroups[1].transactionSets.length, 1);
      assert.strictEqual(inter2.functionalGroups[2].transactionSets.length, 3);
    });
  });

  suite("Edge Cases and Error Handling", () => {
    test("EDIFACT Empty Document", async () => {
      const documentStr = "";
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 0);
    });

    test("EDIFACT Whitespace Only Document", async () => {
      const documentStr = "   \n\n   ";
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 0);
    });

    test("EDIFACT Segment with Empty Elements", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SENDER:14+RECEIVER:14+140407:0910+0001'
      UNH+001+ORDERS:D:96A:UN:EAN001'
      BGM+220++9'
      UNT+3+001'
      UNZ+1+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
    });

    test("EDIFACT Long Segment", async () => {
      const longValue = "A".repeat(500);
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SENDER:14+RECEIVER:14+140407:0910+0001'
      UNH+001+ORDERS:D:96A:UN:EAN001'
      BGM+220+${longValue}+9'
      UNT+3+001'
      UNZ+1+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
    });

    test("EDIFACT Special Characters in Segment", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SENDER:14+RECEIVER:14+140407:0910+0001'
      UNH+001+ORDERS:D:96A:UN:EAN001'
      BGM+220+ORDER-2020/001+9'
      UNT+3+001'
      UNZ+1+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
    });

    test("EDIFACT Missing UNA Segment", async () => {
      const documentStr = `
      UNB+UNOA:2+SENDER:14+RECEIVER:14+140407:0910+0001'
      UNH+001+ORDERS:D:96A:UN:EAN001'
      BGM+220+PO1+9'
      UNT+3+001'
      UNZ+1+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      // Should still parse, but UNA segment will be missing
      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(ediDocument.separatorsSegment, undefined);
    });

    test("EDIFACT Get All Segments from Document", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SENDER:14+RECEIVER:14+140407:0910+0001'
      UNH+001+ORDERS:D:96A:UN:EAN001'
      BGM+220+PO1+9'
      UNT+3+001'
      UNZ+1+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      const allSegments = ediDocument.getSegments();
      assert.ok(allSegments.length >= 6);
      
      const segmentIds = allSegments.map(s => s.id);
      assert.strictEqual(segmentIds[0], "UNA");
      assert.ok(segmentIds.includes("UNB"));
      assert.ok(segmentIds.includes("UNZ"));
    });

    test("EDIFACT Escape Character Usage", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SENDER?'S:14+RECEIVER:14+140407:0910+0001'
      UNH+001+ORDERS:D:96A:UN:EAN001'
      BGM+220+PO1+9'
      UNT+3+001'
      UNZ+1+0001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      // Should handle escape character
      assert.strictEqual(ediDocument.interchanges.length, 1);
    });
  });

  suite("Element Type Validation", () => {
    test("EDIFACT Verify Data Element Types", async () => {
      const documentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
      const parser = new EdifactParser(documentStr);
  
      const ediDocument = await parser.parse();
      const segments = ediDocument.getSegments();
      const segment = segments[0];
  
      // All main elements should be data elements
      for (let i = 0; i < segment.elements.length; i++) {
        assert.strictEqual(segment.elements[i].type, ElementType.dataElement, `Element ${i} should be data element`);
      }
    });

    test("EDIFACT Verify Component Element Types", async () => {
      const documentStr = "UNH+1+ORDERS:D:96A:UN:EAN008'";
      const parser = new EdifactParser(documentStr);
  
      const ediDocument = await parser.parse();
      const segments = ediDocument.getSegments();
      const segment = segments[0];
  
      // Composite element should contain component elements
      if (segment.elements[1].components) {
        for (const component of segment.elements[1].components) {
          assert.strictEqual(component.type, ElementType.componentElement);
        }
      }
    });
  });

  suite("Message Type Support", () => {
    test("EDIFACT ORDERS Message Type", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SUPPLIER:14+BUYER:14+200115:1430+ORDER001'
      UNH+1+ORDERS:D:96A:UN'
      BGM+220+PO-001+9'
      UNT+3+1'
      UNZ+1+ORDER001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      const messageType = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version;
      assert.strictEqual(messageType, "ORDERS");
    });

    test("EDIFACT INVOIC Message Type", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SUPPLIER:14+BUYER:14+200115:1430+INV001'
      UNH+1+INVOIC:D:96A:UN'
      BGM+380+INV-2020-001+9'
      UNT+3+1'
      UNZ+1+INV001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      const messageType = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version;
      assert.strictEqual(messageType, "INVOIC");
    });

    test("EDIFACT DESADV Message Type", async () => {
      const documentStr = `
      UNA:+.?*'
      UNB+UNOA:2+SUPPLIER:14+BUYER:14+200115:1430+DELIV001'
      UNH+1+DESADV:D:96A:UN'
      BGM+351+DELIV-001+9'
      UNT+3+1'
      UNZ+1+DELIV001'
      `;
      const parser = new EdifactParser(documentStr);
      const ediDocument = await parser.parse();

      const messageType = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version;
      assert.strictEqual(messageType, "DESADV");
    });
  });
});
