import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiType } from "../parser/entities";
import * as constants from "../constants";

export class CodelensEdiProvider implements vscode.CodeLensProvider, IProvidable {
  onDidChangeCodeLenses?: vscode.Event<void>;
  async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[] | null | undefined> {
    if (vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableCodelens) !== true) {
      return [];
    }

    const codeLenses: vscode.CodeLens[] = [];
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: constants.commands.minifyDocumentCommand.label,
        tooltip: constants.commands.minifyDocumentCommand.label,
        command: constants.commands.minifyDocumentCommand.name,
        arguments: []
      }
    ));
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: constants.commands.prettifyDocumentCommand.label,
        tooltip: constants.commands.prettifyDocumentCommand.label,
        command: constants.commands.prettifyDocumentCommand.name,
        arguments: []
      }
    ));
    const segmentNamesInlayHintsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.inlayHints.segmentNames);
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: `${constants.commands.toggleInlayHintsCommand.label}(${segmentNamesInlayHintsEnabled ? "on" : "off"})`,
        tooltip: constants.commands.toggleInlayHintsCommand.label,
        command: constants.commands.toggleInlayHintsCommand.name,
        arguments: []
      }
    ));
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: constants.commands.previewDocumentCommand.label,
        tooltip: constants.commands.previewDocumentCommand.label,
        command: constants.commands.previewDocumentCommand.name,
        arguments: []
      }
    ));
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: constants.common.kasoftware.allRightsReserved,
        tooltip: constants.common.kasoftware.allRightsReserved,
        command: constants.nativeCommands.open,
        arguments: [constants.common.kasoftware.url]
      }
    ));

    return codeLenses;
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerCodeLensProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerCodeLensProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
