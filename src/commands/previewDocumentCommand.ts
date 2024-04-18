import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";
import { createWebview } from "../webviews/ediPreviewWebview";

export class PreviewDocumentCommand implements ICommandable {
  name: string = constants.commands.previewDocumentCommand.name;
  static context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    PreviewDocumentCommand.context = context;
  }

  public async command(...args: any[]) {
    createWebview(PreviewDocumentCommand.context);
  }
}
