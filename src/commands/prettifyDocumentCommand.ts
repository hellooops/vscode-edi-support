import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

export class PrettifyDocumentCommand implements ICommandable {
  name: string = constants.commands.prettifyDocumentCommand.name;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    let document = vscode.window.activeTextEditor.document;
    const documentContent = document.getText();

    const { parser, ediType } = EdiUtils.getEdiParser(document);
    if (!parser) return;

    const { segments } = await parser.parse();
    if (!segments || segments.length <= 0) {
      return;
    }

    let text = segments.join(constants.ediDocument.lineBreak);

    vscode.window.activeTextEditor.edit((builder) => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

      builder.replace(new vscode.Range(
        vscode.window.activeTextEditor.document.positionAt(0), 
        vscode.window.activeTextEditor.document.positionAt(documentContent.length)
        ), text);
    });
  }
}
