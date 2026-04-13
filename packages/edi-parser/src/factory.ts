import * as constants from "./constants";
import { type ParseOptions, type ParserOptions, type EdiTypeValue } from "./options";
import { EdiParserBase } from "./parser/ediParserBase";
import { type EdiDocument } from "./parser/entities";
import { EdifactParser } from "./parser/edifactParser";
import { VdaParser } from "./parser/vdaParser";
import { X12Parser } from "./parser/x12Parser";

function normalizeText(text: string): string {
  return text.trim();
}

export function isX12(text: string): boolean {
  const content = normalizeText(text);
  if (!content) {
    return false;
  }

  return content.startsWith(constants.ediDocument.x12.segment.ISA);
}

export function isEdifact(text: string): boolean {
  const content = normalizeText(text);
  if (!content) {
    return false;
  }

  return content.startsWith(`${constants.ediDocument.edifact.segment.UNA}${constants.ediDocument.edifact.defaultSeparators.componentElementSeparator}`) ||
    content.startsWith(`${constants.ediDocument.edifact.segment.UNB}${constants.ediDocument.edifact.defaultSeparators.dataElementSeparator}`) ||
    content.startsWith(`${constants.ediDocument.edifact.segment.UNH}${constants.ediDocument.edifact.defaultSeparators.dataElementSeparator}`);
}

export function isVda(text: string): boolean {
  const content = normalizeText(text);
  if (!content) {
    return false;
  }

  return content.startsWith(constants.ediDocument.vda.segment.segment_511) ||
    content.startsWith(constants.ediDocument.vda.segment.segment_711);
}

export function detectEdiType(text: string): EdiTypeValue {
  if (isX12(text)) {
    return "x12";
  }

  if (isEdifact(text)) {
    return "edifact";
  }

  if (isVda(text)) {
    return "vda";
  }

  return "unknown";
}

export function createParser(text: string, options: ParserOptions = {}): EdiParserBase | undefined {
  switch (detectEdiType(text)) {
    case "x12":
      return new X12Parser(text, options);
    case "edifact":
      return new EdifactParser(text, options);
    case "vda":
      return new VdaParser(text, options);
    default:
      return undefined;
  }
}

export async function parseEdi(text: string, options: ParseOptions = {}): Promise<EdiDocument | undefined> {
  const parser = createParser(text, options);
  return await parser?.parse();
}
