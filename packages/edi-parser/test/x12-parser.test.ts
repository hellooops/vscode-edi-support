import * as assert from "assert";

import {
  cloneJson,
  createLegacyX12PurchaseOrderDocument,
  createUnsupportedReleaseX12Document,
  createX12810Document,
  createX12856Document,
  createX12PurchaseOrderDocument,
  normalizeLineBreaks,
  readFixture,
  stripTrailingLineBreaks,
} from "./helpers/fixtures";
import { parserEntities, root, x12ParserModule } from "./helpers/runtime";

const { loadBuiltInSchemaBundle } = root as typeof import("../dist");
const { X12Parser } = x12ParserModule as typeof import("../dist/parser/x12Parser");
const { ElementType } = parserEntities as typeof import("../dist/parser/entities");

suite("edi-parser x12 parser", () => {
  test("850 should parse base metadata, message info and schema-backed segments", async () => {
    const document = await parseX12(readFixture("850.x12"));
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
    const document = await parseX12(readFixture("850-loop.edi"));
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

  test("should parse multiple transactions within one functional group from fixture", async () => {
    const document = await parseX12(readFixture("multiple_transactions.x12"));
    const interchange = document!.interchanges[0];
    const functionalGroup = interchange.functionalGroups[0];

    assert.strictEqual(document!.interchanges.length, 1);
    assert.strictEqual(interchange.functionalGroups.length, 1);
    assert.deepStrictEqual(
      functionalGroup.transactionSets.map((transactionSet) => ({
        version: transactionSet.meta.version,
        id: transactionSet.meta.id,
        flat: transactionSet.getSegments(true).map((segment) => segment.id),
      })),
      [
        { version: "860", id: "0001", flat: ["ST", "BCH", "CUR", "SE"] },
        { version: "860", id: "0002", flat: ["ST", "BCH", "CUR", "SE"] },
      ],
    );
  });

  test("should parse multiple functional groups from an interchange fixture", async () => {
    const document = await parseX12(readFixture("X12-interchanges.x12"));
    const interchange = document!.interchanges[0];

    assert.strictEqual(document!.interchanges.length, 1);
    assert.strictEqual(interchange.functionalGroups.length, 2);
    assert.deepStrictEqual(
      interchange.functionalGroups.map((functionalGroup) =>
        functionalGroup.transactionSets.map((transactionSet) => transactionSet.meta.version),
      ),
      [["850", "864"], ["850"]],
    );
    assert.deepStrictEqual(
      interchange.functionalGroups.map((functionalGroup) =>
        functionalGroup.transactionSets.map((transactionSet) => transactionSet.meta.id),
      ),
      [["0001", "0002"], ["0003"]],
    );
  });

  test("856 should fit HL loops with nested N1 loop and preserve flattened order", async () => {
    const document = await parseX12(createX12856Document());
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
    const document = await parseX12(createX12810Document());
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
    const document = await parseX12([
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

  test("should preserve legacy gs08 release prefixes with trading-partner suffixes and fit 830 loops", async () => {
    const document = await parseX12([
      "ISA*00*          *00*          *ZZ*TP             *ZZ*TEST           *050815*1824*U*00200*000000001*0*T*>~",
      "GS*PS*TP*TEST*20050824*0554*1*X*002001ABC~",
      "ST*830*00001~",
      "BFR*05**501-1*SH*C*880801*890805*890304~",
      "N1*ST**92*1602A~",
      "N1*BY**92*BUYER01~",
      "LIN**BP*E6SP 7E396 AA 040*PO*FE 4397~",
      "SDP*Y*Y~",
      "FST*56700*D*W*890304~",
      "SHP*02*18300*011*880801**890214~",
      "REF*SI*72396~",
      "CTT*1*115200~",
      "SE*10*00001~",
      "GE*1*1~",
      "IEA*1*000000001~",
    ].join("\n"));
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];

    assert.strictEqual(transactionSet.meta.release, "002001");
    assert.strictEqual(transactionSet.meta.version, "830");
    assert.deepStrictEqual(
      transactionSet.segments.map((segment) => segment.id),
      ["BFR", "N1Loop1", "N1Loop1", "LINLoop1", "CTT"],
    );
    assert.deepStrictEqual(
      transactionSet.segments[1].Loop!.map((segment) => segment.id),
      ["N1"],
    );
    assert.deepStrictEqual(
      transactionSet.segments[3].Loop!.map((segment) => segment.id),
      ["LIN", "SDPLoop1", "SHPLoop1"],
    );
    assert.deepStrictEqual(
      transactionSet.segments[3].Loop!.find((segment) => segment.id === "SDPLoop1")!.Loop!.map((segment) => segment.id),
      ["SDP", "FST"],
    );
    assert.deepStrictEqual(
      transactionSet.segments[3].Loop!.find((segment) => segment.id === "SHPLoop1")!.Loop!.map((segment) => segment.id),
      ["SHP", "REF"],
    );
  });

  test("should preserve 6-digit legacy x12 releases instead of collapsing them to 00200", async () => {
    for (const release of ["002001", "002002", "002003"] as const) {
      const document = await parseX12(createLegacyX12PurchaseOrderDocument(release));
      const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];
      const begSegment = transactionSet.getSegments(true).find((segment) => segment.id === "BEG");
      const expectedSchema = loadBuiltInSchemaBundle({
        ediType: "x12",
        release,
        version: "850",
      }) as any;

      assert.strictEqual(transactionSet.meta.release, release);
      assert.strictEqual(transactionSet.meta.version, "850");
      assert.ok(begSegment?.ediReleaseSchemaSegment);
      assert.strictEqual(begSegment?.getDesc(), expectedSchema.releaseSchema.Segments.BEG.Desc);
    }
  });

  test("should still parse unsupported releases without schema metadata", async () => {
    const document = await parseX12(createUnsupportedReleaseX12Document());
    const begSegment = document!.getSegments(true).find((segment) => segment.id === "BEG");

    assert.ok(begSegment);
    assert.strictEqual(begSegment!.ediReleaseSchemaSegment, undefined);
  });

  test("should preserve x12 comments and formatting when parsed directly", async () => {
    const text = readFixture("850-comments.x12");
    const document = await new X12Parser(text).parse();
    const interchange = document.interchanges[0];
    const functionalGroup = interchange.functionalGroups[0];
    const transactionSet = functionalGroup.transactionSets[0];
    const begSegment = transactionSet.getSegments(true).find((segment) => segment.id === "BEG")!;
    const secondRefSegment = transactionSet.getSegments(true).filter((segment) => segment.id === "REF")[1]!;
    const n1Segment = transactionSet.getSegments(true).find((segment) => segment.id === "N1")!;
    const cttSegment = transactionSet.getSegments(true).find((segment) => segment.id === "CTT")!;
    const interchangeEndSegment = interchange.endSegment!;

    assert.deepStrictEqual(interchange.startSegment!.comments.map(normalizeCommentContent), ["// 1"]);
    assert.deepStrictEqual(interchange.startSegment!.trailingComments.map(normalizeCommentContent), ["// 2"]);
    assert.deepStrictEqual(functionalGroup.startSegment!.comments.map(normalizeCommentContent), ["// 3"]);
    assert.deepStrictEqual(functionalGroup.startSegment!.trailingComments.map(normalizeCommentContent), ["// 4 // 4"]);
    assert.deepStrictEqual(transactionSet.startSegment!.comments.map(normalizeCommentContent), ["// 5"]);
    assert.deepStrictEqual(transactionSet.startSegment!.trailingComments.map(normalizeCommentContent), ["// 6"]);
    assert.deepStrictEqual(begSegment.comments.map(normalizeCommentContent), ["// 7"]);
    assert.deepStrictEqual(secondRefSegment.trailingComments.map(normalizeCommentContent), ["// 7.1"]);
    assert.deepStrictEqual(n1Segment.trailingComments.map(normalizeCommentContent), ["// 7.2"]);
    assert.deepStrictEqual(cttSegment.comments.map(normalizeCommentContent), ["// 9"]);
    assert.deepStrictEqual(interchangeEndSegment.trailingComments.map(normalizeCommentContent), ["// 13"]);
    assert.deepStrictEqual(
      document.commentsAfterDocument.map(normalizeCommentContent),
      ["// 14", "// 15", "// 16", "//    17", "//18"],
    );
    assert.ok(normalizeLineBreaks(document.toString(), "\n").includes("REF*2H*AD*Ad~// 7.1\nN1*BT*Example.com Accounts Payable~// 7.2"));
  });

  test("should preserve x12 inline comment placement in formatted output", async () => {
    const text = readFixture("850-comments.x12");
    const document = await new X12Parser(text).parse();
    const formatted = normalizeLineBreaks(document.toString(), "\n");

    assert.ok(formatted.includes("ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~// 2"));
    assert.ok(formatted.includes("GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~// 4 // 4"));
    assert.ok(formatted.includes("ST*850*0001~// 6"));
    assert.ok(formatted.includes("REF*2H*AD*Ad~// 7.1"));
    assert.ok(formatted.includes("N1*BT*Example.com Accounts Payable~// 7.2"));
    assert.ok(formatted.includes("N2*asde~// 8"));
    assert.ok(formatted.includes("CTT*1*200~// 10"));
    assert.ok(formatted.includes("SE*8*0001~// 11"));
    assert.ok(formatted.includes("GE*1*7080~// 12"));
    assert.ok(formatted.includes("IEA*1*000007080~// 13"));
  });

  test("should keep parsing when x12 release schema is partially missing", async () => {
    const partialBundle = cloneJson(loadBuiltInSchemaBundle({
      ediType: "x12",
      release: "00401",
      version: "850",
    })! as any);
    delete partialBundle.releaseSchema.Segments.BEG;

    const document = await parseX12(createX12PurchaseOrderDocument(), {
      schemaResolver: () => partialBundle,
    });
    const begSegment = document!.getSegments(true).find((segment) => segment.id === "BEG")!;
    const dtmSegment = document!.getSegments(true).find((segment) => segment.id === "DTM")!;

    assert.strictEqual(begSegment.isInvalidSegment, true);
    assert.strictEqual(begSegment.ediReleaseSchemaSegment, undefined);
    assert.ok(dtmSegment.ediReleaseSchemaSegment);
  });

  test("should parse documents with LF, CR and no trailing newline when segment separator remains tilde", async () => {
    const lfDocument = await parseX12(createX12PurchaseOrderDocument("\n"));
    const crDocument = await parseX12(createX12PurchaseOrderDocument("\r"));
    const noTrailingNewlineDocument = await parseX12(stripTrailingLineBreaks(createX12PurchaseOrderDocument("\n")));

    assert.strictEqual(lfDocument!.interchanges.length, 1);
    assert.strictEqual(crDocument!.interchanges.length, 1);
    assert.strictEqual(noTrailingNewlineDocument!.interchanges.length, 1);
    assert.strictEqual(new X12Parser(createX12PurchaseOrderDocument("\r")).getMessageSeparators().segmentSeparator, "~");
    assert.strictEqual(noTrailingNewlineDocument!.getSegments(true).at(-1)!.id, "IEA");
  });
});

function normalizeCommentContent(comment: { content: string }): string {
  return comment.content.replace(/\r/g, "");
}

async function parseX12(text: string, options: ConstructorParameters<typeof X12Parser>[1] = {}) {
  return await new X12Parser(text, options).parse();
}
