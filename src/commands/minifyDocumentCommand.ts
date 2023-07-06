import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import { VscodeUtils } from "../utils/utils";

export class MinifyDocumentCommand implements ICommandable {
  public static commandName: string = "edi-support.minify";
  public static commandLabel: string = "Minify";
  name: string = MinifyDocumentCommand.commandName;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    let document = vscode.window.activeTextEditor.document;
    const documentContent = document.getText();

    const { parser, ediType } = VscodeUtils.getEdiParser(document)!;

    let segments = await parser.parseSegments();
    let text = segments.join("");

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
