import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdifactParser } from "../parser/edifactParser";

export class DocumentFormattingEditEdifactProvider implements vscode.DocumentFormattingEditProvider, IProvidable {
  async provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Promise<vscode.TextEdit[] | null | undefined> {

    const documentText = document.getText();
    const parser = new EdifactParser(documentText);
    let segments = await parser.parseSegments();
    const formattedDocumentText = segments.join("\n");

    const result: vscode.TextEdit[] = [];
    result.push(new vscode.TextEdit(
      new vscode.Range(
        document.positionAt(0),
        document.positionAt(documentText.length)
      ),
      formattedDocumentText
    ));
    return result;
  }

  public registerFunction(): vscode.Disposable {
    const selector = { language: "edifact", scheme: "file" };
    return vscode.languages.registerDocumentFormattingEditProvider(
      selector,
      this
    );
  }
}
