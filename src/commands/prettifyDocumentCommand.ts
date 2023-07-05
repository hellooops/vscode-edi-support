import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import { VscodeUtils } from "../utils/utils";

export class PrettifyDocumentCommand implements ICommandable {
  public static commandName: string = "edi-support.prettify";
  public static commandLabel: string = "Prettify";
  name: string = PrettifyDocumentCommand.commandName;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    let document = vscode.window.activeTextEditor.document;
    const documentContent = document.getText();

    const { parser, ediType } = VscodeUtils.getEdiParser(document)!;

    let segments = await parser.parseSegments();
    let text = segments.join("\n");

    vscode.window.activeTextEditor.edit((builder) => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

      builder.replace(new vscode.Range(
        vscode.window.activeTextEditor.document.positionAt(0), 
        vscode.window.activeTextEditor.document.positionAt(documentContent.length)
        ), text);
    });

    vscode.languages.setTextDocumentLanguage(
      vscode.window.activeTextEditor.document,
      ediType
    );
  }
}
