import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiMessage, EdiSegment, EdifactParser } from "../parser";

export class CodelensEdifactProvider implements vscode.CodeLensProvider, IProvidable {
  private ediMessage?: EdiMessage;
  onDidChangeCodeLenses?: vscode.Event<void>;
  async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]> {
    const codeLenses: vscode.CodeLens[] = [];
    const text = document.getText();
    const parser = new EdifactParser(text);
    this.ediMessage = await parser.parseMessage();
    if (!this.ediMessage) {
      return [];
    }
    const unb: EdiSegment = this.ediMessage.segments.find(segment => segment.id === "UNB");
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(
        document.positionAt(unb.startIndex),
        document.positionAt(unb.endIndex),
      )
    ));
    return codeLenses;
  }

  public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
    
    codeLens.command = {
      title: `EDIFACT document ${this?.ediMessage?.release} ${this?.ediMessage?.type}`,
      tooltip: "Tooltip provided by1\n2 sample extension",
      command: null,
      arguments: []
    };
    return codeLens;
  }

  private buildMessageDescription(ediMessage: EdiMessage): string {
    return null;
  }

  public registerFunction(): vscode.Disposable {
    const selector = { language: "edifact", scheme: "file" };
    return vscode.languages.registerCodeLensProvider(
      selector,
      this
    );
  }
}
