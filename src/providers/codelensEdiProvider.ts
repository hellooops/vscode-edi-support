import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiSegment, EdiType } from "../parser/entities";
import * as constants from "../constants";
import { EdiUtils } from "../utils/ediUtils";

export class CodelensEdiProvider implements vscode.CodeLensProvider, IProvidable {
  static CODE_LENSE_MINIFY = new vscode.CodeLens(
    new vscode.Range(0, 0, 0, 0),
    {
      title: constants.commands.minifyDocumentCommand.label,
      tooltip: constants.commands.minifyDocumentCommand.label,
      command: constants.commands.minifyDocumentCommand.name,
      arguments: []
    }
  );
  static CODE_LENSE_PRETTIFY = new vscode.CodeLens(
    new vscode.Range(0, 0, 0, 0),
    {
      title: constants.commands.prettifyDocumentCommand.label,
      tooltip: constants.commands.prettifyDocumentCommand.label,
      command: constants.commands.prettifyDocumentCommand.name,
      arguments: []
    }
  );
  static CODE_LENSE_PREVIEW = new vscode.CodeLens(
    new vscode.Range(0, 0, 0, 0),
    {
      title: constants.commands.previewDocumentCommand.label,
      tooltip: constants.commands.previewDocumentCommand.label,
      command: constants.commands.previewDocumentCommand.name,
      arguments: []
    }
  );
  static CODE_LENSE_COMPANY = new vscode.CodeLens(
    new vscode.Range(0, 0, 0, 0),
    {
      title: constants.common.kasoftware.allRightsReserved,
      tooltip: constants.common.kasoftware.allRightsReserved,
      command: constants.nativeCommands.open,
      arguments: [constants.common.kasoftware.url]
    }
  );

  onDidChangeCodeLenses?: vscode.Event<void>;
  async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[] | null | undefined> {
    const codeLenses: vscode.CodeLens[] = [];
    if (vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableCodelens)) {
      const headerCodeLenses = this.getHeaderCodeLenses();
      codeLenses.push(...headerCodeLenses);
    }

    if (vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableLoopAnnotations)) {
      const documentCodeLenses = await this.getDocumentCodeLenses(document);
      codeLenses.push(...documentCodeLenses);
    }

    return codeLenses;
  }

  getHeaderCodeLenses(): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    codeLenses.push(CodelensEdiProvider.CODE_LENSE_MINIFY);
    codeLenses.push(CodelensEdiProvider.CODE_LENSE_PRETTIFY);

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

    const loopAnnotationsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableLoopAnnotations);
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: `${constants.commands.toggleLoopAnnotationsCommand.label}(${loopAnnotationsEnabled ? "on" : "off"})`,
        tooltip: constants.commands.toggleLoopAnnotationsCommand.label,
        command: constants.commands.toggleLoopAnnotationsCommand.name,
        arguments: []
      }
    ));

    const indentSegmentsInLoopEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.formatting.indentSegmentsInLoop);
    codeLenses.push(new vscode.CodeLens(
      new vscode.Range(0, 0, 0, 0),
      {
        title: `${constants.commands.toggleIndentSegmentsInLoopCommand.label}(${indentSegmentsInLoopEnabled ? "on" : "off"})`,
        tooltip: constants.commands.toggleIndentSegmentsInLoopCommand.label,
        command: constants.commands.toggleIndentSegmentsInLoopCommand.name,
        arguments: []
      }
    ));

    codeLenses.push(CodelensEdiProvider.CODE_LENSE_PREVIEW);
    codeLenses.push(CodelensEdiProvider.CODE_LENSE_COMPANY);

    return codeLenses;
  }

  async getDocumentCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) {
      return [];
    }

    const ediDocument = await parser.parse();
    if (!ediDocument) {
      return [];
    }

    const segments = ediDocument.getSegments();
    return this.getSegmentsCodeLenses(document, segments);
  }

  getSegmentsCodeLenses(document: vscode.TextDocument, segments: EdiSegment[]): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    // TODO(Deric): Interchange codelens, remove lines between transactions
    for (const segment of segments) {
      if (segment.isLoop() && segment.Loop!.length > 0) {
        const firstChildSegment = segment.Loop![0];
        if (!EdiUtils.isOnlySegmentInLine(document, firstChildSegment)) continue;
        const segmentPosition = EdiUtils.getSegmentStartPosition(document, segment);
        const loopCodeLense = new vscode.CodeLens(
          new vscode.Range(segmentPosition, segmentPosition),
          {
            title: segment.id,
            tooltip: segment.id,
            command: "",
            arguments: []
          }
        );

        codeLenses.push(loopCodeLense);
        codeLenses.push(...this.getSegmentsCodeLenses(document, segment.Loop!));
      }
    }

    return codeLenses;
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerCodeLensProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerCodeLensProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
