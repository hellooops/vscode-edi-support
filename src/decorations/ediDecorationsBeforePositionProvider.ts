import * as vscode from "vscode";
import { EdiDocument, EdiType } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";
import { EdiDecorationsProviderBase } from "./ediDecorationsProviderBase";

export class EdiDecorationsBeforePositionProvider extends EdiDecorationsProviderBase {
  static decorationTypeBeforePosition = vscode.window.createTextEditorDecorationType({
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    overviewRulerLane: vscode.OverviewRulerLane.Left,
    before: {
      margin: "0 1px 0 6px",
      textDecoration: "none",
      color: new vscode.ThemeColor(constants.colors.trailingLineForegroundColor)
    }
  });

  decorationType: vscode.TextEditorDecorationType = EdiDecorationsBeforePositionProvider.decorationTypeBeforePosition;

  async refreshDecorations(document: vscode.TextDocument | undefined, startOffset: number): Promise<void> {
    if (!document) {
      this.clearDecorations();
      return;
    }

    const { parser, ediType } = EdiUtils.getEdiParser(document);
    if (ediType !== EdiType.VDA) return;
    if (!parser) {
      this.clearDecorations();
      return;
    }
    
    const ediDocument = await parser.parse();
    if (!ediDocument) {
      this.clearDecorations();
      return;
    }

    this.setDecorations(this.getElementIndexDecorations(ediType, document, ediDocument));
  }

  private getElementIndexDecorations(ediType: EdiType, document: vscode.TextDocument, ediDocument: EdiDocument): vscode.DecorationOptions[] {
    const decorations: vscode.DecorationOptions[] = [];
    const segments = ediDocument.getSegments();
    segments.forEach(segment => {
      segment.elements.forEach(ele => {
        decorations.push({
          renderOptions: {
            before: {
              contentText: ele.designatorIndex,
            }
          },
          range: EdiUtils.getElementRange(document, segment, ele)
        });
      });
    });
    return decorations;
  }

  registerDecorations(): vscode.Disposable[] {
    this.refreshDecorations(vscode.window.activeTextEditor?.document, 0);
    return [
      vscode.window.onDidChangeTextEditorSelection(async (e) => {
        const startOffset = e.textEditor.document.offsetAt(e.selections[0].start);
        return await this.refreshDecorations(e.textEditor.document, startOffset);
      })
    ];
  }
}
