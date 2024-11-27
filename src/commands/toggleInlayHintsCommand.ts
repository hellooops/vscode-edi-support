import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";

export class ToggleInlayHintsCommand implements ICommandable {
  name: string = constants.commands.toggleInlayHintsCommand.name;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const segmentNamesInlayHintsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.inlayHints.segmentNames) ?? false;
    await vscode.workspace.getConfiguration(constants.configuration.ediSupport).update(constants.configuration.inlayHints.segmentNames, !segmentNamesInlayHintsEnabled, vscode.ConfigurationTarget.Global);
    // Let the page redo inlay hints
    const document = vscode.window.activeTextEditor.document;
    const documentContent = document.getText();
    await vscode.window.activeTextEditor.edit((builder) => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

      builder.replace(
        new vscode.Range(
          document.positionAt(0), 
          document.positionAt(documentContent.length)
        ),
        documentContent
      );
    });
  }
}
