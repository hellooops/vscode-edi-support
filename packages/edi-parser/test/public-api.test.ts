import * as assert from "assert";

import {
  cloneJson,
  createEdifactDelforDocument,
  createEdifactOrdersDocument,
  createUnsupportedReleaseX12Document,
  createVda511Document,
  createX12PurchaseOrderDocument,
  createX12PurchaseOrderWithCustomQualifier,
  readFixture,
} from "./helpers/fixtures";
import { root } from "./helpers/runtime";

const {
  createParser,
  detectEdiType,
  DiagnosticErrors,
  EdifactParser,
  getBuiltInSchema,
  loadBuiltInSchemaBundle,
  parseEdi,
  VdaParser,
  X12Parser,
} = root as typeof import("../dist");
type IEdiDocument = import("../dist").IEdiDocument;

suite("edi-parser public api", () => {
  test("should export snapshot dto types and toObject-compatible documents", async () => {
    const document = await parseEdi(createX12PurchaseOrderDocument());
    const snapshot: IEdiDocument = document!.toObject();

    assert.strictEqual(snapshot.ediType, "x12");
    assert.strictEqual(snapshot.interchanges.length, 1);
    assert.strictEqual(snapshot.interchanges[0].functionalGroups[0].transactionSets[0].segments[0].id, "BEG");
  });

  test("should detect x12, edifact, vda and unknown texts", () => {
    assert.strictEqual(detectEdiType(createX12PurchaseOrderDocument()), "x12");
    assert.strictEqual(detectEdiType(createEdifactOrdersDocument()), "edifact");
    assert.strictEqual(detectEdiType(createVda511Document()), "vda");
    assert.strictEqual(detectEdiType("NOT_AN_EDI_DOCUMENT"), "unknown");
  });

  test("should treat empty, whitespace and prefixed whitespace consistently when detecting edi type", () => {
    assert.strictEqual(detectEdiType(""), "unknown");
    assert.strictEqual(detectEdiType("   \r\n\t"), "unknown");
    assert.strictEqual(detectEdiType(`  \n${createX12PurchaseOrderDocument()}`), "x12");
    assert.strictEqual(detectEdiType(`\n${createEdifactOrdersDocument()}`), "edifact");
    assert.strictEqual(detectEdiType(`\r\n${createVda511Document()}`), "vda");
  });

  test("should create parser instances by edi type", () => {
    assert.ok(createParser(createX12PurchaseOrderDocument()) instanceof X12Parser);
    assert.ok(createParser(createEdifactOrdersDocument()) instanceof EdifactParser);
    assert.ok(createParser(createVda511Document()) instanceof VdaParser);
    assert.strictEqual(createParser("NOT_AN_EDI_DOCUMENT"), undefined);
  });

  test("should return undefined parsers and parse results for empty or whitespace-only input", async () => {
    assert.strictEqual(createParser(""), undefined);
    assert.strictEqual(createParser("   \r\n\t"), undefined);
    assert.strictEqual(await parseEdi(""), undefined);
    assert.strictEqual(await parseEdi("   \r\n\t"), undefined);
  });

  test("should return undefined parser and parse result for unknown text", async () => {
    assert.strictEqual(createParser("plain text only"), undefined);
    assert.strictEqual(await parseEdi("plain text only"), undefined);
  });

  test("should detect and parse comment-prefixed x12 documents through the public factory helpers", async () => {
    const text = readFixture("850-comments.x12");
    const parser = createParser(text);
    const document = await parseEdi(text);

    assert.ok(parser instanceof X12Parser);
    assert.ok(document);
    assert.strictEqual(document!.interchanges.length, 1);
    assert.strictEqual(document!.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "850");
  });

  test("should parse x12, edifact and vda documents through parseEdi", async () => {
    const x12Document = await parseEdi(createX12PurchaseOrderDocument());
    const edifactDocument = await parseEdi(createEdifactOrdersDocument());
    const vdaDocument = await parseEdi(createVda511Document());

    assert.ok(x12Document);
    assert.strictEqual(x12Document.interchanges.length, 1);
    assert.strictEqual(x12Document.interchanges[0].functionalGroups[0].transactionSets[0].meta.release, "00401");
    assert.strictEqual(x12Document.getSegments().map((segment) => segment.id).includes("DTM"), true);

    assert.ok(edifactDocument);
    assert.strictEqual(edifactDocument.separatorsSegment?.id, "UNA");
    assert.strictEqual(edifactDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "ORDERS");

    assert.ok(vdaDocument);
    assert.strictEqual(vdaDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.release, "02");
    assert.strictEqual(vdaDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "511");
  });

  test("should load built-in schema resources from the distributed package", () => {
    const x12ReleaseSchema = getBuiltInSchema("x12", "00401") as any;
    const x12Bundle = loadBuiltInSchemaBundle({
      ediType: "x12",
      release: "00401",
      version: "850",
    }) as any;
    const edifactBundle = loadBuiltInSchemaBundle({
      ediType: "edifact",
      release: "D96A",
      version: "ORDERS",
    }) as any;
    const vdaBundle = loadBuiltInSchemaBundle({
      ediType: "vda",
      release: "02",
      version: "511",
    }) as any;

    assert.strictEqual(x12ReleaseSchema.Release, "00401");
    assert.ok(x12Bundle);
    assert.strictEqual(x12Bundle.releaseSchema.Release, "00401");
    assert.ok(x12Bundle.versionSchema.TransactionSet);
    assert.ok(edifactBundle);
    assert.strictEqual(edifactBundle.releaseSchema.Release, "D96A");
    assert.ok(edifactBundle.versionSchema.TransactionSet);
    assert.ok(vdaBundle);
    assert.strictEqual(vdaBundle.releaseSchema.Release, "02");
    assert.ok(vdaBundle.versionSchema.TransactionSet);
  });

  test("should return undefined for unknown and missing built-in schema requests", () => {
    assert.strictEqual(getBuiltInSchema("unknown", "00401"), undefined);
    assert.strictEqual(getBuiltInSchema("x12", "99999"), undefined);

    assert.strictEqual(loadBuiltInSchemaBundle({
      ediType: "unknown",
      release: "00401",
      version: "850",
    }), undefined);
    assert.strictEqual(loadBuiltInSchemaBundle({
      ediType: "x12",
      release: "99999",
      version: "850",
    }), undefined);
  });

  test("should load release schema without version and reject missing versions", () => {
    const releaseOnlyBundle = loadBuiltInSchemaBundle({
      ediType: "x12",
      release: "00401",
    }) as any;

    assert.ok(releaseOnlyBundle);
    assert.strictEqual(releaseOnlyBundle.releaseSchema.Release, "00401");
    assert.strictEqual(releaseOnlyBundle.versionSchema, undefined);
    assert.strictEqual(loadBuiltInSchemaBundle({
      ediType: "x12",
      release: "00401",
      version: "999",
    }), undefined);
  });

  test("should honor parser-level custom schema qualifier overrides", async () => {
    const document = await parseEdi(createX12PurchaseOrderWithCustomQualifier(), {
      customSchemas: {
        x12: {
          "00401": {
            qualifiers: {
              "Date/Time Qualifier": {
                ZZ: "Custom date qualifier",
              },
            },
          },
        },
      },
    });

    assert.ok(document);

    const qualifierErrors = document.getErrors()
      .filter(error => error.code === DiagnosticErrors.QUALIFIER_INVALID_CODE);

    assert.deepStrictEqual(qualifierErrors, []);
  });

  test("should allow external schema resolvers to supply missing releases", async () => {
    const requests: Array<{ ediType: string; release: string; version?: string }> = [];
    const withoutResolver = await parseEdi(createUnsupportedReleaseX12Document());
    const withoutResolverBeg = withoutResolver!.getSegments().find((segment) => segment.id === "BEG");

    const withResolver = await parseEdi(createUnsupportedReleaseX12Document(), {
      schemaResolver: (request) => {
        requests.push(request);
        return loadBuiltInSchemaBundle({
          ediType: "x12",
          release: "00401",
          version: "850",
        });
      },
    });
    const withResolverBeg = withResolver!.getSegments().find((segment) => segment.id === "BEG");

    assert.ok(withoutResolverBeg);
    assert.strictEqual(withoutResolverBeg.ediReleaseSchemaSegment, undefined);

    assert.ok(withResolverBeg);
    assert.ok(withResolverBeg.ediReleaseSchemaSegment);
    assert.deepStrictEqual(requests, [{
      ediType: "x12",
      release: "99999",
      version: "850",
    }]);
  });

  test("should prefer external schema resolver results over built-in schema bundles", async () => {
    const externalBundle = cloneJson(loadBuiltInSchemaBundle({
      ediType: "x12",
      release: "00401",
      version: "850",
    })! as any);
    externalBundle.releaseSchema.Segments.BEG.Desc = "External BEG Description";

    const document = await parseEdi(createX12PurchaseOrderDocument(), {
      schemaResolver: () => externalBundle,
    });
    const begSegment = document!.getSegments().find((segment) => segment.id === "BEG");

    assert.ok(begSegment);
    assert.strictEqual(begSegment.getDesc(), "External BEG Description");
  });

  test("should fall back to the built-in schema when schemaResolver returns undefined", async () => {
    const document = await parseEdi(createX12PurchaseOrderDocument(), {
      schemaResolver: () => undefined,
    });
    const begSegment = document!.getSegments().find((segment) => segment.id === "BEG");

    assert.ok(begSegment);
    assert.ok(begSegment.ediReleaseSchemaSegment);
    assert.notStrictEqual(begSegment.getDesc(), undefined);
  });

  test("should preserve EDIFACT special segment parsing and custom service qualifier validation", async () => {
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
    });
    const document = await parser!.parse();
    const unaSegment = document.separatorsSegment;
    const qualifierErrors = document.getErrors()
      .filter(error => error.code === DiagnosticErrors.QUALIFIER_INVALID_CODE);

    assert.ok(unaSegment);
    assert.strictEqual(unaSegment.id, "UNA");
    assert.strictEqual(unaSegment.elements.length, 5);
    assert.deepStrictEqual(qualifierErrors, []);
  });
});
