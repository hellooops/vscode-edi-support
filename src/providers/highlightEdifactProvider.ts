import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdifactParser } from "../parser";

export class HighlightEdifactProvider implements vscode.DocumentHighlightProvider, IProvidable {
  provideDocumentHighlights(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentHighlight[]> {
    vscode.window.showInformationMessage("Method not implemented.");
    const parser = new EdifactParser();
    

    const text = document.getText();

    const segments = parser.parseSegments(text);
    const realPosition = document.offsetAt(new vscode.Position(position.line, position.character));

    const selectedSegment = segments.find(x => realPosition >= x.startIndex && realPosition <= (x.endIndex + 1));
    if (selectedSegment?.elements?.length <= 0) {
      return [];
    }

    const selectedElement = selectedSegment?.elements.find(x => realPosition >= (selectedSegment.startIndex + x.startIndex) && realPosition <= (selectedSegment.startIndex + x.endIndex + 1));
    const elementStartPosition = document.positionAt(selectedSegment.startIndex + selectedElement.startIndex);
    const elementEndPosition = document.positionAt(selectedSegment.startIndex + selectedElement.endIndex + 1);

    return [
      new vscode.DocumentHighlight(
        new vscode.Range(
          elementStartPosition,
          elementEndPosition
        ),
        vscode.DocumentHighlightKind.Read
      )
    ];
  }

  public registerFunction(): vscode.Disposable {
    const selector = { language: "edifact", scheme: "file" };
    return vscode.languages.registerDocumentHighlightProvider(
      selector,
      this
    );
  }

}


