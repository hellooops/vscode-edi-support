import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiType } from "../parser/entities";
import { VscodeUtils } from "../utils/utils";

export class HighlightEdiProvider implements vscode.DocumentHighlightProvider, IProvidable {
  async provideDocumentHighlights(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.DocumentHighlight[] | null | undefined> {
    const { parser } = VscodeUtils.getEdiParser(document)!;
    const segments = await parser.parseSegments();
    const realPosition = document.offsetAt(new vscode.Position(position.line, position.character));

    const selectedSegment = segments.find(x => realPosition >= x.startIndex && realPosition <= (x.endIndex + 1));
    if (!selectedSegment?.elements || selectedSegment?.elements?.length <= 0) {
      return [];
    }

    const selectedElement = selectedSegment?.elements.find(x => realPosition >= (selectedSegment.startIndex + x.startIndex) && realPosition <= (selectedSegment.startIndex + x.endIndex + 1));
    let highlightStartPosition: vscode.Position;
    let highlightEndPosition: vscode.Position;
    if (selectedElement) {
      highlightStartPosition = VscodeUtils.getElementStartPosition(document, selectedSegment, selectedElement);
      highlightEndPosition = VscodeUtils.getElementEndPosition(document, selectedSegment, selectedElement);
    } else {
      if (!selectedSegment?.elements || selectedSegment?.elements.length <= 0) {
        return null;
      }

      const firstElement = selectedSegment.elements[0];
      highlightStartPosition = VscodeUtils.getSegmentStartPosition(document, selectedSegment);
      highlightEndPosition = VscodeUtils.getElementStartPosition(document, selectedSegment, firstElement);
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

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerDocumentHighlightProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerDocumentHighlightProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
