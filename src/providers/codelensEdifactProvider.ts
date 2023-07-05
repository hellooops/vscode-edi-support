import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdifactParser, EdifactEdiMessage } from "../parser/edifactParser";
import { EdiSegment, EdiType } from "../parser/entities";

export class CodelensEdifactProvider implements vscode.CodeLensProvider, IProvidable {
  private parser?: EdifactParser;
  onDidChangeCodeLenses?: vscode.Event<void>;
  async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[] | null | undefined> {
    if (vscode.workspace.getConfiguration("ediSupport").get("enableCodelens") !== true) {
      return [];
    }
    const codeLenses: vscode.CodeLens[] = [];
    const text = document.getText();
    this.parser = new EdifactParser(text);
    const segments = await this.parser.parseSegments();
    const ediMessage = await this.parser.parseMessage() as EdifactEdiMessage;
    

    const una: EdiSegment | undefined = segments.find(segment => segment.id === "UNA");
    if (una) {
      for (let element of una.elements) {
        const elementDesc = `${element.ediReleaseSchemaElement?.desc}: ${element.value}`;
        codeLenses.push(new vscode.CodeLens(
          new vscode.Range(document.positionAt(una.startIndex), document.positionAt(una.endIndex)),
          { title: elementDesc, tooltip: elementDesc, command: "", arguments: [] }
        ));
      }
    }

    const unb: EdiSegment | undefined = segments.find(segment => segment.id === "UNB");
    if (unb) {
      const description = ediMessage?.buildUNBDescription();
      codeLenses.push(new vscode.CodeLens(
        new vscode.Range(
          document.positionAt(unb.startIndex),
          document.positionAt(unb.endIndex),
        ),
        {
          title: description || "",
          tooltip: description || "",
          command: "",
          arguments: []
        }
      ));
    }
    
    const unh: EdiSegment | undefined = segments.find(segment => segment.id === "UNH");
    if (unh) {
      const description = ediMessage?.buildUNHDescription();
      codeLenses.push(new vscode.CodeLens(
        new vscode.Range(
          document.positionAt(unh.startIndex),
          document.positionAt(unh.endIndex),
        ),
        {
          title: description || "",
          tooltip: description || "",
          command: "",
          arguments: []
        }
      ));
    }
    return codeLenses;
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerCodeLensProvider({ language: EdiType.EDIFACT, scheme: "file" }, this),
    ];
  }
}
