import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiType } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

export class DocumentFormattingEditEdiProvider implements vscode.DocumentFormattingEditProvider, IProvidable {
  async provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Promise<vscode.TextEdit[] | null | undefined> {
    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) return;
    const { segments } = await parser.parse();
    if (!segments || segments.length <= 0) {
      return;
    }

    const formattedDocumentText = segments.join(constants.ediDocument.lineBreak);

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
      vscode.languages.registerDocumentFormattingEditProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerDocumentFormattingEditProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
