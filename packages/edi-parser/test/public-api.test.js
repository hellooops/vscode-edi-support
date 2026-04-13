const assert = require("assert");

const {
  createParser,
  detectEdiType,
  DiagnosticErrors,
  EdifactParser,
  EdiType,
  getBuiltInSchema,
  loadBuiltInSchemaBundle,
  parseEdi,
  VdaParser,
  X12Parser,
} = require("../dist");

suite("edi-parser public api", () => {
  test("should detect x12, edifact, vda and unknown texts", () => {
    assert.strictEqual(detectEdiType(createX12Document()), "x12");
    assert.strictEqual(detectEdiType(createEdifactDocument()), "edifact");
    assert.strictEqual(detectEdiType(createVdaDocument()), "vda");
    assert.strictEqual(detectEdiType("NOT_AN_EDI_DOCUMENT"), "unknown");
  });

  test("should create parser instances by edi type", () => {
    assert.ok(createParser(createX12Document()) instanceof X12Parser);
    assert.ok(createParser(createEdifactDocument()) instanceof EdifactParser);
    assert.ok(createParser(createVdaDocument()) instanceof VdaParser);
    assert.strictEqual(createParser("NOT_AN_EDI_DOCUMENT"), undefined);
  });

  test("should parse x12, edifact and vda documents through parseEdi", async () => {
    const x12Document = await parseEdi(createX12Document());
    const edifactDocument = await parseEdi(createEdifactDocument());
    const vdaDocument = await parseEdi(createVdaDocument());

    assert.ok(x12Document);
    assert.strictEqual(x12Document.interchanges.length, 1);
    assert.strictEqual(x12Document.interchanges[0].functionalGroups[0].transactionSets[0].meta.release, "00401");
    assert.strictEqual(x12Document.getSegments().map(segment => segment.id).includes("DTM"), true);

    assert.ok(edifactDocument);
    assert.strictEqual(edifactDocument.separatorsSegment?.id, "UNA");
    assert.strictEqual(edifactDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "ORDERS");

    assert.ok(vdaDocument);
    assert.strictEqual(vdaDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.release, "02");
    assert.strictEqual(vdaDocument.interchanges[0].functionalGroups[0].transactionSets[0].meta.version, "511");
  });

  test("should load built-in schema resources from the distributed package", () => {
    const x12ReleaseSchema = getBuiltInSchema("x12", "00401");
    const x12Bundle = loadBuiltInSchemaBundle({
      ediType: "x12",
      release: "00401",
      version: "850",
    });
    const edifactBundle = loadBuiltInSchemaBundle({
      ediType: "edifact",
      release: "D96A",
      version: "ORDERS",
    });

    assert.strictEqual(x12ReleaseSchema.Release, "00401");
    assert.ok(x12Bundle);
    assert.strictEqual(x12Bundle.releaseSchema.Release, "00401");
    assert.ok(x12Bundle.versionSchema.TransactionSet);
    assert.ok(edifactBundle);
    assert.strictEqual(edifactBundle.releaseSchema.Release, "D96A");
    assert.ok(edifactBundle.versionSchema.TransactionSet);
  });

  test("should honor parser-level custom schema qualifier overrides", async () => {
    const document = await parseEdi(createX12DocumentWithCustomQualifier(), {
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

    const qualifierErrors = document.getErrors({
      ediType: EdiType.X12,
      standardOptions: document.standardOptions,
    }).filter(error => error.code === DiagnosticErrors.QUALIFIER_INVALID_CODE);

    assert.deepStrictEqual(qualifierErrors, []);
  });

  test("should allow external schema resolvers to supply missing releases", async () => {
    const requests = [];
    const withoutResolver = await parseEdi(createUnsupportedReleaseX12Document());
    const withoutResolverBeg = withoutResolver.getSegments().find(segment => segment.id === "BEG");

    const withResolver = await parseEdi(createUnsupportedReleaseX12Document(), {
      schemaResolver: request => {
        requests.push(request);
        return loadBuiltInSchemaBundle({
          ediType: "x12",
          release: "00401",
          version: "850",
        });
      },
    });
    const withResolverBeg = withResolver.getSegments().find(segment => segment.id === "BEG");

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

  test("should preserve EDIFACT special segment parsing and custom service qualifier validation", async () => {
    const parser = createParser(createEdifactDocumentWithServiceQualifier(), {
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
    const document = await parser.parse();
    const unaSegment = document.separatorsSegment;
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
    }).filter(error => error.code === DiagnosticErrors.QUALIFIER_INVALID_CODE);

    assert.ok(unaSegment);
    assert.strictEqual(unaSegment.id, "UNA");
    assert.strictEqual(unaSegment.elements.length, 5);
    assert.deepStrictEqual(qualifierErrors, []);
  });
});

function createX12Document() {
  return [
    "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~",
    "GS*PO*SENDER*RECEIVER*20241111*0300*1*X*004010~",
    "ST*850*0001~",
    "DTM*097*20150708~",
    "SE*3*0001~",
    "GE*1*1~",
    "IEA*1*000000001~",
  ].join("\n");
}

function createX12DocumentWithCustomQualifier() {
  return [
    "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~",
    "GS*PO*SENDER*RECEIVER*20241111*0300*1*X*004010~",
    "ST*850*0001~",
    "DTM*ZZ*20150708~",
    "SE*3*0001~",
    "GE*1*1~",
    "IEA*1*000000001~",
  ].join("\n");
}

function createUnsupportedReleaseX12Document() {
  return [
    "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*99999*000000001*0*T*:~",
    "GS*PO*SENDER*RECEIVER*20241111*0300*1*X*999990~",
    "ST*850*0001~",
    "BEG*00*DS*PO1**20150708~",
    "SE*3*0001~",
    "GE*1*1~",
    "IEA*1*000000001~",
  ].join("\n");
}

function createEdifactDocument() {
  return [
    "UNA:+.?*'",
    "UNB+UNOA:2+SENDER:14+RECEIVER:14+140407:0910+0001'",
    "UNH+001+ORDERS:D:96A:UN'",
    "BGM+220+PO1+9'",
    "UNT+3+001'",
    "UNZ+1+0001'",
  ].join("\n");
}

function createEdifactDocumentWithServiceQualifier() {
  return [
    "UNA:+.?*'",
    "UNB+UNOA:2+JLR:ZZ+TEST:ZZ+030325:0725+242++DELFOR'",
    "UNH+1+DELFOR:D:97A:UN'",
    "BGM+241+20020102084517+5'",
    "DTM+51:230101:101'",
    "UNT+4+1'",
    "UNZ+1+242'",
  ].join("\n");
}

function createVdaDocument() {
  return "51102                  9999900001250124111231                                                                                   \n";
}
