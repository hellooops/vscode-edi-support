import MessageInfo from "../interfaces/messageInfo";
import { EdiParserBase } from "../parser/ediParserBase";
import { EdifactParser } from "../parser/edifactParser";
import { EdiElement, EdiSegment, EdiType } from "../parser/entities";
import { X12Parser } from "../parser/x12Parser";
import { d96a_message_infos } from "../schemas/edifact_d96a_meta";
import * as vscode from "vscode";

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
}

export class SchemaViewerUtils {
  static getSegmentUrl(release: Nullable<string>, segment: Nullable<string>): string {
    if (!release || !segment) {
      return this.getIndexUrl();
    }

    return `https://www.kasoftware.com/schema/edi/edifact/${release}/segments/${segment}/`;
  }

  static getElementUrl(release: Nullable<string>, segment: Nullable<string>, element: Nullable<string>): string {
    if (!release || !segment || !element) {
      return this.getIndexUrl();
    }
    
    return `https://www.kasoftware.com/schema/edi/edifact/${release}/elements/${segment}/${element}/`;
  }

  static getIndexUrl(): string {
    return "https://www.kasoftware.com/schema/";
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
  static isX12(document: vscode.TextDocument): boolean {
    if (!document) {
      return false;
    }

    if (document.languageId === "x12") {
      return true;
    }

    let content = document.getText();
    if (!content) {
      return false;
    }

    content = content.trim();
    if (content.startsWith("ISA") || content.startsWith("GS") || content.startsWith("ST")) {
      return true;
    }

    return false;
  }

  static isEdifact(document: vscode.TextDocument): boolean {
    if (!document) {
      return false;
    }

    if (document.languageId === "edifact") {
      return true;
    }

    let content = document.getText();
    if (!content) {
      return false;
    }

    content = content.trim();
    if (content.startsWith("UNA") || content.startsWith("UNB") || content.startsWith("UNH")) {
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

    return {
      parser,
      ediType
    };
  }

  static getElementRange(document: vscode.TextDocument, segment: EdiSegment, element: EdiElement): vscode.Range {
    return new vscode.Range(
      document.positionAt(segment.startIndex + element.startIndex),
      document.positionAt(segment.startIndex + element.endIndex + 1),
    );
  }
}
