import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";

export class SelectTextByPositionCommand implements ICommandable {
  name: string = "edi-support.selectTextByPosition";

  public async command(...args: any[]) {
    if (!args || args.length < 2) {
      return;
    }

    if (!vscode.window.activeTextEditor) {
      return;
    }

    const editor = vscode.window.activeTextEditor;

    const fromIndex = parseInt(args[0]);
    const toIndex = parseInt(args[1]);
    editor.selections = [new vscode.Selection(
      editor.document.positionAt(fromIndex),
      editor.document.positionAt(toIndex)
    )];
    vscode.commands.executeCommand(constants.nativeCommands.focusFirstEditorGroup);
  }
}
