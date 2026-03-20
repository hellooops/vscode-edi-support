# Review Fix TODO

- [x] Refactor 1: Extract the scan loop in `parseDocumentInternal` into a dedicated scanner that emits comment/segment tokens, so document parsing focuses on assembly logic.
- [ ] Refactor 2: Split `parseSegmentInternal` state-machine logic into focused helper methods to reduce branching and mutable local state.
- [ ] Refactor 3: Move `SchemaVersionSegmentsContext` out of `ediParserBase.ts` into an isolated module.
