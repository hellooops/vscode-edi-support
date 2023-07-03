import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import { EdifactParser } from "../parser/edifactParser";

export class PrettifyEdifactCommand implements ICommandable {
  public name: string = "edi-edifact-support.prettify";

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    let document = vscode.window.activeTextEditor.document.getText();
    const parser = new EdifactParser(document);
    let segments = await parser.parseSegments();
    let text = segments.join("\n");

    vscode.window.activeTextEditor.edit((builder) => {
      if (!vscode.window.activeTextEditor) {
        return;
      }

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