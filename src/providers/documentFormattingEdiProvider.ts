import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiType } from "../parser/entities";
import { VscodeUtils } from "../utils/utils";

export class DocumentFormattingEditEdiProvider implements vscode.DocumentFormattingEditProvider, IProvidable {
  async provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Promise<vscode.TextEdit[] | null | undefined> {
    const { parser } = VscodeUtils.getEdiParser(document);
    let segments = await parser.parseSegments();
    const formattedDocumentText = segments.join("\n");

    const result: vscode.TextEdit[] = [];
    result.push(new vscode.TextEdit(
      new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      ),
      formattedDocumentText
    ));
    return result;
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerDocumentFormattingEditProvider({ language: EdiType.X12, scheme: "file" }, this),
      vscode.languages.registerDocumentFormattingEditProvider({ language: EdiType.EDIFACT, scheme: "file" }, this),
    ];
  }
}
