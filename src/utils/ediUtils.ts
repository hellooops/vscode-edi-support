import { EdiParserBase } from "../parser/ediParserBase";
import { EdifactParser } from "../parser/edifactParser";
import { EdiElement, EdiFunctionalGroup, EdiInterchange, EdiSegment, EdiTransactionSet, EdiType } from "../parser/entities";
import { X12Parser } from "../parser/x12Parser";
import { VdaParser } from "../parser/vdaParser";
import * as vscode from "vscode";
import * as constants from "../constants";

export class EdiUtils {
  static icons = {
    interchange: new vscode.ThemeIcon(constants.themeIcons.notebookOpenAsText),
    functionalGroup: new vscode.ThemeIcon(constants.themeIcons.openEditorsViewIcon),
    transactionSet: new vscode.ThemeIcon(constants.themeIcons.outputViewIcon),
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
    if (content.startsWith(`${constants.ediDocument.edifact.segment.UNA}${constants.ediDocument.edifact.defaultSeparators.componentElementSeparator}`) || // UNA:
        content.startsWith(`${constants.ediDocument.edifact.segment.UNB}${constants.ediDocument.edifact.defaultSeparators.dataElementSeparator}`) || // UNB*
        content.startsWith(`${constants.ediDocument.edifact.segment.UNH}${constants.ediDocument.edifact.defaultSeparators.dataElementSeparator}`) // UNH*
    ) {
      return true;
    }

    return false;
  }

