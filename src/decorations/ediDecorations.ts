import * as vscode from "vscode";
import { EdiElement, EdiSegment } from "../parser/entities";
import { IDecorationable } from "../interfaces/decorationable";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";
import { StringBuilder } from "../utils/utils";

export class EdiDecorationsMgr implements IDecorationable {
  static decorationType = vscode.window.createTextEditorDecorationType({
    rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
    after: {
      margin: "0 0 0 3em",
      textDecoration: "none",
      color: new vscode.ThemeColor(constants.colors.trailingLineForegroundColor)
    }
  });

  dispose(): void {
    vscode.window.activeTextEditor!.setDecorations(EdiDecorationsMgr.decorationType, []);
  }

  async refreshDecorations(document: vscode.TextDocument, startOffset: number): Promise<vscode.Disposable | undefined> {
    const enableTrailingAnnotations = !!vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableTrailingAnnotations);
    if (!enableTrailingAnnotations) {
      this.clearDecorations();
      return;
    }

    const { parser, ediType } = EdiUtils.getEdiParser(document);
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

    const lineAnnotation = element ? EdiDecorationsMgr.getElementAnnotation(element) : EdiDecorationsMgr.getSegmentAnnotation(segment);
    this.setDecorations([
      {
        renderOptions: {
          after: {
            contentText: lineAnnotation,
          }
        },
        range: EdiUtils.getSegmentRange(document, segment)
      }
    ]);

    return this;
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
    return segment.getDesc() ?? segment.id;
  }

  private clearDecorations() {
    this.setDecorations([]);
  }

  private setDecorations(decorations: vscode.DecorationOptions[]) {
    vscode.window.activeTextEditor!.setDecorations(EdiDecorationsMgr.decorationType, decorations);
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
