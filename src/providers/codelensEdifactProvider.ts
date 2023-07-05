import * as vscode from "vscode";
import { EdifactEdiMessage } from "../parser/edifactParser";
import { EdiSegment } from "../parser/entities";
import { CodelensEdifactProviderBase } from "./codelensEdiProviderBase";
import { EdiParserBase } from "../parser/ediParserBase";

export class CodelensEdifactProvider extends CodelensEdifactProviderBase {
  async providerSegmentCodeLenses(parser: EdiParserBase, document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
    const codeLenses: vscode.CodeLens[] = [];
    const segments = await parser.parseSegments();
    const ediMessage = await parser.parseMessage() as EdifactEdiMessage;

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
}
