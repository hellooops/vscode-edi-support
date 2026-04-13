import * as assert from "assert";

import { parserEntities, schemaVersionSegmentsContextModule, schemasModule } from "./helpers/runtime";

const { EdiSegment } = parserEntities as typeof import("../dist/parser/entities");
const { SchemaVersionSegmentsContext } = schemaVersionSegmentsContextModule as typeof import("../dist/parser/schemaVersionSegmentsContext");
const { EdiVersionSegment } = schemasModule as typeof import("../dist/schemas/schemas");
type EdiSegmentType = import("../dist/parser/entities").EdiSegment;

suite("edi-parser schema version segments context", () => {
  test("should keep root header segments, wrap matching loops and append remaining segments", () => {
    const context = new SchemaVersionSegmentsContext([
      new EdiVersionSegment({ Id: "BEG" }),
      new EdiVersionSegment({
        Id: "N1Loop1",
        Loop: [{ Id: "N1" }, { Id: "N2" }],
      }),
    ]);
    const headerSegment = createHeaderSegment("ISA");
    const begSegment = createBodySegment("BEG");
    const n1Segment = createBodySegment("N1");
    const n2Segment = createBodySegment("N2");
    const trailingSegment = createBodySegment("CTT");

    const result = context.build([headerSegment, begSegment, n1Segment, n2Segment, trailingSegment]);

    assert.deepStrictEqual(result.map((segment) => segment.id), ["ISA", "BEG", "N1Loop1", "CTT"]);
    assert.deepStrictEqual(result[2].Loop!.map((segment) => segment.id), ["N1", "N2"]);
    assert.strictEqual(result[2].Loop![0].parentSegment, result[2]);
    assert.strictEqual(result[3], trailingSegment);
  });

  test("should not wrap a loop when the first child segment does not match", () => {
    const context = new SchemaVersionSegmentsContext([
      new EdiVersionSegment({
        Id: "N1Loop1",
        Loop: [{ Id: "N1" }, { Id: "N2" }],
      }),
    ]);
    const unmatchedSegment = createBodySegment("REF");

    const result = context.build([unmatchedSegment]);

    assert.deepStrictEqual(result.map((segment) => segment.id), ["REF"]);
    assert.strictEqual(result[0], unmatchedSegment);
    assert.strictEqual(result[0].parentSegment, undefined);
  });

  test("should build nested loop wrappers and set parent segments recursively", () => {
    const context = new SchemaVersionSegmentsContext([
      new EdiVersionSegment({
        Id: "PO1Loop1",
        Loop: [
          { Id: "PO1" },
          {
            Id: "SLNLoop1",
            Loop: [{ Id: "SLN" }, { Id: "MSG" }],
          },
        ],
      }),
    ]);
    const po1Segment = createBodySegment("PO1");
    const slnSegment = createBodySegment("SLN");
    const msgSegment = createBodySegment("MSG");

    const result = context.build([po1Segment, slnSegment, msgSegment]);
    const po1Loop = result[0];
    const slnLoop = po1Loop.Loop![1];

    assert.strictEqual(po1Loop.id, "PO1Loop1");
    assert.deepStrictEqual(po1Loop.Loop!.map((segment) => segment.id), ["PO1", "SLNLoop1"]);
    assert.deepStrictEqual(slnLoop.Loop!.map((segment) => segment.id), ["SLN", "MSG"]);
    assert.strictEqual(po1Loop.Loop![0].parentSegment, po1Loop);
    assert.strictEqual(slnLoop.Loop![0].parentSegment, slnLoop);
  });

  test("should stop matching on non-loop mismatches instead of skipping ahead to later segments", () => {
    const context = new SchemaVersionSegmentsContext([
      new EdiVersionSegment({ Id: "BEG" }),
      new EdiVersionSegment({ Id: "REF" }),
    ]);
    const begSegment = createBodySegment("BEG");
    const unexpectedSegment = createBodySegment("DTM");
    const refSegment = createBodySegment("REF");

    const result = context.build([begSegment, unexpectedSegment, refSegment]);

    assert.deepStrictEqual(result.map((segment) => segment.id), ["BEG", "DTM", "REF"]);
    assert.strictEqual(result[1], unexpectedSegment);
    assert.strictEqual(result[2], refSegment);
  });

  test("should preserve header segments while fitting later body loops", () => {
    const context = new SchemaVersionSegmentsContext([
      new EdiVersionSegment({ Id: "BEG" }),
      new EdiVersionSegment({
        Id: "N1Loop1",
        Loop: [{ Id: "N1" }, { Id: "N2" }],
      }),
    ]);
    const isaSegment = createHeaderSegment("ISA");
    const gsSegment = createHeaderSegment("GS");
    const begSegment = createBodySegment("BEG");
    const n1Segment = createBodySegment("N1");
    const n2Segment = createBodySegment("N2");

    const result = context.build([isaSegment, gsSegment, begSegment, n1Segment, n2Segment]);

    assert.deepStrictEqual(result.map((segment) => segment.id), ["ISA", "GS", "BEG", "N1Loop1"]);
    assert.deepStrictEqual(result[3].Loop!.map((segment) => segment.id), ["N1", "N2"]);
  });

  test("should mark segments that exceed Max occurrences", () => {
    const context = new SchemaVersionSegmentsContext([
      new EdiVersionSegment({ Id: "REF", Max: 1 }),
    ]);
    const firstRef = createBodySegment("REF");
    const secondRef = createBodySegment("REF");

    const result = context.build([firstRef, secondRef]);

    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(result[1].segmentMaximumOccurrencesExceed, {
      expect: 1,
      actual: 2,
    });
  });

  test("should leave unconsumed nested loop segments at the top level when partial loop fitting stops early", () => {
    const context = new SchemaVersionSegmentsContext([
      new EdiVersionSegment({
        Id: "PO1Loop1",
        Loop: [
          { Id: "PO1" },
          {
            Id: "SLNLoop1",
            Loop: [{ Id: "SLN" }, { Id: "MSG" }],
          },
          { Id: "PID" },
        ],
      }),
    ]);
    const po1Segment = createBodySegment("PO1");
    const slnSegment = createBodySegment("SLN");
    const unexpectedSegment = createBodySegment("REF");
    const trailingPidSegment = createBodySegment("PID");

    const result = context.build([po1Segment, slnSegment, unexpectedSegment, trailingPidSegment]);
    const wrappedLoop = result[0];

    assert.deepStrictEqual(result.map((segment) => segment.id), ["PO1Loop1", "REF", "PID"]);
    assert.deepStrictEqual(wrappedLoop.Loop!.map((segment) => segment.id), ["PO1", "SLNLoop1"]);
    assert.deepStrictEqual(wrappedLoop.Loop![1].Loop!.map((segment) => segment.id), ["SLN"]);
    assert.strictEqual(wrappedLoop.Loop![0].parentSegment, wrappedLoop);
    assert.strictEqual(result[1], unexpectedSegment);
    assert.strictEqual(result[2], trailingPidSegment);
    assert.strictEqual(result[1].parentSegment, undefined);
    assert.strictEqual(result[2].parentSegment, undefined);
  });
});

function createHeaderSegment(id: string): EdiSegmentType {
  return new EdiSegment(id, 0, id.length - 1, id.length, "~");
}

function createBodySegment(id: string): EdiSegmentType {
  const segment = new EdiSegment(id, 0, id.length - 1, id.length, "~");
  segment.transactionSetParent = {} as any;
  return segment;
}
