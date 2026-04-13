import * as assert from "assert";

import {
  normalizeLineBreaks,
  readDoc,
  stripTrailingLineBreaks,
} from "./helpers/fixtures";
import { root, vdaParserModule } from "./helpers/runtime";

const { parseEdi } = root as typeof import("../dist");
const { VdaParser } = vdaParserModule as typeof import("../dist/parser/vdaParser");

suite("edi-parser vda parser", () => {
  test("511/02 should parse metadata and fixed-width element slices", async () => {
    const text = readDoc("4905.edi");
    const parser = new VdaParser(text);
    await parser.loadSchema({ release: "02", version: "511" });

    const document = await parser.parse();
    const transactionSet = document.interchanges[0].functionalGroups[0].transactionSets[0];
    const firstSegment = transactionSet.getSegments(true)[0];

    assert.strictEqual(transactionSet.meta.version, "511");
    assert.strictEqual(transactionSet.meta.release, "02");
    assert.strictEqual(transactionSet.meta.id, "00001");
    assert.strictEqual(firstSegment.id, "511");
    assert.strictEqual(firstSegment.elements[0].value, "02");
    assert.strictEqual(firstSegment.elements[3].value, "99999");
    assert.strictEqual(firstSegment.elements[4].value, "00001");
  });

  test("511 should wrap repeated 512 loops and preserve flattened order", async () => {
    const document = await parseEdi(createLongVda511Document());
    const transactionSet = document!.interchanges[0].functionalGroups[0].transactionSets[0];
    const wrappedSegments = transactionSet.segments;
    const flattenedIds = transactionSet.getSegments(true).map((segment) => segment.id);

    assert.deepStrictEqual(wrappedSegments.map((segment) => segment.id), ["512Loop", "512Loop"]);
    assert.deepStrictEqual(wrappedSegments[0].Loop!.map((segment) => segment.id), ["512", "513", "515", "518"]);
    assert.deepStrictEqual(wrappedSegments[1].Loop!.map((segment) => segment.id), ["512", "513", "515", "518"]);
    assert.strictEqual(wrappedSegments[0].Loop![0].parentSegment, wrappedSegments[0]);
    assert.deepStrictEqual(flattenedIds, ["511", "512", "513", "515", "518", "512", "513", "515", "518", "519"]);
  });

  test("711/03 should parse metadata, schema-driven elements and nested loop hierarchy", async () => {
    const text = readDoc("4913.edi");
    const parser = new VdaParser(text);
    await parser.loadSchema({ release: "03", version: "711" });

    const document = await parser.parse();
    const transactionSet = document.interchanges[0].functionalGroups[0].transactionSets[0];
    const rootLoop = transactionSet.segments[0];
    const nested713Loop = rootLoop.Loop!.find((segment) => segment.id === "713Loop")!;
    const nested714Loop = nested713Loop.Loop!.find((segment) => segment.id === "714Loop")!;
    const firstSegment = transactionSet.getSegments(true)[0];

    assert.strictEqual(transactionSet.meta.version, "711");
    assert.strictEqual(transactionSet.meta.release, "03");
    assert.strictEqual(firstSegment.id, "711");
    assert.strictEqual(firstSegment.elements[0].value, "03");
    assert.strictEqual(firstSegment.elements[3].value, "00001");
    assert.deepStrictEqual(rootLoop.Loop!.map((segment) => segment.id), ["712", "713Loop"]);
    assert.deepStrictEqual(nested713Loop.Loop!.map((segment) => segment.id), ["713", "714Loop"]);
    assert.deepStrictEqual(nested714Loop.Loop!.map((segment) => segment.id), ["714", "718", "715", "715"]);
    assert.strictEqual(nested714Loop.Loop![0].parentSegment, nested714Loop);
  });

  test("should parse LF, CR and no trailing newline VDA documents", async () => {
    const baseText = readDoc("4905.edi");
    const lfDocument = await parseEdi(normalizeLineBreaks(baseText, "\n"));
    const crDocument = await parseEdi(normalizeLineBreaks(baseText, "\r"));
    const noTrailingNewlineDocument = await parseEdi(stripTrailingLineBreaks(baseText));

    assert.strictEqual(lfDocument!.interchanges.length, 1);
    assert.strictEqual(crDocument!.interchanges.length, 1);
    assert.strictEqual(noTrailingNewlineDocument!.interchanges.length, 1);
    assert.strictEqual(noTrailingNewlineDocument!.getSegments(true).slice(-1)[0].id, "519");
  });

  test("should handle too short input, invalid separator position, and unknown releases without schema", async () => {
    const tooShortDocument = await parseEdi("51102X".repeat(10));
    const invalidSeparatorDocument = await parseEdi(`51102${"X".repeat(123)}Y`);
    const unknownReleaseDocument = await parseEdi(`51199                  9999900001250124111231                                                                                   \n`);
    const unknownReleaseSegment = unknownReleaseDocument!.getSegments(true)[0];

    assert.strictEqual(tooShortDocument!.interchanges.length, 0);
    assert.strictEqual(invalidSeparatorDocument!.getSegments(true).length, 1);
    assert.strictEqual(unknownReleaseDocument!.interchanges[0].functionalGroups[0].transactionSets[0].meta.release, "99");
    assert.strictEqual(unknownReleaseSegment.ediReleaseSchemaSegment, undefined);
    assert.strictEqual(unknownReleaseSegment.elements.length, 0);
  });
});

function createLongVda511Document(): string {
  return [
    "51102                  9999900001250124111231                                                                                   ",
    "51201030187      121115186      1211091514280009100                               CGF-56026482A 13     STL                      ",
    "51301121113432701        0000003460000000019427121115000000000000000                                                            ",
    "5150100000013021300000000000000001303150000000000                               000000                                          ",
    "5180107-08140295/04                          23-09140029                                                                        ",
    "51201030187      121115186      1211091514280009100                               CGF-56026482A 13     STL                      ",
    "51301121113432701        0000003460000000019427121115000000000000000                                                            ",
    "5150100000013021300000000000000001303150000000000                               000000                                          ",
    "5180107-08140295/04                          23-09140029                                                                        ",
    "5190100000010000001000000100000000000000000000100000010000001                                                                   ",
  ].join("\n");
}
