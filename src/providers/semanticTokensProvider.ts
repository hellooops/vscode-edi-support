import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiSegment, EdiElement, EdiType, EdiMessageSeparators } from '../parser/entities';
import { EdiUtils } from "../utils/ediUtils";

const TokenTypes = {
  EdiSegmentId: "edisupportsegmentid",
  EdiSegmentSeparator: "edisupportseparator",
  EdiDataElementSeparator: "edisupportseparator",
  EdiComponentElementSeparator: "edisupportseparator",
  EdiValueTypeNumber: "edisupportvaluetypenumber",
  EdiValueTypeDatetime: "edisupportvaluetypedatetime",
  EdiValueTypeQualifer: "edisupportvaluetypequalifer",
  EdiValueTypeOther: "edisupportvaluetypeother",
}

const legend = new vscode.SemanticTokensLegend(Object.values(TokenTypes));

export class SemanticTokensProvider implements vscode.DocumentSemanticTokensProvider, IProvidable {
  onDidChangeSemanticTokens?: vscode.Event<void> | undefined;
  async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens | undefined> {
    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) return;
    const ediDocument = await parser.parse();
    const segments = ediDocument.getSegments(true);
    if (!segments || segments.length <= 0) {
      return;
    }

    const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
    for (const segment of segments) {
      this.buildSegmentSemanticTokens(document, tokensBuilder, segment, ediDocument.separators);
    }

    return tokensBuilder.build();
  }
  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerDocumentSemanticTokensProvider({ language: EdiType.X12 }, this, legend),
      vscode.languages.registerDocumentSemanticTokensProvider({ language: EdiType.EDIFACT }, this, legend),
    ];
  }

  private buildSegmentSemanticTokens(document: vscode.TextDocument, builder: vscode.SemanticTokensBuilder, segment: EdiSegment, separators: EdiMessageSeparators) {
    builder.push(
      EdiUtils.getSegmentIdRange(document, segment),
      TokenTypes.EdiSegmentId,
    );

    const segmentDelimiterRange = EdiUtils.getSegmentDelimiterRange(document, segment);
    if (segmentDelimiterRange) {
      builder.push(
        segmentDelimiterRange,
        TokenTypes.EdiSegmentSeparator,
      );
    }

    for (const ele of segment.elements) {
      this.buildElementSemanticTokens(document, builder, segment, ele, separators);
    }
  }

  private buildElementSemanticTokens(document: vscode.TextDocument, builder: vscode.SemanticTokensBuilder, segment: EdiSegment, element: EdiElement, separators: EdiMessageSeparators) {
    const elementSeparator = element.separator;
    const isDataElementSeparator = elementSeparator === separators.dataElementSeparator;

    if (element.isComposite()) {
      for (const componentElement of element.components!) {
        this.buildElementSemanticTokens(document, builder, segment, componentElement, separators);
      }
    } else {
      if (element.separator) {
        builder.push(
          EdiUtils.getElementSeparatorRange(document, segment, element),
          isDataElementSeparator ? TokenTypes.EdiDataElementSeparator : TokenTypes.EdiComponentElementSeparator,
        );
      }

      if (element.value) {
        let tokenType: string;
        if (element?.ediReleaseSchemaElement?.qualifierRef) {
          tokenType = TokenTypes.EdiValueTypeQualifer;
        } else if (element?.ediReleaseSchemaElement?.dataType === "N" || element?.ediReleaseSchemaElement?.dataType === "R" ) {
          tokenType = TokenTypes.EdiValueTypeNumber;
        } else if (element?.ediReleaseSchemaElement?.dataType === "DT") {
          tokenType = TokenTypes.EdiValueTypeDatetime;
        } else {
          tokenType = TokenTypes.EdiValueTypeOther;
        }
        const elementValueRange = element.separator ? EdiUtils.getElementWithoutSeparatorRange(document, segment, element) : EdiUtils.getElementRange(document, segment, element);
        builder.push(
          elementValueRange,
          tokenType,
        );
      }
    }
  }
}
