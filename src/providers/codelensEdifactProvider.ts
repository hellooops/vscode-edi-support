import * as vscode from "vscode";
import { EdifactEdiMessage } from "../parser/edifactParser";
import { EdiSegment } from "../parser/entities";
import { CodelensEdifactProviderBase } from "./codelensEdiProviderBase";
import { EdiParserBase } from "../parser/ediParserBase";

export class CodelensEdifactProvider extends CodelensEdifactProviderBase {
  async providerSegmentCodeLenses(parser: EdiParserBase, document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
    const codeLenses: vscode.CodeLens[] = [];
    const ediMessage = await parser.parseMessage() as EdifactEdiMessage;

    const messageDescriptions = ediMessage.buildMessageDescriptions();
    messageDescriptions.forEach(desc => {
      codeLenses.push(new vscode.CodeLens(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(0),
        ),
        {
          title: desc,
          tooltip: desc,
          command: "",
          arguments: []
        }
      ));
    });

    return codeLenses;
  }
}
