import * as assert from "assert";

import { root, schemasModule } from "./helpers/runtime";

const { getBuiltInSchema, loadBuiltInSchemaBundle } = root as typeof import("../dist");
const {
  EdiReleaseSchema,
  EdiReleaseSchemaSegment,
  EdiSchema,
  EdiVersionSchema,
  EdiVersionSegment,
  getMessageInfo,
} = schemasModule as typeof import("../dist/schemas/schemas");

suite("edi-parser schemas", () => {
  test("should return safe empty or fallback values when segments or qualifier codes are missing", () => {
    const rawSchema = getBuiltInSchema("x12", "00401") as any;
    const releaseSchema = new EdiReleaseSchema(rawSchema);
    const begSegment = releaseSchema.getSegment("BEG")!;
    const nonQualifiedElement = begSegment.elements.find((element) => !element.qualifierRef)!;
    const b1Segment = releaseSchema.getSegment("B1")!;
    const actionElement = b1Segment.elements.find((element) => element.qualifierRef === "Reservation Action Code")!;

    assert.strictEqual(releaseSchema.getSegment("ZZZ"), undefined);
    assert.strictEqual(nonQualifiedElement.getCodes(), null);
    assert.strictEqual(nonQualifiedElement.getCodeOrNullByValue("00"), null);
    assert.strictEqual(nonQualifiedElement.getQualifierDesc("00"), null);
    assert.ok(nonQualifiedElement.getCodeByValue("00").desc.includes("No codes found"));

    assert.strictEqual(actionElement.getCodeOrNullByValue("ZZ"), null);
    assert.strictEqual(actionElement.getQualifierDesc("ZZ"), null);
    assert.ok(actionElement.getCodeByValue("ZZ").desc.includes("No code found"));
  });

  test("should resolve qualifier codes from release schema and keep clones isolated", () => {
    const rawSchema = getBuiltInSchema("x12", "00401") as any;
    const releaseSchema = new EdiReleaseSchema(rawSchema);
    const b1Segment = releaseSchema.getSegment("B1")!;
    const actionElement = b1Segment.elements.find((element) => element.qualifierRef === "Reservation Action Code")!;
    const firstCode = actionElement.getCodes()![0];
    const clonedSchema = releaseSchema.clone();
    const clonedActionElement = clonedSchema.getSegment("B1")!
      .elements.find((element) => element.qualifierRef === "Reservation Action Code")!;

    clonedSchema.addQualifier("Reservation Action Code", "ZZ", "Custom reservation action");

    assert.strictEqual(actionElement.getCodeOrNullByValue(firstCode.value)!.desc, firstCode.desc);
    assert.strictEqual(actionElement.getCodeOrNullByValue("ZZ"), null);
    assert.strictEqual(clonedActionElement.getCodeOrNullByValue("ZZ")!.desc, "Custom reservation action");
  });

  test("should expose composite elements, qualifier descriptions and independent segment clones", () => {
    const rawSchema = getBuiltInSchema("edifact", "D96A") as any;
    const releaseSchema = new EdiReleaseSchema(rawSchema);
    const adrSegment = releaseSchema.getSegment("ADR")!;
    const compositeElement = adrSegment.elements[0];
    const codedComponent = compositeElement.components[0];
    const firstCode = codedComponent.getCodes()![0];
    const clonedUnb = EdiReleaseSchemaSegment.UNB.clone();

    clonedUnb.elements[0].components[0].minLength = 99;

    assert.strictEqual(compositeElement.isComposite(), true);
    assert.strictEqual(codedComponent.getCodeOrNullByValue(firstCode.value)!.desc, firstCode.desc);
    assert.strictEqual(codedComponent.getQualifierDesc(firstCode.value), firstCode.desc);
    assert.ok(codedComponent.getCodeByValue("UNKNOWN").desc.includes("No code found"));
    assert.notStrictEqual(EdiReleaseSchemaSegment.UNB.elements[0].components[0].minLength, 99);
  });

  test("should build version schema wrappers and resolve message info", () => {
    const bundle = loadBuiltInSchemaBundle({
      ediType: "x12",
      release: "00401",
      version: "850",
    }) as any;
    const ediSchema = new EdiSchema(bundle.releaseSchema, bundle.versionSchema);
    const versionSchema = new EdiVersionSchema(bundle.versionSchema);

    assert.strictEqual(ediSchema.ediReleaseSchema.release, "00401");
    assert.strictEqual(versionSchema.Release, "00401");
    assert.strictEqual(versionSchema.DocumentType, "850");
    assert.ok(versionSchema.TransactionSet.length > 0);
    assert.strictEqual(getMessageInfo("850")!.version, "850");
    assert.strictEqual(getMessageInfo("ORDERS")!.version, "ORDERS");
    assert.strictEqual(getMessageInfo("UNKNOWN"), undefined);
  });

  test("should support release-only schemas and normalize version segment max values", () => {
    const bundle = loadBuiltInSchemaBundle({
      ediType: "x12",
      release: "00401",
    }) as any;
    const releaseOnlySchema = new EdiSchema(bundle.releaseSchema, undefined);
    const implicitMax = new EdiVersionSegment({ Id: "REF" });
    const fixedMax = new EdiVersionSegment({ Id: "DTM", Max: 2 });
    const unboundedMax = new EdiVersionSegment({ Id: "N1", Max: "unbounded" });

    assert.strictEqual(releaseOnlySchema.ediReleaseSchema.release, "00401");
    assert.strictEqual(releaseOnlySchema.ediVersionSchema, undefined);
    assert.strictEqual(implicitMax.getMax(), 1);
    assert.strictEqual(fixedMax.getMax(), 2);
    assert.strictEqual(unboundedMax.getMax(), 99999);
  });

});
