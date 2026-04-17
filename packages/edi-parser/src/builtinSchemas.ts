import * as fs from "fs";
import * as path from "path";
import type { SchemaLoadResult, SchemaResolverRequest } from "./options";
import type { RawReleaseSchema, RawVersionSchema, RawVersionSchemaIndex } from "./schemas/rawTypes";

function readJsonFile<T>(filePath: string): T | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function getBuiltInSchema(ediType: "x12" | "edifact" | "vda" | "unknown", release: string): RawReleaseSchema | undefined {
  if (ediType === "unknown") {
    return undefined;
  }

  return readJsonFile<RawReleaseSchema>(path.resolve(__dirname, "schemas", ediType, release, `${release}.json`));
}

export function loadBuiltInSchemaBundle(request: SchemaResolverRequest): SchemaLoadResult | undefined {
  if (request.ediType === "unknown") {
    return undefined;
  }

  const schemaDirectory = path.resolve(__dirname, "schemas", request.ediType, request.release);
  const releaseSchema = readJsonFile<RawReleaseSchema>(path.join(schemaDirectory, `${request.release}.json`));
  if (!releaseSchema) {
    return undefined;
  }

  if (!request.version) {
    return {
      releaseSchema
    };
  }

  const versionIndex = readJsonFile<RawVersionSchemaIndex>(path.join(schemaDirectory, `${request.release}_versions.json`));
  const versionKey = `${request.release}_${request.version}`;
  const versionSchema: RawVersionSchema | undefined = versionIndex?.DocumentTypes?.[versionKey];
  if (!versionSchema) {
    return undefined;
  }

  return {
    releaseSchema,
    versionSchema
  };
}
