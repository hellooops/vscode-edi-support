import * as vscode from "vscode";
import { IDecorationable } from "../interfaces/decorationable";

export abstract class EdiDecorationsProviderBase implements IDecorationable {
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

  abstract registerDecorations(): vscode.Disposable[];
}
