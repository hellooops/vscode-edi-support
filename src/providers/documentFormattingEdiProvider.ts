import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiType } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";

export class DocumentFormattingEditEdiProvider implements vscode.DocumentFormattingEditProvider, IProvidable {
  async provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Promise<vscode.TextEdit[] | null | undefined> {
    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) return;

    const ediDocument = await parser.parse();
    if (!ediDocument) {
      return;
    }

    const result: vscode.TextEdit[] = [];
    result.push(new vscode.TextEdit(
      new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      ),
      ediDocument.getFormatString()
    ));
    return result;
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerDocumentFormattingEditProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerDocumentFormattingEditProvider({ language: EdiType.EDIFACT }, this),
      vscode.languages.registerDocumentFormattingEditProvider({ language: EdiType.VDA }, this),
    ];
  }
}
