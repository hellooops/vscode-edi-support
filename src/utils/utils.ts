import MessageInfo from "../interfaces/messageInfo";
import { EdiParserBase } from "../parser/ediParserBase";
import { EdifactParser } from "../parser/edifactParser";
import { EdiElement, EdiSegment, EdiType } from "../parser/entities";
import { X12Parser } from "../parser/x12Parser";
import { d96a_message_infos } from "../schemas/edifact_d96a_meta";
import * as vscode from "vscode";
import * as constants from "../constants";

export type Nullable<T> = T | null | undefined;

export default class Utils {
  static isNullOrUndefined(o: any): boolean {
    return o === null || o === undefined;
  }

  static yyMMddFormat(date: string): string {
    // 140407 -> 14-04-07
    if (!date || date.length !== 6) {
      return date;
    }
    return `${date.substring(0, 2)}-${date.substring(2, 4)}-${date.substring(4, 6)}`;
  }

  static HHmmFormat(time: string): string {
    // 0910 -> 09:10
    // 091035 -> 09:10:35
    if (!time || time.length < 4) {
      return time;
    }
    if (time.length === 4) {
      return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
    }
    return `${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}`;
  }

  static getMessageInfoByDocumentType(documentType: string): MessageInfo | null {
    return d96a_message_infos.find(m => m.documentType === documentType) || null;
  }

  static toString(value: Nullable<any>): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    return value.toString();
  }
}

export class SchemaViewerUtils {
  static getSegmentUrl(ediType: EdiType, release: Nullable<string>, segment: Nullable<string>): string {
    if (!release || !segment) {
      return this.getIndexUrl();
    }

    return `https://www.kasoftware.com/schema/edi/${ediType}/${release}/segments/${segment}/`;
  }

  static getElementUrl(ediType: EdiType, release: Nullable<string>, segment: Nullable<string>, element: Nullable<string>): string {
    if (!release || !segment || !element) {
      return this.getIndexUrl();
    }
    
    return `https://www.kasoftware.com/schema/edi/${ediType}/${release}/elements/${segment}/${element}/`;
  }

  static getIndexUrl(): string {
    return constants.common.kasoftware.schemaViewer.url;
  }
}

export class StringBuilder {
  private buffer: string[];

  constructor() {
    this.buffer = [];
  }

  public append(value: string): StringBuilder {
    this.buffer.push(value);
    return this;
  }

  public toString(): string {
    return this.buffer.join("");
  }
}

export class VscodeUtils {
  static icons = {
    segment: new vscode.ThemeIcon(constants.themeIcons.symbolParameter),
    element: new vscode.ThemeIcon(constants.themeIcons.recordSmall),
    elementAttribute: new vscode.ThemeIcon(constants.themeIcons.mention),
  };

  static isX12(document: vscode.TextDocument): boolean {
    if (document.languageId === EdiType.X12) {
      return true;
    }

    if (!document) {
      return false;
    }

    let content = document.getText();
    if (!content) {
      return false;
    }

    content = content.trim();
    if (content.startsWith(`${constants.ediDocument.x12.segment.ISA}${constants.ediDocument.x12.defaultSeparators.dataElementSeparator}`) || // ISA*
        content.startsWith(`${constants.ediDocument.x12.segment.GS}${constants.ediDocument.x12.defaultSeparators.dataElementSeparator}`) || // GS*
        content.startsWith(`${constants.ediDocument.x12.segment.ST}${constants.ediDocument.x12.defaultSeparators.dataElementSeparator}`) // ST*
    ) {
      return true;
    }

    return false;
  }

  static isEdifact(document: vscode.TextDocument): boolean {
    if (document.languageId === EdiType.EDIFACT) {
      return true;
    }

    if (!document) {
      return false;
    }

    let content = document.getText();
    if (!content) {
      return false;
    }

    content = content.trim();
    if (content.startsWith(`${constants.ediDocument.edifact.segment.UNA}${constants.ediDocument.edifact.defaultSeparators.dataElementSeparator}`) || // UNA*
        content.startsWith(`${constants.ediDocument.edifact.segment.UNB}${constants.ediDocument.edifact.defaultSeparators.dataElementSeparator}`) || // UNB*
        content.startsWith(`${constants.ediDocument.edifact.segment.UNH}${constants.ediDocument.edifact.defaultSeparators.dataElementSeparator}`) // UNH*
    ) {
      return true;
    }

    return false;
  }

  static getEdiParser(document: vscode.TextDocument): { parser: EdiParserBase, ediType: string } {
    let ediType: string;
    let parser: EdiParserBase;
    const documentContent = document.getText();
    if (VscodeUtils.isX12(document)) {
      parser = new X12Parser(documentContent);
      ediType = EdiType.X12;
    } else if (VscodeUtils.isEdifact(document)) {
      parser = new EdifactParser(documentContent);
      ediType = EdiType.EDIFACT;
    } else {
      ediType = EdiType.UNKNOWN;
    }

    if (ediType !== EdiType.UNKNOWN && document.languageId !== ediType) {
      vscode.languages.setTextDocumentLanguage(document, ediType);
    }

    return {
      parser,
      ediType
    };
  }

  static getSegmentStartPosition(document: vscode.TextDocument, segment: EdiSegment): vscode.Position {
    return document.positionAt(segment.startIndex);
  }

  static getSegmentEndPosition(document: vscode.TextDocument, segment: EdiSegment): vscode.Position {
    return document.positionAt(segment.endIndex + 1);
  }

  static getSegmentRange(document: vscode.TextDocument, segment: EdiSegment): vscode.Range {
    return new vscode.Range(
      VscodeUtils.getSegmentStartPosition(document, segment),
      VscodeUtils.getSegmentEndPosition(document, segment),
    );
  }

  static getElementStartPosition(document: vscode.TextDocument, segment: EdiSegment, element: EdiElement): vscode.Position {
    return document.positionAt(segment.startIndex + element.startIndex);
  }

  static getElementEndPosition(document: vscode.TextDocument, segment: EdiSegment, element: EdiElement): vscode.Position {
    return document.positionAt(segment.startIndex + element.endIndex + 1);
  }

  static getElementRange(document: vscode.TextDocument, segment: EdiSegment, element: EdiElement): vscode.Range {
    return new vscode.Range(
      VscodeUtils.getElementStartPosition(document, segment, element),
      VscodeUtils.getElementEndPosition(document, segment, element),
    );
  }
}
