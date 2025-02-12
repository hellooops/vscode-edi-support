import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiSegment } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

export abstract class InlayHintsEdiProvider implements vscode.InlayHintsProvider, IProvidable {
  onDidChangeInlayHints?: vscode.Event<void> | undefined;
  async provideInlayHints(document: vscode.TextDocument, range: vscode.Range, token: vscode.CancellationToken): Promise<vscode.InlayHint[] | null | undefined> {
    const segmentNamesInlayHintsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.inlayHints.segmentNames) ?? false;
    if (!segmentNamesInlayHintsEnabled) {
      return [];
    }
    const { parser } = EdiUtils.getEdiParser(document)!;
    if (!parser) {
      return [];
    }

    const ediDocument = await parser.parse();
    const segments = ediDocument.getSegments(true);

    const inlayHints: vscode.InlayHint[] = [];
    for (let segment of segments) {
      const segmentInlayHint = this.getSegmentNameInlayHint(segment, document);
      if (segmentInlayHint) {
        inlayHints.push(segmentInlayHint);
      }
    }

    return inlayHints;
  }

  private getSegmentNameInlayHint(segment: EdiSegment, document: vscode.TextDocument): vscode.InlayHint | undefined {
    if (!segment.getDesc()) {
      return;
    }

    const inlayHint = new vscode.InlayHint(
      document.positionAt(segment.startIndex + segment.id.length),
      segment.getDesc()!
    );

    return inlayHint;
  }

  resolveInlayHint?(hint: vscode.InlayHint, token: vscode.CancellationToken): vscode.ProviderResult<vscode.InlayHint> {
    return hint;
  }

  abstract getLanguageId(): string;

  registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerInlayHintsProvider({ language: this.getLanguageId() }, this)
    ];
  }
}
