import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";
import Utils from "../utils/utils";
import { EdiFormattingOptions } from "../parser/entities";

export class PrettifyDocumentCommand implements ICommandable {
  name: string = constants.commands.prettifyDocumentCommand.name;

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    let document = vscode.window.activeTextEditor.document;
    const vscodeEditorOptions = vscode.window.activeTextEditor.options;
    const documentContent = document.getText();

    const { parser, ediType } = EdiUtils.getEdiParser(document);
    if (!parser) return;

    const ediDocument = await parser.parse();
    if (!ediDocument) {
      return;
    }

    const formattingOptions = new EdiFormattingOptions(Utils.getStringAsInt(vscodeEditorOptions.tabSize) ?? 2, Utils.getValueAsBoolean(vscodeEditorOptions.insertSpaces, true));
    vscode.window.activeTextEditor.edit((builder) => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

      builder.replace(
        new vscode.Range(
          vscode.window.activeTextEditor.document.positionAt(0), 
          vscode.window.activeTextEditor.document.positionAt(documentContent.length)
        ),
        ediDocument.getFormatString(formattingOptions)
      );
    });
  }
}
