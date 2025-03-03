import * as vscode from "vscode";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";
import { EdiDecorationsProviderBase } from "./ediDecorationsProviderBase";

export class EdiDecorationsBeforeLineProvider extends EdiDecorationsProviderBase {
  static decorationTypeBeforeLine = vscode.window.createTextEditorDecorationType({
    rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
    before: {
      textDecoration: "none",
      color: new vscode.ThemeColor(constants.colors.trailingLineForegroundColor)
    }
  });

  decorationType: vscode.TextEditorDecorationType = EdiDecorationsBeforeLineProvider.decorationTypeBeforeLine;

  async refreshDecorations(document: vscode.TextDocument, startOffset: number): Promise<void> {
    const indentSegmentsInLoop = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.formatting.indentSegmentsInLoop);
    if (!indentSegmentsInLoop) {
      this.clearDecorations();
      return;
    }

    const { parser } = EdiUtils.getEdiParser(document);
    const ediDocument = await parser?.parse();
    if (!ediDocument) {
      this.clearDecorations();
      return;
    }

    const segments = ediDocument.getSegments(true);
    const decorations: vscode.DecorationOptions[] = segments.filter(segment => EdiUtils.isOnlySegmentInLine(document, segment)).map(segment => {
      return {
        renderOptions: {
          before: {
            contentText: "",
            width: `${segment.getLevel() * 2}ch`
          },
        },
        range: EdiUtils.getSegmentRange(document, segment)
      };
    });
    this.setDecorations(decorations);
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
