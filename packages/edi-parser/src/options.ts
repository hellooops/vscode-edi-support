import { type Conf_CustomSchema } from "./interfaces/configurations";

export type EdiTypeValue = "x12" | "edifact" | "vda" | "unknown";

export interface SchemaResolverRequest {
  ediType: EdiTypeValue;
  release: string;
  version?: string;
}

export interface SchemaLoadResult {
  releaseSchema: unknown;
  versionSchema?: unknown;
}

export type SchemaResolver =
  (request: SchemaResolverRequest) =>
    Promise<SchemaLoadResult | undefined> | SchemaLoadResult | undefined;

export interface ParserOptions {
  customSchemas?: Conf_CustomSchema;
  qualifierOverrides?: Conf_CustomSchema;
  schemaResolver?: SchemaResolver;
}

export type ParseOptions = ParserOptions;
export type { EdiErrorOptions, EdiValidationOptions } from "./parser/entities";
