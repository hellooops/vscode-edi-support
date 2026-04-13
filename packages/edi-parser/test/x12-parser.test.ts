import * as assert from "assert";

import {
  createUnsupportedReleaseX12Document,
  createX12810Document,
  createX12856Document,
  createX12PurchaseOrderDocument,
  readDoc,
  stripTrailingLineBreaks,
} from "./helpers/fixtures";
import { parserEntities, root, x12ParserModule } from "./helpers/runtime";

const { parseEdi } = root as typeof import("../dist");
const { X12Parser } = x12ParserModule as typeof import("../dist/parser/x12Parser");
const { ElementType } = parserEntities as typeof import("../dist/parser/entities");

suite("edi-parser x12 parser", () => {
  test("850 should parse base metadata, message info and schema-backed segments", async () => {
    const document = await parseEdi(readDoc("850.x12"));
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];
    const begSegment = transactionSet.getSegments(true).find((segment) => segment.id === "BEG");

    assert.strictEqual(transactionSet.meta.release, "00401");
    assert.strictEqual(transactionSet.meta.version, "850");
    assert.strictEqual(transactionSet.meta.messageInfo?.version, "850");
    assert.ok(begSegment);
    assert.ok(begSegment!.ediReleaseSchemaSegment);
    assert.notStrictEqual(begSegment!.getDesc(), undefined);
  });

  test("850 should fit N1 and PO1 loops and preserve nested loop structure", async () => {
    const document = await parseEdi(readDoc("850-loop.edi"));
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];
    const wrappedSegments = transactionSet.segments;
    const flattenedIds = transactionSet.getSegments(true).map((segment) => segment.id);
    const partyLoop = wrappedSegments.find((segment) => segment.id === "N1Loop1");
    const po1Loop = wrappedSegments.find((segment) => segment.id === "PO1Loop1");
    const slnLoop = po1Loop!.Loop!.find((segment) => segment.id === "SLNLoop1");
    const nestedNoteLoop = slnLoop!.Loop!.find((segment) => segment.id === "N9Loop3");

    assert.ok(partyLoop);
    assert.deepStrictEqual(partyLoop!.Loop!.map((segment) => segment.id), ["N1", "N2", "N3", "N4", "PER"]);
    assert.strictEqual(partyLoop!.Loop![0].parentSegment, partyLoop);

    assert.ok(po1Loop);
    assert.deepStrictEqual(po1Loop!.Loop!.map((segment) => segment.id), [
      "PO1",
      "PIDLoop1",
      "MSG",
      "PKGLoop1",
      "N9Loop2",
      "N9Loop2",
      "N1Loop3",
      "SLNLoop1",
    ]);
    assert.ok(slnLoop);
    assert.deepStrictEqual(slnLoop!.Loop!.map((segment) => segment.id), ["SLN", "PID", "N9Loop3"]);
    assert.strictEqual(slnLoop!.Loop![0].parentSegment, slnLoop);
    assert.ok(nestedNoteLoop);
    assert.deepStrictEqual(nestedNoteLoop!.Loop!.map((segment) => segment.id), ["N9", "MSG"]);
    assert.strictEqual(nestedNoteLoop!.Loop![0].parentSegment, nestedNoteLoop);
    assert.ok(flattenedIds.includes("PO1"));
    assert.ok(flattenedIds.includes("SLN"));
    assert.ok(!wrappedSegments.some((segment) => segment.id === "SLN"));
  });

  test("856 should fit HL loops with nested N1 loop and preserve flattened order", async () => {
    const document = await parseEdi(createX12856Document());
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];
    const wrappedSegments = transactionSet.segments;
    const flattenedIds = transactionSet.getSegments(true).map((segment) => segment.id);
    const itemLoop = wrappedSegments[3];
    const nestedPartyLoop = itemLoop.Loop!.find((segment) => segment.id === "N1Loop1");

    assert.strictEqual(transactionSet.meta.version, "856");
    assert.strictEqual(transactionSet.meta.messageInfo?.version, "856");
    assert.deepStrictEqual(wrappedSegments.map((segment) => segment.id), ["BSN", "HLLoop1", "HLLoop1", "HLLoop1"]);
    assert.deepStrictEqual(itemLoop.Loop!.map((segment) => segment.id), ["HL", "LIN", "SN1", "N1Loop1"]);
    assert.ok(nestedPartyLoop);
    assert.deepStrictEqual(nestedPartyLoop!.Loop!.map((segment) => segment.id), ["N1", "N2"]);
    assert.strictEqual(nestedPartyLoop!.Loop![0].parentSegment, nestedPartyLoop);
    assert.deepStrictEqual(
      flattenedIds,
      ["ST", "BSN", "HL", "TD1", "HL", "PRF", "HL", "LIN", "SN1", "N1", "N2", "SE"],
    );
  });

  test("810 should switch transaction set type and message info", async () => {
    const document = await parseEdi(createX12810Document());
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];
    const bigSegment = transactionSet.getSegments(true).find((segment) => segment.id === "BIG");

    assert.strictEqual(transactionSet.meta.release, "00401");
    assert.strictEqual(transactionSet.meta.version, "810");
    assert.strictEqual(transactionSet.meta.messageInfo?.version, "810");
    assert.ok(bigSegment);
    assert.ok(bigSegment!.ediReleaseSchemaSegment);
  });

  test("should parse component elements through parseSegment", async () => {
    const parser = new X12Parser("SV2*0730*HC>93010*76.56*UN*3~");
    parser.setMessageSeparators({
      segmentSeparator: "~",
      dataElementSeparator: "*",
      componentElementSeparator: ">",
    });
    await parser.loadSchema({ release: "00401", version: "850" });

    const segment = await parser.parseSegment("SV2*0730*HC>93010*76.56*UN*3~", 0, "~");

    assert.strictEqual(segment.id, "SV2");
    assert.strictEqual(segment.elements[1].components!.length, 2);
    assert.strictEqual(segment.elements[1].components![0].value, "HC");
    assert.strictEqual(segment.elements[1].components![1].value, "93010");
    assert.strictEqual(segment.elements[1].components![0].type, ElementType.componentElement);
  });

  test("should prefer GS08 release over ISA12 when both are present", async () => {
    const document = await parseEdi([
      "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00400*000000001*0*T*:~",
      "GS*PO*SENDER*RECEIVER*20241111*0300*1*X*004010~",
      "ST*850*0001~",
      "BEG*00*DS*PO1**20150708~",
      "SE*3*0001~",
      "GE*1*1~",
      "IEA*1*000000001~",
    ].join("\n"));
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];

    assert.strictEqual(transactionSet.meta.release, "00401");
    assert.strictEqual(transactionSet.meta.version, "850");
  });

  test("should still parse unsupported releases without schema metadata", async () => {
    const document = await parseEdi(createUnsupportedReleaseX12Document());
    const begSegment = document!.getSegments(true).find((segment) => segment.id === "BEG");

    assert.ok(begSegment);
    assert.strictEqual(begSegment!.ediReleaseSchemaSegment, undefined);
  });

  test("should parse documents with LF, CR and no trailing newline when segment separator remains tilde", async () => {
    const lfDocument = await parseEdi(createX12PurchaseOrderDocument("\n"));
    const crDocument = await parseEdi(createX12PurchaseOrderDocument("\r"));
    const noTrailingNewlineDocument = await parseEdi(stripTrailingLineBreaks(createX12PurchaseOrderDocument("\n")));

    assert.strictEqual(lfDocument!.interchanges.length, 1);
    assert.strictEqual(crDocument!.interchanges.length, 1);
    assert.strictEqual(noTrailingNewlineDocument!.interchanges.length, 1);
    assert.strictEqual(new X12Parser(createX12PurchaseOrderDocument("\r")).getMessageSeparators().segmentSeparator, "~");
    assert.strictEqual(noTrailingNewlineDocument!.getSegments(true).at(-1)!.id, "IEA");
  });
});
