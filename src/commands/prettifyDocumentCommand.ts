import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import { VscodeUtils } from "../utils/utils";
import { EdiParserBase } from "../parser/ediParserBase";
import { X12Parser } from "../parser/x12Parser";
import { EdifactParser } from "../parser/edifactParser";
import { EdiType } from "../parser/entities";

export class PrettifyDocumentCommand implements ICommandable {
  public name: string = "edi-support.prettify";

  public async command(...args: any[]) {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    let document = vscode.window.activeTextEditor.document;
    const documentContent = document.getText();

    let ediType: string;
    let parser: EdiParserBase;
    if (VscodeUtils.isX12(document)) {
      parser = new X12Parser(documentContent);
      ediType = EdiType.X12;
    } else if (VscodeUtils.isEdifact(document)) {
      parser = new EdifactParser(documentContent);
      ediType = EdiType.EDIFACT;
    } else {
      return;
    }

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
