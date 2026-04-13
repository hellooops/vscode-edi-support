import * as assert from "assert";

import {
  cloneJson,
  createEdifactDelforDocument,
  createEdifactInvoicDocument,
  createEdifactOrdersDocument,
  readFixture,
  stripTrailingLineBreaks,
} from "./helpers/fixtures";
import { edifactParserModule, root } from "./helpers/runtime";

const { createParser, DiagnosticErrors, EdiType, loadBuiltInSchemaBundle, parseEdi } = root as typeof import("../dist");
const { EdifactParser } = edifactParserModule as typeof import("../dist/parser/edifactParser");

suite("edi-parser edifact parser", () => {
  test("ORDERS should parse base metadata, message info and UNH composite elements", async () => {
    const document = await parseEdi(readFixture("sample-orders.edifact"));
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];
    const unhSegment = transactionSet.startSegment!;

    assert.strictEqual(document!.separatorsSegment!.id, "UNA");
    assert.strictEqual(transactionSet.meta.release, "D96A");
    assert.strictEqual(transactionSet.meta.version, "ORDERS");
    assert.strictEqual(transactionSet.meta.messageInfo?.version, "ORDERS");
    assert.strictEqual(unhSegment.id, "UNH");
    assert.strictEqual(unhSegment.elements[1].components!.length, 5);
    assert.strictEqual(unhSegment.elements[1].components![0].value, "ORDERS");
    assert.strictEqual(unhSegment.elements[1].components![2].value, "96A");
  });

  test("DESADV should fit nested CPS structures and preserve parent relationships", async () => {
    const document = await parseEdi(readFixture("DESADV.edifact"));
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];
    const cpsLoop = transactionSet.segments.filter((segment) => segment.id === "CPSLoop1")
      .find((segment) => segment.Loop!.some((child) => child.id === "LINLoop1"))!;
    const pacLoop = cpsLoop.Loop!.find((segment) => segment.id === "PACLoop1")!;
    const pciLoop = pacLoop.Loop!.find((segment) => segment.id === "PCILoop1")!;
    const ginLoop = pciLoop.Loop!.find((segment) => segment.id === "GINLoop1")!;
    const linLoop = cpsLoop.Loop!.find((segment) => segment.id === "LINLoop1")!;
    const rffLoop = linLoop.Loop!.find((segment) => segment.id === "RFFLoop3")!;
    const locLoop = linLoop.Loop!.find((segment) => segment.id === "LOCLoop2")!;
    const flattenedIds = transactionSet.getSegments(true).map((segment) => segment.id);

    assert.deepStrictEqual(cpsLoop.Loop!.map((segment) => segment.id), ["CPS", "PACLoop1", "LINLoop1"]);
    assert.deepStrictEqual(pacLoop.Loop!.slice(0, 3).map((segment) => segment.id), ["PAC", "QTY", "PCILoop1"]);
    assert.ok(pciLoop.Loop!.map((segment) => segment.id).includes("GINLoop1"));
    assert.deepStrictEqual(ginLoop.Loop!.map((segment) => segment.id), ["GIN"]);
    assert.deepStrictEqual(linLoop.Loop!.map((segment) => segment.id), ["LIN", "PIA", "QTY", "ALI", "FTX", "RFFLoop3", "LOCLoop2"]);
    assert.deepStrictEqual(rffLoop.Loop!.map((segment) => segment.id), ["RFF"]);
    assert.deepStrictEqual(locLoop.Loop!.map((segment) => segment.id), ["LOC"]);
    assert.strictEqual(linLoop.Loop![0].parentSegment, linLoop);
    assert.ok(flattenedIds.includes("CPS"));
    assert.ok(flattenedIds.includes("LIN"));
    assert.ok(!transactionSet.segments.some((segment) => segment.id === "LIN"));
  });

  test("should parse multiple interchanges and message types from fixture", async () => {
    const document = await parseEdi(readFixture("EDIFACT-interchanges.edifact"));

    assert.strictEqual(document!.interchanges.length, 2);
    assert.deepStrictEqual(
      document!.interchanges.map((interchange) =>
        interchange.functionalGroups.flatMap((functionalGroup) =>
          functionalGroup.transactionSets.map((transactionSet) => transactionSet.meta.version),
        ),
      ),
      [["ORDERS", "DESADV"], ["ORDERS"]],
    );
    assert.deepStrictEqual(
      document!.interchanges.map((interchange) =>
        interchange.functionalGroups.flatMap((functionalGroup) =>
          functionalGroup.transactionSets.map((transactionSet) => transactionSet.meta.id),
        ),
      ),
      [["001", "002"], ["003"]],
    );
  });

  test("should parse grouped and repeated EDIFACT messages across multiple interchanges", async () => {
    const document = await parseEdi(readFixture("multiple_transactions.edifact"));

    assert.strictEqual(document!.interchanges.length, 2);
    assert.deepStrictEqual(
      document!.interchanges.map((interchange) => interchange.functionalGroups.length),
      [1, 3],
    );
    assert.deepStrictEqual(
      document!.interchanges.map((interchange) =>
        interchange.functionalGroups.map((functionalGroup) => functionalGroup.transactionSets.map((transactionSet) => transactionSet.meta.id)),
      ),
      [
        [["2261", "2262", "2263"]],
        [["2264"], ["2265"], ["2266", "2267", "2268"]],
      ],
    );
  });

  test("INVOIC should switch message type and message info", async () => {
    const document = await parseEdi(createEdifactInvoicDocument());
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];

    assert.strictEqual(transactionSet.meta.release, "D96A");
    assert.strictEqual(transactionSet.meta.version, "INVOIC");
    assert.strictEqual(transactionSet.meta.messageInfo?.version, "INVOIC");
  });

  test("DELFOR should support service qualifier overrides on EDIFACT service scope", async () => {
    const parser = createParser(createEdifactDelforDocument(), {
      customSchemas: {
        edifact: {
          _service: {
            qualifiers: {
              "Identification code qualifier": {
                ZZ: "Mutually agreed qualifier",
              },
            },
          },
        },
      },
    })!;
    const document = await parser.parse();
    const qualifierErrors = document.getErrors({
      ediType: EdiType.EDIFACT,
      customSchemas: {
        edifact: {
          _service: {
            qualifiers: {
              "Identification code qualifier": {
                ZZ: "Mutually agreed qualifier",
              },
            },
          },
        },
      },
      standardOptions: document.standardOptions,
    }).filter((error) => error.code === DiagnosticErrors.QUALIFIER_INVALID_CODE);

    assert.deepStrictEqual(qualifierErrors, []);
  });

  test("should parse ORDERS both with and without UNA without changing core metadata", async () => {
    const withUnaDocument = await parseEdi(createEdifactOrdersDocument("\n", true));
    const withoutUnaDocument = await parseEdi(createEdifactOrdersDocument("\n", false));
    const withUnaTransactionSet = withUnaDocument!.interchanges[0].functionalGroups[0].transactionSets[0];
    const withoutUnaTransactionSet = withoutUnaDocument!.interchanges[0].functionalGroups[0].transactionSets[0];

    assert.strictEqual(withUnaDocument!.separatorsSegment!.id, "UNA");
    assert.strictEqual(withoutUnaDocument!.separatorsSegment, undefined);
    assert.strictEqual(withUnaTransactionSet.meta.version, "ORDERS");
    assert.strictEqual(withoutUnaTransactionSet.meta.version, "ORDERS");
    assert.strictEqual(withUnaTransactionSet.meta.release, "D96A");
    assert.strictEqual(withoutUnaTransactionSet.meta.release, "D96A");
  });

  test("should parse UNA with LF, UNA with CRLF, and no-UNA documents without trailing newline", async () => {
    const lfDocument = await parseEdi(createEdifactOrdersDocument("\n", true));
    const crlfDocument = await parseEdi(createEdifactOrdersDocument("\r\n", true));
    const noUnaNoTrailingNewline = await parseEdi(stripTrailingLineBreaks(createEdifactOrdersDocument("\n", false)));

    assert.strictEqual(lfDocument!.interchanges.length, 1);
    assert.strictEqual(crlfDocument!.interchanges.length, 1);
    assert.strictEqual(noUnaNoTrailingNewline!.interchanges.length, 1);
    assert.strictEqual(noUnaNoTrailingNewline!.separatorsSegment, undefined);
    assert.strictEqual(noUnaNoTrailingNewline!.getSegments(true).slice(-1)[0].id, "UNZ");
  });

  test("should parse composite elements directly from UNH segment", async () => {
    const parser = new EdifactParser("UNH+1+ORDERS:D:96A:UN:EAN008'");
    const document = await parser.parse();
    const segment = document.getSegments(true)[0];

    assert.strictEqual(segment.id, "UNH");
    assert.strictEqual(segment.elements[1].components!.length, 5);
    assert.strictEqual(segment.elements[1].components![0].value, "ORDERS");
    assert.strictEqual(segment.elements[1].components![4].value, "EAN008");
  });

  test("should preserve EDIFACT comments and formatting when parsed directly", async () => {
    const text = [
      "// lead",
      "UNA:+.?*'",
      "UNB+UNOA:2+SENDER:14+RECEIVER:14+140407:0910+0001'",
      "// before message",
      "UNH+001+ORDERS:D:96A:UN'",
      "BGM+220+PO1+9'",
      "UNT+3+001'",
      "// tail",
      "UNZ+1+0001'",
    ].join("\n");
    const document = await new EdifactParser(text).parse();
    const interchange = document.interchanges[0];
    const transactionSet = interchange.functionalGroups[0].transactionSets[0];

    assert.deepStrictEqual(document.separatorsSegment!.comments.map((comment) => comment.content), ["// lead"]);
    assert.deepStrictEqual(transactionSet.startSegment!.comments.map((comment) => comment.content), ["// before message"]);
    assert.deepStrictEqual(interchange.endSegment!.comments.map((comment) => comment.content), ["// tail"]);
    assert.strictEqual(document.toString(), text);
  });

  test("should keep parsing when EDIFACT release schema is partially missing", async () => {
    const partialBundle = cloneJson(loadBuiltInSchemaBundle({
      ediType: "edifact",
      release: "D96A",
      version: "ORDERS",
    })! as any);
    delete partialBundle.releaseSchema.Segments.BGM;

    const document = await parseEdi(createEdifactOrdersDocument(), {
      schemaResolver: () => partialBundle,
    });
    const unhSegment = document!.getSegments(true).find((segment) => segment.id === "UNH")!;
    const bgmSegment = document!.getSegments(true).find((segment) => segment.id === "BGM")!;

    assert.ok(unhSegment.ediReleaseSchemaSegment);
    assert.strictEqual(bgmSegment.isInvalidSegment, true);
    assert.strictEqual(bgmSegment.ediReleaseSchemaSegment, undefined);
  });
});
