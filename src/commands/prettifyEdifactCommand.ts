import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import { EdifactParser } from "../parser";

export class PrettifyEdifactCommand implements ICommandable {
  public name: string = "edi-edifact-support.prettify";

  public command(...args: any[]) {
    const parser = new EdifactParser();
    if (!vscode.window.activeTextEditor) {
      return;
    }

    let document = vscode.window.activeTextEditor.document.getText();
    let segments = parser.parseSegments(document);
    let text = segments.join("\n");

    vscode.window.activeTextEditor.edit((builder) => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

      let start = vscode.window.activeTextEditor.document.positionAt(
        segments[0].startIndex
      );
      let end = vscode.window.activeTextEditor.document.positionAt(
        segments[segments.length - 1].endIndex
      );
      builder.replace(new vscode.Range(
        vscode.window.activeTextEditor.document.positionAt(0), 
        vscode.window.activeTextEditor.document.positionAt(document.length)
        ), text);
    });

    vscode.languages.setTextDocumentLanguage(
      vscode.window.activeTextEditor.document,
      "edifact"
    );
  }
}


export class EdifactDocumentConfiguration {
  public subElementDelimiter: string = ":";
  public dataElementDelimiter: string = "+";
  public decimalPointIndicator: string = ".";
  public segmentTerminator: string = "'";
}