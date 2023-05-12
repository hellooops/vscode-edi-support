import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdifactParser } from "../parser";

export class HoverEdifactProvider implements vscode.HoverProvider, IProvidable {
  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    const parser = new EdifactParser();
    let text = document.getText();

    let segments = parser.parseSegments(text);
    let realPosition = document.offsetAt(
      new vscode.Position(position.line, position.character)
    );
    let selectedSegment = segments.find(x => realPosition >= x.startIndex && realPosition <= (x.endIndex + 1));

    if (selectedSegment?.elements?.length <= 0) {
      return null;
    }

    const selectedElement = selectedSegment?.elements.find(x => realPosition >= (selectedSegment.startIndex + x.startIndex) && realPosition <= (selectedSegment.startIndex + x.endIndex + 1));
    const elementStartPosition = document.positionAt(selectedSegment.startIndex + selectedElement.startIndex);
    const elementEndPosition = document.positionAt(selectedSegment.startIndex + selectedElement.endIndex + 1);

    if (!selectedElement) {
      return null;
    }

    // let context = "";
    // for (let i = 0, len = selectedSegment.elements.length; i < len; i++) {
    //   let el = selectedSegment.elements[i];
    //   let element = el.separator + el.value;
    //   context += element;
    // }
    // context += selectedSegment.endingDelimiter;

    return new vscode.Hover(
      `**${selectedSegment.id}**${selectedElement.name} (_${selectedElement.type}_)\n\n` +
        "```edi\n" +
        `${selectedSegment}\n` +
        "```"
    );

  }

  public registerFunction(): vscode.Disposable {
    const selector = { language: "edifact", scheme: "file" };
    return vscode.languages.registerHoverProvider(selector, this);
  }
}
