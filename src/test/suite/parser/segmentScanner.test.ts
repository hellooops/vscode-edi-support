import * as assert from "assert";

import { SegmentScanner } from "../../../parser/segmentScanner";

suite("SegmentScanner Test Suite", () => {
  const createScanner = (document: string) =>
    new SegmentScanner(
      document,
      /\b([\s\S]*?)(~|$)/g,
      /(?<=^\s*?)\/\/[\s\S]*?(?=(\n|$))/g,
    );

  test("Should scan comment and segment tokens in order", () => {
    const document = "// first comment\nISA*00*~\n// second comment\nGS*PO*1~";
    const scanner = createScanner(document);

    const first = scanner.next();
    const second = scanner.next();
    const third = scanner.next();
    const fourth = scanner.next();

    assert.deepStrictEqual(first, {
      type: "comment",
      startIndex: 0,
      endIndex: 15,
      value: "// first comment",
    });
    assert.deepStrictEqual(second, {
      type: "segment",
      startIndex: 17,
      endingDelimiter: "~",
      value: "ISA*00*~",
    });
    assert.deepStrictEqual(third, {
      type: "comment",
      startIndex: 26,
      endIndex: 42,
      value: "// second comment",
    });
    assert.deepStrictEqual(fourth, {
      type: "segment",
      startIndex: 44,
      endingDelimiter: "~",
      value: "GS*PO*1~",
    });
    assert.strictEqual(scanner.next(), undefined);
  });

  test("Should reset regex state between consecutive segment scans", () => {
    const scanner = createScanner("ISA*00*~GS*PO*1~SE*2*0001~");

    const first = scanner.next();
    const second = scanner.next();
    const third = scanner.next();

    assert.strictEqual(first?.type, "segment");
    assert.strictEqual(first?.value, "ISA*00*~");
    assert.strictEqual(second?.type, "segment");
    assert.strictEqual(second?.value, "GS*PO*1~");
    assert.strictEqual(third?.type, "segment");
    assert.strictEqual(third?.value, "SE*2*0001~");
  });

  test("Should track comment indexes when line starts with indentation", () => {
    const scanner = createScanner("  // padded comment\nISA*00*~");

    const token = scanner.next();

    assert.deepStrictEqual(token, {
      type: "comment",
      startIndex: 2,
      endIndex: 18,
      value: "// padded comment",
    });
  });

  test("Should return undefined when neither comments nor segments match", () => {
    const scanner = new SegmentScanner("plain text", /SEG(\|)/g, /\/\/.*/g);

    assert.strictEqual(scanner.next(), undefined);
  });
});
