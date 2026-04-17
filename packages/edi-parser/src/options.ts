import { type Conf_CustomSchema } from "./interfaces/configurations";
import type { RawReleaseSchema, RawVersionSchema } from "./schemas/rawTypes";

export type EdiTypeValue = "x12" | "edifact" | "vda" | "unknown";

export interface SchemaResolverRequest {
  ediType: EdiTypeValue;
  release: string;
  version?: string;
}

export interface SchemaLoadResult {
  releaseSchema: RawReleaseSchema;
  versionSchema?: RawVersionSchema;
}

export type SchemaResolver =
  (request: SchemaResolverRequest) =>
    Promise<SchemaLoadResult | undefined> | SchemaLoadResult | undefined;

export interface ParserOptions {
  customSchemas?: Conf_CustomSchema;
  schemaResolver?: SchemaResolver;
}

export type { EdiErrorOptions, EdiValidationOptions } from "./parser/entities";
