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
    vscode.workspace.getConfiguration(constants.configuration.ediSupport).update(constants.configuration.inlayHints.segmentNames, !segmentNamesInlayHintsEnabled, vscode.ConfigurationTarget.Global);
    vscode.workspace.getConfiguration(constants.configuration.ediSupport).update(constants.configuration.inlayHints.elements, !segmentNamesInlayHintsEnabled, vscode.ConfigurationTarget.Global);
    // Let the page redo inlay hints
    vscode.commands.executeCommand(constants.commands.prettifyDocumentCommand.name);
  }
}
