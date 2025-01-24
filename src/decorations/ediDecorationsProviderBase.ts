import * as vscode from "vscode";
import { IDecorationable } from "../interfaces/decorationable";
import * as constants from "../constants";

export abstract class EdiDecorationsProviderBase implements IDecorationable {
  static decorationTypeAfterLine = vscode.window.createTextEditorDecorationType({
    rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
    after: {
      margin: "0 0 0 3em",
      textDecoration: "none",
      color: new vscode.ThemeColor(constants.colors.trailingLineForegroundColor)
    }
  });
  static decorationTypeBeforePosition = vscode.window.createTextEditorDecorationType({
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    overviewRulerLane: vscode.OverviewRulerLane.Left,
    before: {
      margin: "0 1px 0 6px",
      textDecoration: "none",
      color: new vscode.ThemeColor(constants.colors.trailingLineForegroundColor)
    }
  });

  abstract decorationType: vscode.TextEditorDecorationType;

  dispose(): void {
    this.clearDecorations();
    vscode.window.activeTextEditor!.setDecorations(this.decorationType, []);
  }

  protected clearDecorations(): void {
    vscode.window.activeTextEditor!.setDecorations(this.decorationType, []);
  }

  protected setDecorations(decorations: vscode.DecorationOptions[]) {
    vscode.window.activeTextEditor!.setDecorations(this.decorationType, decorations);
  }

  abstract refreshDecorations(document: vscode.TextDocument, startOffset: number): Promise<void>;

  abstract registerDecorations(): vscode.Disposable[];
}
