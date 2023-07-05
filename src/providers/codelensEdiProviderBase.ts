import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiType } from "../parser/entities";
import { EdiParserBase } from "../parser/ediParserBase";
import { VscodeUtils } from "../utils/utils";

export abstract class CodelensEdifactProviderBase implements vscode.CodeLensProvider, IProvidable {
  onDidChangeCodeLenses?: vscode.Event<void>;
  async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[] | null | undefined> {
    if (vscode.workspace.getConfiguration("ediSupport").get("enableCodelens") !== true) {
      return [];
    }

    const { parser } = VscodeUtils.getEdiParser(document)!;
    return await this.providerSegmentCodeLenses(parser, document);
  }

  abstract providerSegmentCodeLenses(parser: EdiParserBase, document: vscode.TextDocument): Promise<vscode.CodeLens[]>;

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerCodeLensProvider({ language: EdiType.X12, scheme: "file" }, this),
      vscode.languages.registerCodeLensProvider({ language: EdiType.EDIFACT, scheme: "file" }, this),
    ];
  }
}
