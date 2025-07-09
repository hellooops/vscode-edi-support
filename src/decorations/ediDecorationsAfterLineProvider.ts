import * as vscode from "vscode";
import { EdiElement, EdiSegment } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";
import { StringBuilder } from "../utils/utils";
import { EdiDecorationsProviderBase } from "./ediDecorationsProviderBase";

export class EdiDecorationsAfterLineProvider extends EdiDecorationsProviderBase {
  static decorationTypeAfterLine = vscode.window.createTextEditorDecorationType({
    rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
    after: {
      margin: "0 0 0 3em",
      textDecoration: "none",
      color: new vscode.ThemeColor(constants.colors.trailingLineForegroundColor)
    }
  });

  decorationType: vscode.TextEditorDecorationType = EdiDecorationsAfterLineProvider.decorationTypeAfterLine;

  async refreshDecorations(document: vscode.TextDocument, startOffset: number): Promise<void> {
    const enableTrailingAnnotations = !!vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableTrailingAnnotations);
    if (!enableTrailingAnnotations) {
      this.clearDecorations();
      return;
    }

    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) {
      this.clearDecorations();
      return;
    }
    
    const ediDocument = await parser.parse();
    if (!ediDocument) {
      this.clearDecorations();
      return;
    }

    const segments = ediDocument.getSegments(true);
    const { element, segment } = EdiUtils.getSegmentOrElementByPosition(startOffset, segments);
    if (!segment || !EdiUtils.isOnlySegmentInLine(document, segment)) {
      this.clearDecorations();
      return;
    }

    const lineAnnotation = element ? EdiDecorationsAfterLineProvider.getElementAnnotation(element) : EdiDecorationsAfterLineProvider.getSegmentAnnotation(segment);
    const segmentRange = segment.endingDelimiter === "\n" ? EdiUtils.getSegmentRange(document, segment) : EdiUtils.getSegmentRange(document, segment, true);
    this.setDecorations([
      {
        renderOptions: {
          after: {
            contentText: lineAnnotation,
          }
        },
        range: segmentRange
      }
    ]);
  }

  private static getElementAnnotation(element: EdiElement): string {
    const annotation = new StringBuilder();
    annotation.append(element.getDesignatorWithId());
    if (element.ediReleaseSchemaElement?.desc) {
      annotation.append(`: ${element.ediReleaseSchemaElement?.desc}`);
    }

    if (element.ediReleaseSchemaElement?.qualifierRef && element.value) {
      const elementValueCode = element?.ediReleaseSchemaElement?.getCodeByValue(element.value);
      if (elementValueCode) {
        annotation.append(`, ${element.value}: ${elementValueCode.desc}`);
      }
    }

    return annotation.toString();
  }

  private static getSegmentAnnotation(segment: EdiSegment): string {
    return segment.getDesc() ? `${segment.id}: ${segment.getDesc()}` : segment.id;
  }

  registerDecorations(): vscode.Disposable[] {
    return [
      vscode.window.onDidChangeTextEditorSelection(async (e) => {
        const startOffset = e.textEditor.document.offsetAt(e.selections[0].start);
        return await this.refreshDecorations(e.textEditor.document, startOffset);
      })
    ];
  }
}
