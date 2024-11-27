import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";
import VscodeUtils from "../utils/vscodeUtils";

export class ToggleLoopAnnotationsCommand implements ICommandable {
  name: string = constants.commands.toggleLoopAnnotationsCommand.name;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const loopAnnotationsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableLoopAnnotations) ?? false;
    await vscode.workspace.getConfiguration(constants.configuration.ediSupport).update(constants.configuration.enableLoopAnnotations, !loopAnnotationsEnabled, vscode.ConfigurationTarget.Global);
    await VscodeUtils.refreshEditor();
  }
}
