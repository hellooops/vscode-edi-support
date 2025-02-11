import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiFunctionalGroup, EdiInterchange, EdiSegment, EdiTransactionSet, EdiType } from "../parser/entities";
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
    const languageId = document.languageId;
    if (vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableCodelens)) {
      const headerCodeLenses = this.getHeaderCodeLenses(languageId);
      codeLenses.push(...headerCodeLenses);
    }

    if (vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableLoopAnnotations)) {
      const documentCodeLenses = await this.getDocumentCodeLenses(document);
      codeLenses.push(...documentCodeLenses);
    }

    return codeLenses;
  }

  getHeaderCodeLenses(languageId: string): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    codeLenses.push(CodelensEdiProvider.CODE_LENSE_MINIFY);
    codeLenses.push(CodelensEdiProvider.CODE_LENSE_PRETTIFY);

    if (languageId === EdiType.VDA) {
      const elementIndexAnnotationEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableElementIndexAnnotation);
      codeLenses.push(new vscode.CodeLens(
        new vscode.Range(0, 0, 0, 0),
        {
          title: `${constants.commands.toggleElementIndexAnnotationCommand.label}(${elementIndexAnnotationEnabled ? "on" : "off"})`,
          tooltip: constants.commands.toggleElementIndexAnnotationCommand.label,
          command: constants.commands.toggleElementIndexAnnotationCommand.name,
          arguments: []
        }
      ));
    } else {
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
    }

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

    return ediDocument.interchanges.flatMap(i => this.getInterchangeCodeLenses(document, i, ediDocument.interchanges.length > 1));
  }

  getInterchangeCodeLenses(document: vscode.TextDocument, interchange: EdiInterchange, headerCodeLense: boolean): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    if (headerCodeLense) {
      const firstChildSegment = interchange.getFirstSegment()!;
      if (EdiUtils.isOnlySegmentInLine(document, firstChildSegment)) {
        const startPosition = EdiUtils.getInterchangeStartPosition(document, interchange);
        const title = `Interchange [ID=${interchange.getId() ?? "Unknown"}]`;
        codeLenses.push(new vscode.CodeLens(
          new vscode.Range(startPosition, startPosition),
          {
            title: title,
            tooltip: title,
            command: "",
            arguments: []
          }
        ));
      }
    }

    codeLenses.push(...interchange.functionalGroups.flatMap(i => this.getFunctionalGroupCodeLenses(document, i, interchange.functionalGroups.length > 1)));
    return codeLenses;
  }

  getFunctionalGroupCodeLenses(document: vscode.TextDocument, functionalGroup: EdiFunctionalGroup, headerCodeLense: boolean): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    if (headerCodeLense) {
      const firstChildSegment = functionalGroup.getFirstSegment()!;
      if (EdiUtils.isOnlySegmentInLine(document, firstChildSegment)) {
        const startPosition = EdiUtils.getFunctionalGroupStartPosition(document, functionalGroup);
        const title = `Functional Group [ID=${functionalGroup.getId() ?? "Unknown"}]`;
        codeLenses.push(new vscode.CodeLens(
          new vscode.Range(startPosition, startPosition),
          {
            title: title,
            tooltip: title,
            command: "",
            arguments: []
          }
        ));
      }
    }

    codeLenses.push(...functionalGroup.transactionSets.flatMap(i => this.getTransactionSetCodeLenses(document, i, functionalGroup.transactionSets.length > 1)));
    return codeLenses;
  }

  getTransactionSetCodeLenses(document: vscode.TextDocument, transactionSet: EdiTransactionSet, headerCodeLense: boolean): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    if (headerCodeLense) {
      const firstChildSegment = transactionSet.getFirstSegment()!;
      if (EdiUtils.isOnlySegmentInLine(document, firstChildSegment)) {
        const startPosition = EdiUtils.getTransactionSetStartPosition(document, transactionSet);
        const title = `Transaction Set [ID=${transactionSet.getId() ?? "Unknown"}]`;
        codeLenses.push(new vscode.CodeLens(
          new vscode.Range(startPosition, startPosition),
          {
            title: title,
            tooltip: title,
            command: "",
            arguments: []
          }
        ));
      }
    }

    codeLenses.push(...this.getSegmentsCodeLenses(document, transactionSet.segments));
    return codeLenses;
  }

  getSegmentsCodeLenses(document: vscode.TextDocument, segments: EdiSegment[]): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
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
      vscode.languages.registerCodeLensProvider({ language: EdiType.VDA }, this),
    ];
  }
}
