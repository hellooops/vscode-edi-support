import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";

export class ToggleInlayHintsCommand implements ICommandable {
  public static commandName: string = "edi-support.toggleInlayHints";
  public static commandLabel: string = "Toggle inlay hints";
  name: string = ToggleInlayHintsCommand.commandName;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const segmentNamesInlayHintsEnabled = vscode.workspace.getConfiguration("ediSupport").get("inlayHints.segmentNames") ?? false;
    vscode.workspace.getConfiguration("ediSupport").update("inlayHints.segmentNames", !segmentNamesInlayHintsEnabled, vscode.ConfigurationTarget.Global);
    vscode.workspace.getConfiguration("ediSupport").update("inlayHints.elements", !segmentNamesInlayHintsEnabled, vscode.ConfigurationTarget.Global);
    // Let the page redo inlay hints
    vscode.commands.executeCommand("edi-support.prettify");
  }
}
