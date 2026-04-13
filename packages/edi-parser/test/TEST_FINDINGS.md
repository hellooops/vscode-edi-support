# Test Findings

## 2026-04-13

### Comment-prefixed documents are not detected by the public factory helpers
- Case:
  - `parseEdi(readFixture("850-comments.x12"))`
  - `createParser(readFixture("850-comments.x12"))`
- Actual behavior:
  - The document is detected as `unknown`, so the factory helpers return `undefined`.
- Expected behavior:
  - Leading line comments should not prevent `x12` / `edifact` / `vda` type detection when the underlying document is otherwise valid.
- Impact:
  - Parser classes such as `new X12Parser(text).parse()` can preserve comments correctly, but package-level convenience entry points currently reject the same comment-prefixed payload.
- Status:
  - Confirmed implementation issue. Now covered by a failing regression test in `public-api.test.ts`.

### X12 formatted output does not preserve inline comment placement
- Case:
  - `new X12Parser(readFixture("850-comments.x12")).parse().then((document) => document.toString())`
- Actual behavior:
  - Comments are retained, but inline comments that originally appeared after a segment terminator are emitted as standalone lines before the next segment.
- Expected behavior:
  - `toString()` / `getFormatString()` should preserve the original comment placement closely enough for round-tripping comment-rich X12 fixtures.
- Impact:
  - Structural comment information survives parsing, but formatted output is not position-stable for comment-heavy X12 files.
- Status:
  - Confirmed implementation issue. Now covered by a failing regression test in `x12-parser.test.ts`.
