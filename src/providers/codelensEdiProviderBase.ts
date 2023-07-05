import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiSegment, EdiType } from "../parser/entities";
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

  getSegmentDefaultCodelens(segment: EdiSegment, document: vscode.TextDocument): vscode.CodeLens | undefined {
    const description = segment.ediReleaseSchemaSegment?.desc;
    const purpose = segment.ediReleaseSchemaSegment?.purpose;
    if (!description && !purpose) {
      return;
    }

    let title: string;
    if (description && purpose) {
      title = `${description} (${purpose})`;
    } else {
      title = description || purpose || "";
    }

    return new vscode.CodeLens(
      new vscode.Range(
        document.positionAt(segment.startIndex),
        document.positionAt(segment.endIndex),
      ),
      {
        title,
        tooltip: title,
        command: "",
        arguments: []
      }
    );
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerCodeLensProvider({ language: EdiType.X12, scheme: "file" }, this),
      vscode.languages.registerCodeLensProvider({ language: EdiType.EDIFACT, scheme: "file" }, this),
    ];
  }
}
