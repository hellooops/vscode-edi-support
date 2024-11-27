import * as vscode from "vscode";
import { EdiType, type DiagnoscticsContext, type DiagnosticError, DiagnosticErrorSeverity } from "../parser/entities";
import { IDecorationable } from "../interfaces/decorationable";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

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
    if (!segment) {
      this.clearDecorations();
      return;
    }

    let lineAnnotation: string | undefined;
    if (element) {
      lineAnnotation = element.getDesignatorWithId();
      if (element.ediReleaseSchemaElement?.desc) lineAnnotation += `: ${element.ediReleaseSchemaElement?.desc}`;
    } else {
      lineAnnotation = segment.getDesc() ?? segment.id;
    }

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
