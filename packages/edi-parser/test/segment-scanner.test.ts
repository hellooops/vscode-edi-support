import * as assert from "assert";

import { segmentScannerModule } from "./helpers/runtime";

const { SegmentScanner } = segmentScannerModule as typeof import("../dist/parser/segmentScanner");

suite("edi-parser segment scanner", () => {
  const createScanner = (document: string) => new SegmentScanner(
    document,
    /\b([\s\S]*?)(~|$)/g,
    /(?<=^\s*?)\/\/[\s\S]*?(?=(\n|$))/g,
  );

  test("should scan comment and segment tokens in order", () => {
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

  test("should reset regex state between consecutive segment scans", () => {
    const scanner = createScanner("ISA*00*~GS*PO*1~SE*2*0001~");

    const first = scanner.next();
    const second = scanner.next();
    const third = scanner.next();

    assert.strictEqual(first!.type, "segment");
    assert.strictEqual(first!.value, "ISA*00*~");
    assert.strictEqual(second!.type, "segment");
    assert.strictEqual(second!.value, "GS*PO*1~");
    assert.strictEqual(third!.type, "segment");
    assert.strictEqual(third!.value, "SE*2*0001~");
  });

  test("should track comment indexes when line starts with indentation", () => {
    const scanner = createScanner("  // padded comment\nISA*00*~");

    const token = scanner.next();

    assert.deepStrictEqual(token, {
      type: "comment",
      startIndex: 2,
      endIndex: 18,
      value: "// padded comment",
    });
  });

  test("should return undefined for empty input, comment-only input and plain text without segment matches", () => {
    const emptyScanner = createScanner("");
    const commentOnlyScanner = createScanner("// comment only");
    const unmatchedScanner = new SegmentScanner("plain text", /SEG(\|)/g, /\/\/.*/g);

    assert.strictEqual(emptyScanner.next(), undefined);
    assert.deepStrictEqual(commentOnlyScanner.next(), {
      type: "comment",
      startIndex: 0,
      endIndex: 14,
      value: "// comment only",
    });
    assert.strictEqual(commentOnlyScanner.next(), undefined);
    assert.strictEqual(unmatchedScanner.next(), undefined);
  });

  test("should continue to segment-only tokens after comments are exhausted", () => {
    const scanner = createScanner("// lead\nISA*00*~GS*PO*1~");

    assert.strictEqual(scanner.next()!.type, "comment");
    assert.strictEqual(scanner.next()!.value, "ISA*00*~");
    assert.strictEqual(scanner.next()!.value, "GS*PO*1~");
    assert.strictEqual(scanner.next(), undefined);
  });
});
