import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiType } from "../parser/entities";
import { PrettifyDocumentCommand } from "../commands/prettifyDocumentCommand";
import { MinifyDocumentCommand } from "../commands/minifyDocumentCommand";
import { ToggleInlayHintsCommand } from "../commands/toggleInlayHintsCommand";

export class CodelensEdiProvider implements vscode.CodeLensProvider, IProvidable {
  onDidChangeCodeLenses?: vscode.Event<void>;
  async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[] | null | undefined> {
    if (vscode.workspace.getConfiguration("ediSupport").get("enableCodelens") !== true) {
      return [];
    }

    const codeLenses: vscode.CodeLens[] = [];
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: MinifyDocumentCommand.commandLabel,
        tooltip: MinifyDocumentCommand.commandLabel,
        command: MinifyDocumentCommand.commandName,
        arguments: []
      }
    ));
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: PrettifyDocumentCommand.commandLabel,
        tooltip: PrettifyDocumentCommand.commandLabel,
        command: PrettifyDocumentCommand.commandName,
        arguments: []
      }
    ));
    const segmentNamesInlayHintsEnabled = vscode.workspace.getConfiguration("ediSupport").get("inlayHints.segmentNames")
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: `${ToggleInlayHintsCommand.commandLabel}(${segmentNamesInlayHintsEnabled ? "on" : "off"})`,
        tooltip: ToggleInlayHintsCommand.commandLabel,
        command: ToggleInlayHintsCommand.commandName,
        arguments: []
      }
    ));

    return codeLenses;
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerCodeLensProvider({ language: EdiType.X12, scheme: "file" }, this),
      vscode.languages.registerCodeLensProvider({ language: EdiType.EDIFACT, scheme: "file" }, this),
    ];
  }
}
