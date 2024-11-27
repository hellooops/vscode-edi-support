import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

export class MinifyDocumentCommand implements ICommandable {
  name: string = constants.commands.minifyDocumentCommand.name;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    let document = vscode.window.activeTextEditor.document;
    const documentContent = document.getText();

    const { parser, ediType } = EdiUtils.getEdiParser(document);
    if (!parser) return;

    const ediDocument = await parser.parse();
    if (!ediDocument) {
      return;
    }

    let text = ediDocument.getSegments(true).join("");

    vscode.window.activeTextEditor.edit((builder) => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

      builder.replace(
        new vscode.Range(
          vscode.window.activeTextEditor.document.positionAt(0), 
          vscode.window.activeTextEditor.document.positionAt(documentContent.length)
        ),
        text
      );
    });
  }
}
