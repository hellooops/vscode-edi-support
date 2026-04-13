import * as path from "path";

const packageOrDistRoot = path.resolve(__dirname, "..", "..");
const distRoot = path.basename(packageOrDistRoot) === "dist"
  ? packageOrDistRoot
  : path.join(packageOrDistRoot, "dist");

export const root = require(distRoot);
export const parserEntities = require(path.join(distRoot, "parser", "entities"));
export const x12ParserModule = require(path.join(distRoot, "parser", "x12Parser"));
export const edifactParserModule = require(path.join(distRoot, "parser", "edifactParser"));
export const vdaParserModule = require(path.join(distRoot, "parser", "vdaParser"));
export const segmentScannerModule = require(path.join(distRoot, "parser", "segmentScanner"));
export const schemaVersionSegmentsContextModule = require(path.join(distRoot, "parser", "schemaVersionSegmentsContext"));
export const schemasModule = require(path.join(distRoot, "schemas", "schemas"));
export const configurationsModule = require(path.join(distRoot, "interfaces", "configurations"));
