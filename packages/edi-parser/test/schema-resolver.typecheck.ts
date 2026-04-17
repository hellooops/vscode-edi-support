import { getBuiltInSchema, loadBuiltInSchemaBundle } from "../src/builtinSchemas";
import type {
  RawReleaseSchema,
  RawVersionSchema,
  SchemaLoadResult,
  SchemaResolver,
} from "../src";

const releaseSchema: RawReleaseSchema = {
  Release: "00401",
  Qualifiers: {},
  Segments: {},
};

const versionSchema: RawVersionSchema = {
  Release: "00401",
  DocumentType: "850",
  Introduction: "Purchase Order",
  name: "Purchase Order",
  TransactionSet: [
    {
      Id: "N1Loop1",
      Max: "unbounded",
      Loop: [
        { Id: "N1", Min: 1, Max: 1 },
      ],
    },
  ],
};

const bundle: SchemaLoadResult = {
  releaseSchema,
  versionSchema,
};

const resolver: SchemaResolver = async () => bundle;
void resolver;

const builtInReleaseSchema = getBuiltInSchema("x12", "00401");
if (builtInReleaseSchema) {
  const typedReleaseSchema: RawReleaseSchema = builtInReleaseSchema;
  void typedReleaseSchema;
}

const builtInBundle = loadBuiltInSchemaBundle({
  ediType: "x12",
  release: "00401",
  version: "850",
});
if (builtInBundle?.versionSchema) {
  const typedVersionSchema: RawVersionSchema = builtInBundle.versionSchema;
  void typedVersionSchema;
}

// @ts-expect-error Release is required on RawReleaseSchema.
const invalidReleaseSchema: RawReleaseSchema = {
  Qualifiers: {},
  Segments: {},
};
void invalidReleaseSchema;

// @ts-expect-error TransactionSet is required on RawVersionSchema.
const invalidVersionSchema: RawVersionSchema = {
  Release: "00401",
};
void invalidVersionSchema;

const invalidBundleReleaseSchema = {
  Segments: {},
};

const invalidBundle: SchemaLoadResult = {
  // @ts-expect-error SchemaLoadResult.releaseSchema must satisfy RawReleaseSchema.
  releaseSchema: invalidBundleReleaseSchema,
};
void invalidBundle;
