import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";
import VscodeUtils from "../utils/vscodeUtils";

export class ToggleIndentSegmentsInLoopCommand implements ICommandable {
  name: string = constants.commands.toggleIndentSegmentsInLoopCommand.name;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const indentSegmentsInLoopEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.formatting.indentSegmentsInLoop) ?? false;
    await vscode.workspace.getConfiguration(constants.configuration.ediSupport).update(constants.configuration.formatting.indentSegmentsInLoop, !indentSegmentsInLoopEnabled, vscode.ConfigurationTarget.Global);
    await VscodeUtils.refreshEditor();
  }
}
