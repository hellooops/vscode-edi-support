import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdifactParser } from "../parser";

export class HighlightEdifactProvider implements vscode.DocumentHighlightProvider, IProvidable {
  async provideDocumentHighlights(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.DocumentHighlight[]> {
    vscode.window.showInformationMessage("Method not implemented.");
    const text = document.getText();
    const parser = new EdifactParser(text);
    const segments = await parser.parseSegments();
    const realPosition = document.offsetAt(new vscode.Position(position.line, position.character));

    const selectedSegment = segments.find(x => realPosition >= x.startIndex && realPosition <= (x.endIndex + 1));
    if (selectedSegment?.elements?.length <= 0) {
      return [];
    }

    const selectedElement = selectedSegment?.elements.find(x => realPosition >= (selectedSegment.startIndex + x.startIndex) && realPosition <= (selectedSegment.startIndex + x.endIndex + 1));
    let highlightStartPosition: vscode.Position;
    let highlightEndPosition: vscode.Position;
    if (selectedElement) {
      highlightStartPosition = document.positionAt(selectedSegment.startIndex + selectedElement.startIndex);
      highlightEndPosition = document.positionAt(selectedSegment.startIndex + selectedElement.endIndex + 1);
    } else {
      if (!selectedSegment?.elements || selectedSegment?.elements.length <= 0) {
        return null;
      }

      const firstElement = selectedSegment.elements[0];
      highlightStartPosition = document.positionAt(selectedSegment.startIndex);
      highlightEndPosition = document.positionAt(selectedSegment.startIndex + firstElement.startIndex);
    }

    return [
      new vscode.DocumentHighlight(
        new vscode.Range(
          highlightStartPosition,
          highlightEndPosition
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
