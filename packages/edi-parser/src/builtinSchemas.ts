import * as fs from "fs";
import * as path from "path";

function readJsonFile(filePath: string): unknown | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function getBuiltInSchema(ediType: "x12" | "edifact" | "vda" | "unknown", release: string): unknown | undefined {
  if (ediType === "unknown") {
    return undefined;
  }

  return readJsonFile(path.resolve(__dirname, "schemas", ediType, release, `${release}.json`));
}

export function loadBuiltInSchemaBundle(request: {
  ediType: "x12" | "edifact" | "vda" | "unknown";
  release: string;
  version?: string;
}): { releaseSchema: unknown; versionSchema?: unknown } | undefined {
  if (request.ediType === "unknown") {
    return undefined;
  }

  const schemaDirectory = path.resolve(__dirname, "schemas", request.ediType, request.release);
  const releaseSchema = readJsonFile(path.join(schemaDirectory, `${request.release}.json`));
  if (!releaseSchema) {
    return undefined;
  }

  if (!request.version) {
    return {
      releaseSchema
    };
  }

  const versionIndex = readJsonFile(path.join(schemaDirectory, `${request.release}_versions.json`)) as {
    DocumentTypes?: Record<string, unknown>;
  } | undefined;
  const versionKey = `${request.release}_${request.version}`;
  const versionSchema = versionIndex?.DocumentTypes?.[versionKey];
  if (!versionSchema) {
    return undefined;
  }

  return {
    releaseSchema,
    versionSchema
  };
}
