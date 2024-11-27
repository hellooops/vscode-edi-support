import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";
import VscodeUtils from "../utils/vscodeUtils";

export class ToggleInlayHintsCommand implements ICommandable {
  name: string = constants.commands.toggleInlayHintsCommand.name;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const segmentNamesInlayHintsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.inlayHints.segmentNames) ?? false;
    await vscode.workspace.getConfiguration(constants.configuration.ediSupport).update(constants.configuration.inlayHints.segmentNames, !segmentNamesInlayHintsEnabled, vscode.ConfigurationTarget.Global);
    await VscodeUtils.refreshEditor();
  }
}
