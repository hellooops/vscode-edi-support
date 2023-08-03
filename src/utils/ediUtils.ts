import { EdiParserBase } from "../parser/ediParserBase";
import { EdifactParser } from "../parser/edifactParser";
import { EdiElement, EdiSegment, EdiType } from "../parser/entities";
import { X12Parser } from "../parser/x12Parser";
import * as vscode from "vscode";
import * as constants from "../constants";

export class EdiUtils {
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

  static getEdiParser(document: vscode.TextDocument): { parser: EdiParserBase | undefined, ediType: string } {
    let ediType: string;
    let parser: EdiParserBase | undefined = undefined;
    const documentContent = document.getText();
    if (EdiUtils.isX12(document)) {
      parser = new X12Parser(documentContent);
      ediType = EdiType.X12;
    } else if (EdiUtils.isEdifact(document)) {
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
      EdiUtils.getSegmentStartPosition(document, segment),
      EdiUtils.getSegmentEndPosition(document, segment),
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
      EdiUtils.getElementStartPosition(document, segment, element),
      EdiUtils.getElementEndPosition(document, segment, element),
    );
  }
}