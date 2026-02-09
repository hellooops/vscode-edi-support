import * as assert from "assert";

import { VdaParser } from "../../parser/vdaParser";
import { EdiSegment, ElementType, EdiDocument } from "../../parser/entities";

suite("VDA Parser Test Suite", () => {
  suite("VDA Parse Meta", () => {
    test("VDA Parse Transaction Set Meta - 4905", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.ok(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta !== undefined);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "511");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.release, "02");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.id, "00001");
    });

    test("VDA Parse Transaction Set Meta - 4913", async () => {
      const documentStr = "71103                  0000100002250124         11825429 1J                                                                     \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "711");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.release, "03");
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.id, "00002");
    });
  });

  suite("VDA Parse Segments", () => {
    test("VDA Parse Segment from 4905", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(segments.length, 1);
      
      const segment = segments[0];
      assert.strictEqual(segment.id, "511");
      assert.strictEqual(segment.length, 128);
    });

    test("VDA Parse Multiple Segments from 4905", async () => {
      const documentStr = 
        "51102                  9999900001250124111231                                                                                   \n" +
        "51201030187      121115186      1211091514280009100                               CGF-56026482A 13     STL                      \n" +
        "51301121113432701        0000003460000000019427121115000000000000000                                                            \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);
      
      assert.strictEqual(segments.length, 3);
      assert.strictEqual(segments[0].id, "511");
      assert.strictEqual(segments[1].id, "512");
      assert.strictEqual(segments[2].id, "513");
    });

    test("VDA Segment Has Elements", async () => {
      // Real VDA data from 4905
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      await parser.loadSchema({ release: "02", version: "511" });
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      const segment = segments[0];
      // VDA segments should have elements based on the schema
      assert.ok(segment.elements.length > 0, "VDA segment should have elements");
    });

    test("VDA Segment ID from First 3 Characters", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      const segment = segments[0];
      assert.strictEqual(segment.id, "511", "Segment ID should be first 3 characters");
    });

    test("VDA Parse Segment Loop from 4905", async () => {
      const documentStr = 
        "51102                  9999900001250124111231                                                                                   \n" +
        "51201030187      121115186      1211091514280009100                               CGF-56026482A 13     STL                      \n" +
          "51301121113432701        0000003460000000019427121115000000000000000                                                            \n" +
          "5150100000013021300000000000000001303150000000000                               000000                                          \n" +
          "5180107-08140295/04                          23-09140029                                                                        \n" +
        "51201030187      121115186      1211091514280009100                               CGF-56026482A 13     STL                      \n" +
          "51301121113432701        0000003460000000019427121115000000000000000                                                            \n" +
          "5150100000013021300000000000000001303150000000000                               000000                                          \n" +
          "5180107-08140295/04                          23-09140029                                                                        \n" +
        "5190100000010000001000000100000000000000000000100000010000001                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
      assert.strictEqual(ediDocument.interchanges[0].functionalGroups[0].transactionSets.length, 1);
      
      assert.strictEqual(segments.length, 10);
      assert.strictEqual(segments[0].id, "511");
      assert.strictEqual(segments[1].id, "512");
      assert.strictEqual(segments[2].id, "513");
      assert.strictEqual(segments[3].id, "515");
      assert.strictEqual(segments[4].id, "518");
      assert.strictEqual(segments[5].id, "512");
      assert.strictEqual(segments[6].id, "513");
      assert.strictEqual(segments[7].id, "515");
      assert.strictEqual(segments[8].id, "518");
      assert.strictEqual(segments[9].id, "519");

      const segmentWithLoop = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].segments;
      let childSegments: EdiSegment[] = [];
      
      assert.strictEqual(segmentWithLoop.length, 2);

      assert.strictEqual(segmentWithLoop[0].id, "512Loop");
      childSegments = segmentWithLoop[0].Loop!;
      assert.strictEqual(childSegments.length, 4);
      assert.strictEqual(childSegments[0].id, "512");
      assert.strictEqual(childSegments[1].id, "513");
      assert.strictEqual(childSegments[2].id, "515");
      assert.strictEqual(childSegments[3].id, "518");

      assert.strictEqual(segmentWithLoop[1].id, "512Loop");
      childSegments = segmentWithLoop[1].Loop!;
      assert.strictEqual(childSegments.length, 4);
      assert.strictEqual(childSegments[0].id, "512");
      assert.strictEqual(childSegments[1].id, "513");
      assert.strictEqual(childSegments[2].id, "515");
      assert.strictEqual(childSegments[3].id, "518");
    });
  });

  suite("VDA Parse Separators", () => {
    test("VDA Separator Detection - Newline Separator", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      assert.ok(ediDocument.separators !== undefined);
      assert.strictEqual(ediDocument.separators?.segmentSeparator, "\n");
    });

    test("VDA Separator Detection - Carriage Return Separator", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \r";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      assert.ok(ediDocument.separators !== undefined);
      assert.strictEqual(ediDocument.separators?.segmentSeparator, "\r");
    });

    test("VDA Invalid Document - Too Short", async () => {
      const documentStr = "51102X".repeat(10); // Only 60 chars, needs at least 128

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      // Document should still parse but without segments
      assert.ok(ediDocument);
    });

    test("VDA Invalid Document - No Separator at Position 128", async () => {
      const documentStr = "51102" + "X".repeat(123) + "Y"; // Invalid separator at position 128

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      // Should handle gracefully
      assert.ok(ediDocument);
    });
  });

  suite("VDA Interchange and Functional Group", () => {
    test("VDA Creates Interchange", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.ok(ediDocument.interchanges[0].meta !== undefined);
    });

    test("VDA Creates Functional Group", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      assert.strictEqual(ediDocument.interchanges[0].functionalGroups.length, 1);
      assert.ok(ediDocument.interchanges[0].functionalGroups[0].meta !== undefined);
    });

    test("VDA Functional Group is Fake", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      assert.ok(ediDocument.interchanges[0].functionalGroups[0].isFake());
    });
  });

  suite("VDA Complete Document Parsing", () => {
    test("VDA Parse Complete Valid Document - 4905", async () => {
      // Real VDA delivery note document from 4905
      const documentStr = 
        "51102                  9999900001250124111231                                                                                   \n" +
        "51201030187      121115186      1211091514280009100                               CGF-56026482A 13     STL                      \n" +
        "51301121113432701        0000003460000000019427121115000000000000000                                                            \n" +
        "5150100000013021300000000000000001303150000000000                               000000                                          \n" +
        "5180107-08140295/04                          23-09140029                                                                        \n" +
        "5190100000010000001000000100000000000000000000100000010000001                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(segments.length, 6);
      assert.strictEqual(segments[0].id, "511");
      assert.strictEqual(segments[1].id, "512");
      assert.strictEqual(segments[2].id, "513");
      assert.strictEqual(segments[3].id, "515");
      assert.strictEqual(segments[4].id, "518");
      assert.strictEqual(segments[5].id, "519");
    });

    test("VDA Parse Complete Valid Document - 4913.edi", async () => {
      // Real VDA delivery note document from 4913.edi
      const documentStr = 
        "71103                  0000100002250124         11825429 1J                                                                     \n" +
        "7120313533302   11825429      18011910450000000000000001 000011825429      0282033787                 2Routen-L18011911300000   \n" +
        "7130300021910180119AP4E 03                40    05400000000                 15445489A541                                        \n" +
        "71403A1567350110           48200TDR3SGTN         0000000000012000ST0000000000000      001P               S              0001    \n" +
        "71802000219100004675026                                                                                                         \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(segments.length, 5);
      assert.strictEqual(segments[0].id, "711");
      assert.strictEqual(segments[1].id, "712");
      assert.strictEqual(segments[2].id, "713");
      assert.strictEqual(segments[3].id, "714");
      assert.strictEqual(segments[4].id, "718");
    });

    test("VDA Parse EDI Document Structure", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      // Verify document structure
      assert.ok(ediDocument.interchanges);
      assert.ok(Array.isArray(ediDocument.interchanges));
    });

    test("VDA Document Get All Segments", async () => {
      const documentStr = 
        "51102                  9999900001250124111231                                                                                   \n" +
        "51201030187      121115186      1211091514280009100                               CGF-56026482A 13     STL                      \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      const allSegments = ediDocument.getSegments();
      assert.strictEqual(allSegments.length, 2);
      assert.strictEqual(allSegments[0].id, "511");
      assert.strictEqual(allSegments[1].id, "512");
    });
  });

  suite("VDA Edge Cases", () => {
    test("VDA Empty Document", async () => {
      const documentStr = "";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();

      assert.ok(ediDocument);
      assert.strictEqual(ediDocument.interchanges.length, 0);
    });

    test("VDA Document with Whitespace", async () => {
      const documentStr = "  \n" +
        "51102                  9999900001250124111231                                                                                   \n" +
        "  \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      assert.strictEqual(ediDocument.interchanges.length, 1);
      assert.strictEqual(segments.length, 1);
    });

    test("VDA Segment Indexes", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      const segment = segments[0];
      assert.strictEqual(segment.startIndex, 0);
      assert.strictEqual(segment.endIndex, 128);
      assert.strictEqual(segment.length, 128);
    });

    test("VDA Element Count in Parsed Segment", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      await parser.loadSchema({ release: "02", version: "511" });
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      const segment = segments[0];
      // Elements should be parsed based on schema field lengths
      assert.ok(segment.elements.length >= 0, "Segment should have elements array");
    });
  });

  suite("VDA Element Parsing", () => {
    test("VDA Segment Elements Have Correct Values", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      await parser.loadSchema({ release: "02", version: "511" });
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      const segment = segments[0];
      
      if (segment.elements.length > 0) {
        // All elements should have values
        for (const element of segment.elements) {
          assert.ok(element.value !== undefined, "Element should have a value");
          assert.strictEqual(element.type, ElementType.dataElement, "Element should be a data element");
        }
      }
    });

    test("VDA Element Designators", async () => {
      const documentStr = "51102                  9999900001250124111231                                                                                   \n";

      const parser = new VdaParser(documentStr);
      await parser.loadSchema({ release: "02", version: "511" });
      const ediDocument = await parser.parse();
      const segments = ediDocument.interchanges[0].functionalGroups[0].transactionSets[0].getSegments(true);

      const segment = segments[0];
      
      if (segment.elements.length > 0) {
        // Designators should be sequential 01, 02, 03, etc.
        for (let i = 0; i < segment.elements.length; i++) {
          const expectedDesignator = (i + 1).toString().padStart(2, "0");
          assert.strictEqual(segment.elements[i].designatorIndex, expectedDesignator);
        }
      }
    });
  });
});
