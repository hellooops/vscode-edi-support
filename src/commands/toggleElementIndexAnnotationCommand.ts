import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";
import VscodeUtils from "../utils/vscodeUtils";

export class ToggleElementIndexAnnotationCommand implements ICommandable {
  name: string = constants.commands.toggleElementIndexAnnotationCommand.name;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const elementIndexAnnotationEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableElementIndexAnnotation) ?? true;
    await vscode.workspace.getConfiguration(constants.configuration.ediSupport).update(constants.configuration.enableElementIndexAnnotation, !elementIndexAnnotationEnabled, vscode.ConfigurationTarget.Global);
    await VscodeUtils.refreshEditor();
  }
}
