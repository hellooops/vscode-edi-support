import * as assert from "assert";

import { X12Parser } from "../../parser/x12Parser";
import { EdiSegment, ElementType } from "../../parser/entities";

suite("X12 Parser Test Suite", () => {
  suite("Parse Meta", () => {
    test("X12 Parse Interchange and Functional Group Meta", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*004010~
      ST*850*0001~
      BEG*00*DS*PO1**20150708~
      SE*3*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();
  
      // Verify Interchange Meta
      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.ok(ediDocument.interchanges[0].meta !== undefined);
      assert.strictEqual(ediDocument.interchanges[0].meta.senderQualifer, "ZZ");
      assert.strictEqual(ediDocument.interchanges[0].meta.senderID, "SENDER         ");
      assert.strictEqual(ediDocument.interchanges[0].meta.receiverQualifer, "ZZ");
      assert.strictEqual(ediDocument.interchanges[0].meta.receiverID, "RECEIVER       ");
      assert.strictEqual(ediDocument.interchanges[0].meta.date, "241111");
      assert.strictEqual(ediDocument.interchanges[0].meta.time, "0300");
      assert.strictEqual(ediDocument.interchanges[0].meta.id, "000000001");
  
      // Verify Functional Group Meta
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
      assert.ok(ediDocument.interchanges[0].functionalGroups[0].meta !== undefined);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].meta.date, "20241111");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].meta.time, "0300");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].meta.id, "1");
  
      // Verify Transaction Set Meta
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);
      assert.ok(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta !== undefined);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.release, "00401");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "850");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.id, "0001");
      assert.ok(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.messageInfo !== undefined);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.messageInfo.version, "850");
    });

    test("X12 Parse Meta with Different Qualifiers", async () => {
      const documentStr = `
      ISA*00*          *00*          *01*VENDOR123      *01*CUSTOMER456    *241111*0300*U*00401*000000002*0*T*:~
      GS*HC*VENDOR123*CUSTOMER456*20241111*0300*2*T*004010~
      ST*837*0001~
      BHT*0019*00*244*20050101*1719*CH~
      SE*4*0001~
      GE*1*2~
      IEA*1*000000002~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      const meta = ediDocument.interchanges[0].meta;
      assert.strictEqual(meta.senderQualifer, "01");
      assert.strictEqual(meta.senderID, "VENDOR123      ");
      assert.strictEqual(meta.receiverQualifer, "01");
      assert.strictEqual(meta.receiverID, "CUSTOMER456    ");
    });
  });

  suite("Parse Segments", () => {
    test("X12 Parse Single Segment with Components", async () => {
      const documentStr = "SV2*0730*HC>93010*76.56*UN*3~";
      const parser = new X12Parser(documentStr);
      parser.setMessageSeparators({ segmentSeparator: "~", dataElementSeparator: "*", componentElementSeparator: ">" });
      await parser.loadSchema({release: "00401", version: "850"});
  
      const segment: EdiSegment = await parser.parseSegment(documentStr, 0, "~");
  
      assert.strictEqual(segment.id, "SV2");
      assert.strictEqual(segment.elements.length, 5);
      assert.strictEqual(segment.endingDelimiter, "~");
      assert.strictEqual(segment.length, 29);
      assert.strictEqual(segment.startIndex, 0);
      assert.strictEqual(segment.endIndex, 28);
  
      // Verify element with components
      assert.strictEqual(segment.elements[1].designatorIndex, "02");
      assert.strictEqual(segment.elements[1].value, "HC>93010");
      assert.strictEqual(segment.elements[1].components!.length, 2);
      assert.strictEqual(segment.elements[1].components![0].value, "HC");
      assert.strictEqual(segment.elements[1].components![1].value, "93010");
    });

    test("X12 Parse ISA Segment", async () => {
      const documentStr = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~`;
      const parser = new X12Parser(documentStr);
      const separators = parser.getMessageSeparators();
      
      assert.strictEqual(separators.dataElementSeparator, "*");
      assert.strictEqual(separators.componentElementSeparator, ":");
      assert.strictEqual(separators.segmentSeparator, "~");
    });

    test("X12 Parse Multiple Different Segments", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*004010~
      ST*850*0001~
      BEG*00*DS*PO1**20150708~
      SE*3*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      const allSegments = ediDocument.getSegments();
      const segmentIds = allSegments.map(s => s.id);
      
      assert.ok(segmentIds.includes("ISA"));
      assert.ok(segmentIds.includes("GS"));
      assert.ok(segmentIds.includes("ST"));
      assert.ok(segmentIds.includes("BEG"));
      assert.ok(segmentIds.includes("SE"));
      assert.ok(segmentIds.includes("GE"));
      assert.ok(segmentIds.includes("IEA"));
    });
  });

  suite("Parse Separators", () => {
    test("X12 Parse Separators with Tilde", async () => {
      const documentStr = `ISA*00*          *00*          *ZZ*1234567890     *ZZ*ABCDEFGH       *230705*1100*U*00400*000000001*0*P*>^`;
      const parser = new X12Parser(documentStr);
      const separators = parser.getMessageSeparators();
      assert.strictEqual(separators.segmentSeparator, "^");
      assert.strictEqual(separators.dataElementSeparator, "*");
      assert.strictEqual(separators.componentElementSeparator, ">");
    });
  
    test("X12 Parse Separators with Newline", async () => {
      const documentStr = `ISA*00**00* *ZZ*1234567890*ZZ*ABCDEFGH*230705*1100*U*00400*000000001*0*P*>\nGS*PO*1234567890*ABCDEFGH*20030705*1100*1*X*004010\n`;
      const parser = new X12Parser(documentStr);
      const separators = parser.getMessageSeparators();
      assert.strictEqual(separators.segmentSeparator, "\n");
      assert.strictEqual(separators.dataElementSeparator, "*");
      assert.strictEqual(separators.componentElementSeparator, ">");
    });

    test("X12 Parse Separators with Carriage Return", async () => {
      const documentStr = `ISA*00**00* *ZZ*1234567890*ZZ*ABCDEFGH*230705*1100*U*00400*000000001*0*P*>\rGS*PO*1234567890*ABCDEFGH*20030705*1100*1*X*004010\r`;
      const parser = new X12Parser(documentStr);
      const separators = parser.getMessageSeparators();
      assert.strictEqual(separators.segmentSeparator, "\r");
      assert.strictEqual(separators.dataElementSeparator, "*");
      assert.strictEqual(separators.componentElementSeparator, ">");
    });
  });

  suite("Parse Version", () => {
    test("X12 Parse Version 00401", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
      GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
      ST*850*0001~`;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();
  
      const meta = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta;
      assert.strictEqual(meta.release, "00401");
      assert.strictEqual(meta.version, "850");
    });

    test("X12 Parse Version 00400", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00400*000007080*0*P*>~
      GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
      ST*850*0001~`;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();
  
      const meta = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta;
      assert.strictEqual(meta.release, "00401");
      assert.strictEqual(meta.version, "850");
    });

    test("X12 Parse Different Transaction Types", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*004010~
      ST*850*0001~
      SE*1*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();
  
      const meta = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta;
      assert.strictEqual(meta.version, "850");
    });
  });

  suite("Parse Complete Documents", () => {
    test("X12 Document with Multiple Functional Groups", async () => {
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
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].getId(), "000000001");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 2);

      // First functional group with 2 transaction sets
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].getId(), "1");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 2);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getId(), "0001");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[1].getId(), "0002");

      // Second functional group with 1 transaction set
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[1].getId(), "2");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[1].transactionSets.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[1].transactionSets[0].getId(), "0003");
    });

    test("X12 Document Structure Validation", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*004010~
      ST*850*0001~
      BEG*00*DS*PO1**20150708~
      SE*3*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      // Verify document structure
      assert.strictEqual(ediDocument.separatorsSegment, undefined);
      assert.strictEqual(ediDocument.startSegment, undefined);
      assert.strictEqual(ediDocument.endSegment, undefined);
      assert.strictEqual(ediDocument.interchanges.length, 1);

      // Verify segment boundaries
      const interchange = ediDocument.interchanges[0];
      assert.ok(interchange.startSegment);
      assert.strictEqual(interchange.startSegment.id, "ISA");
      assert.ok(interchange.endSegment);
      assert.strictEqual(interchange.endSegment.id, "IEA");

      const fg = interchange.functionalGroups[0];
      assert.ok(fg.startSegment);
      assert.strictEqual(fg.startSegment.id, "GS");
      assert.ok(fg.endSegment);
      assert.strictEqual(fg.endSegment.id, "GE");

      const ts = fg.transactionSets[0];
      assert.ok(ts.startSegment);
      assert.strictEqual(ts.startSegment.id, "ST");
      assert.ok(ts.endSegment);
      assert.strictEqual(ts.endSegment.id, "SE");
    });

    test("X12 Multiple Transaction Types in Same Group", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*HC*  *  *20241111*0300*1*T*004010~
      ST*837*0001~
      BHT*0019*00*244*20050101*1719*CH~
      SE*3*0001~
      ST*837*0002~
      BHT*0019*00*244*20050101*1720*CH~
      SE*3*0002~
      ST*997*0003~
      AK1*HC*0001~
      SE*2*0003~
      GE*3*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      const fg = ediDocument.interchanges[0].functionalGroups[0];
      assert.strictEqual(fg.transactionSets.length, 3);
      assert.strictEqual(fg.transactionSets[0].getId(), "0001");
      assert.strictEqual(fg.transactionSets[1].getId(), "0002");
      assert.strictEqual(fg.transactionSets[2].getId(), "0003");
    });
  });

  suite("Edge Cases and Error Handling", () => {
    test("X12 Empty Document", async () => {
      const documentStr = "";
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 0);
    });

    test("X12 Whitespace Only Document", async () => {
      const documentStr = "   \n\n   ";
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 0);
    });

    test("X12 Segment with Empty Elements", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*004010~
      ST*850*0001~
      DTM****~
      SE*4*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
      // Should still parse even with empty elements
      assert.ok(ediDocument.interchanges[0].functionalGroups.length > 0);
    });

    test("X12 Long Segment", async () => {
      const longValue = "A".repeat(500);
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*004010~
      ST*850*0001~
      BEG*00*DS*${longValue}**20150708~
      SE*3*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
    });

    test("X12 Special Characters in Segment", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*004010~
      ST*850*0001~
      BEG*00*DS*PO1-TEST/123**20150708~
      SE*3*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
    });

    test("X12 Different Separator Characters", async () => {
      const documentStr = `ISA+00+          +00+          +ZZ+1234567890     +ZZ+ABCDEFGH       +230705+1100+U+00400+000000001+0+P+>^`;
      const parser = new X12Parser(documentStr);
      const separators = parser.getMessageSeparators();
      
      // ISA separator format: pos 3 = element sep, pos 104 = segment sep, pos 105 = component sep
      assert.strictEqual(separators.dataElementSeparator, "+");
      assert.strictEqual(separators.componentElementSeparator, ">");
      assert.strictEqual(separators.segmentSeparator, "^");
    });

    test("X12 Get All Segments from Document", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*004010~
      ST*850*0001~
      BEG*00*DS*PO1**20150708~
      SE*3*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      const allSegments = ediDocument.getSegments();
      assert.ok(allSegments.length >= 7);
      
      const segmentIds = allSegments.map(s => s.id);
      assert.strictEqual(segmentIds[0], "ISA");
      assert.strictEqual(segmentIds[segmentIds.length - 1], "IEA");
    });

    test("X12 Missing Functional Group Header", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      ST*850*0001~
      BEG*00*DS*PO1**20150708~
      SE*3*0001~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const ediDocument = await parser.parse();

      // Should still parse but may have different structure
      assert.ok(ediDocument);
    });

    test("X12 Unsupported Release Should Not Log Schema Null Reference", async () => {
      const documentStr = `
      ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~
      GS*PO*  *  *20241111*0300*1*T*999999~
      ST*850*0001~
      BEG*00*DS*PO1**20150708~
      SE*3*0001~
      GE*1*1~
      IEA*1*000000001~
      `;
      const parser = new X12Parser(documentStr);
      const originalConsoleError = console.error;
      const errors: string[] = [];

      console.error = (...args: any[]) => {
        errors.push(args.map(arg => arg instanceof Error ? `${arg.name}: ${arg.message}` : String(arg)).join(" "));
      };

      try {
        const ediDocument = await parser.parse();
        assert.strictEqual(ediDocument.interchanges.length, 1);
        assert.ok(!errors.some(error => error.includes("ediReleaseSchema")));
      } finally {
        console.error = originalConsoleError;
      }
    });
  });

  suite("Element Type Validation", () => {
    test("X12 Verify Data Element Types", async () => {
      const documentStr = "SV2*0730*HC>93010*76.56*UN*3~";
      const parser = new X12Parser(documentStr);
      parser.setMessageSeparators({ segmentSeparator: "~", dataElementSeparator: "*", componentElementSeparator: ">" });
      await parser.loadSchema({release: "00401", version: "850"});
  
      const segment: EdiSegment = await parser.parseSegment(documentStr, 0, "~");
  
      // All main elements should be data elements
      for (let i = 0; i < segment.elements.length; i++) {
        assert.strictEqual(segment.elements[i].type, ElementType.dataElement, `Element ${i} should be data element`);
      }
    });

    test("X12 Verify Component Element Types", async () => {
      const documentStr = "SV2*0730*HC>93010*76.56*UN*3~";
      const parser = new X12Parser(documentStr);
      parser.setMessageSeparators({ segmentSeparator: "~", dataElementSeparator: "*", componentElementSeparator: ">" });
      await parser.loadSchema({release: "00401", version: "850"});
  
      const segment: EdiSegment = await parser.parseSegment(documentStr, 0, "~");
  
      // Element with components should contain component elements
      if (segment.elements[1].components) {
        for (const component of segment.elements[1].components) {
          assert.strictEqual(component.type, ElementType.componentElement);
        }
      }
    });
  });
});