  static isVda(document: vscode.TextDocument): boolean {
    if (document.languageId === EdiType.VDA) {
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
    if (content.startsWith(`${constants.ediDocument.vda.segment.segment_511}`) ||
        content.startsWith(`${constants.ediDocument.vda.segment.segment_711}`)
    ) {
      return true;
    }

    return false;
  }

  static isDocumentSupported(document: vscode.TextDocument | undefined | null): boolean {
    if (!document) return false;
    return EdiUtils.isX12(document) || EdiUtils.isEdifact(document) || EdiUtils.isVda(document);
  }

  static isLanguageSupported(languageId: string): boolean {
    return languageId === EdiType.X12 || languageId === EdiType.EDIFACT || languageId === EdiType.VDA;
  }

  private static ediParserCache: {
    document?: string;
    result: {
      parser: EdiParserBase | undefined;
      ediType: string,
    };
  } | undefined = undefined;

  static getEdiParser(document: vscode.TextDocument): { parser: EdiParserBase | undefined, ediType: string } {
    const documentContent = document.getText();
    if (!EdiUtils.ediParserCache || documentContent !== EdiUtils.ediParserCache.document) {
      EdiUtils.ediParserCache = {
        document: documentContent,
        result: EdiUtils.getEdiParserInternal(document)
      };
    }

    const ediType = EdiUtils.ediParserCache.result.ediType;
    if (ediType !== EdiType.UNKNOWN && document.languageId !== ediType) {
      vscode.languages.setTextDocumentLanguage(document, ediType);
    }

    return EdiUtils.ediParserCache.result!;
  }

  static getEdiParserInternal(document: vscode.TextDocument): { parser: EdiParserBase | undefined, ediType: string } {
    let ediType: string;
    let parser: EdiParserBase | undefined = undefined;
    const documentContent = document.getText();
    if (EdiUtils.isX12(document)) {
      parser = new X12Parser(documentContent);
      ediType = EdiType.X12;
    } else if (EdiUtils.isEdifact(document)) {
      parser = new EdifactParser(documentContent);
      ediType = EdiType.EDIFACT;
    } else if (EdiUtils.isVda(document)) {
      parser = new VdaParser(documentContent);
      ediType = EdiType.VDA;
    } else {
      ediType = EdiType.UNKNOWN;
    }

    return {
      parser,
      ediType
    };
  }

  static getInterchangeStartPosition(document: vscode.TextDocument, interchange: EdiInterchange): vscode.Position {
    return document.positionAt(interchange.getFirstSegment()!.startIndex);
  }

  static getInterchangeEndPosition(document: vscode.TextDocument, interchange: EdiInterchange): vscode.Position {
    return document.positionAt(interchange.getLastSegment()!.endIndex + 1);
  }

  static getInterchangeRange(document: vscode.TextDocument, interchange: EdiInterchange): vscode.Range {
    return new vscode.Range(
      EdiUtils.getInterchangeStartPosition(document, interchange),
      EdiUtils.getInterchangeEndPosition(document, interchange),
    );
  }

  static getFunctionalGroupStartPosition(document: vscode.TextDocument, functionalGroup: EdiFunctionalGroup): vscode.Position {
    return document.positionAt(functionalGroup.getFirstSegment()!.startIndex);
  }

  static getFunctionalGroupEndPosition(document: vscode.TextDocument, functionalGroup: EdiFunctionalGroup): vscode.Position {
    return document.positionAt(functionalGroup.getLastSegment()!.endIndex + 1);
  }

  static getFunctionalGroupRange(document: vscode.TextDocument, functionalGroup: EdiFunctionalGroup): vscode.Range {
    return new vscode.Range(
      EdiUtils.getFunctionalGroupStartPosition(document, functionalGroup),
      EdiUtils.getFunctionalGroupEndPosition(document, functionalGroup),
    );
  }

  static getTransactionSetStartPosition(document: vscode.TextDocument, transactionSet: EdiTransactionSet): vscode.Position {
    return document.positionAt(transactionSet.getFirstSegment()!.startIndex);
  }

  static getTransactionSetEndPosition(document: vscode.TextDocument, transactionSet: EdiTransactionSet): vscode.Position {
    return document.positionAt(transactionSet.getLastSegment()!.endIndex + 1);
  }

  static getTransactionSetRange(document: vscode.TextDocument, transactionSet: EdiTransactionSet): vscode.Range {
    return new vscode.Range(
      EdiUtils.getTransactionSetStartPosition(document, transactionSet),
      EdiUtils.getTransactionSetEndPosition(document, transactionSet),
    );
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

  static getSegmentIdRange(document: vscode.TextDocument, segment: EdiSegment): vscode.Range {
    return new vscode.Range(
      EdiUtils.getSegmentStartPosition(document, segment),
      EdiUtils.getSegmentStartPosition(document, segment).translate(0, segment.id.length),
    );
  }

  static getSegmentDelimiterRange(document: vscode.TextDocument, segment: EdiSegment): vscode.Range | null {
    if (segment.endingDelimiter === "\r" || segment.endingDelimiter === "\n") {
      return null;
    }

    return new vscode.Range(
      EdiUtils.getSegmentEndPosition(document, segment).translate(0, -1),
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

  static getElementSeparatorRange(document: vscode.TextDocument, segment: EdiSegment, element: EdiElement): vscode.Range {
    return new vscode.Range(
      EdiUtils.getElementStartPosition(document, segment, element),
      EdiUtils.getElementStartPosition(document, segment, element).translate(0, 1),
    );
  }

  static getElementWithoutSeparatorRange(document: vscode.TextDocument, segment: EdiSegment, element: EdiElement): vscode.Range {
    return new vscode.Range(
      EdiUtils.getElementStartPosition(document, segment, element).translate(0, 1),
      EdiUtils.getElementEndPosition(document, segment, element),
    );
  }

  static getSegmentOrElementByPosition(position: number, segments: EdiSegment[]): {segment?: EdiSegment, element?: EdiElement} {
    const active: {segment?: EdiSegment, element?: EdiElement} = {};
    let selectedSegment = segments.find(x => position >= x.startIndex && position <= (x.endIndex + 1));
    if (!selectedSegment) {
      return active;
    }

    if (selectedSegment.isLoop()) {
      const childResult = EdiUtils.getSegmentOrElementByPosition(position, selectedSegment.Loop!);
      if (childResult.segment) {
        return childResult;
      }
    }

    active.segment = selectedSegment;
    if (!selectedSegment.elements || selectedSegment.elements?.length <= 0) {
      return active;
    }

    let selectedElement = selectedSegment.elements.find(x => position >= (selectedSegment!.startIndex + x.startIndex) && position < (selectedSegment!.startIndex + x.endIndex + 1));
    if (!selectedElement) {
      return active;
    }

    active.element = selectedElement;
    
    if (selectedElement?.ediReleaseSchemaElement?.isComposite()) {
      let selectedComponentElement: EdiElement | undefined = undefined;
      selectedComponentElement = selectedElement?.components?.find(x => position >= (selectedSegment!.startIndex + x.startIndex) && position <= (selectedSegment!.startIndex + x.endIndex + 1));
      if (selectedComponentElement) selectedElement = selectedComponentElement;
    }

    if (!selectedElement) {
      return {};
    }

    active.element = selectedElement;
    return active;
  }

  static isOnlySegmentInLine(document: vscode.TextDocument, segment: EdiSegment): boolean {
    if (!segment) return false;
    const segmentStartPosition = EdiUtils.getSegmentStartPosition(document, segment);
    const segmentEndPosition = EdiUtils.getSegmentEndPosition(document, segment);
    if (segmentStartPosition.line !== segmentEndPosition.line) return false;
    const segmentLineNumber = segmentStartPosition.line;
    const documentContentInLine = document.lineAt(segmentLineNumber).text;
    return documentContentInLine.trim() === segment.segmentStr?.trim();
  }
}