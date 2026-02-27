import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiElement, EdiSegment } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

export abstract class InlayHintsEdiProvider implements vscode.InlayHintsProvider, IProvidable {
  onDidChangeInlayHints?: vscode.Event<void> | undefined;
  async provideInlayHints(document: vscode.TextDocument, range: vscode.Range, token: vscode.CancellationToken): Promise<vscode.InlayHint[] | null | undefined> {
    const segmentNamesInlayHintsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.inlayHints.segmentNames) ?? false;
    const qualifierCodesInlayHintsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.inlayHints.qualifierCodes) ?? false;
    
    if (!segmentNamesInlayHintsEnabled && !qualifierCodesInlayHintsEnabled) {
      return [];
    }
    const { parser } = EdiUtils.getEdiParser(document)!;
    if (!parser) {
      return [];
    }

    const ediDocument = await parser.parse();
    const segments = ediDocument.getSegments(true);

    let inlayHints: vscode.InlayHint[] = [];
    for (let segment of segments) {
      if (segmentNamesInlayHintsEnabled) {
        const segmentInlayHint = this.getSegmentNameInlayHint(segment, document);
        if (segmentInlayHint) {
          inlayHints.push(segmentInlayHint);
        }
      }

      if (qualifierCodesInlayHintsEnabled) {
        inlayHints.push(...this.getQualifierInlayHints(segment, document));
      }
    }

    inlayHints = inlayHints.filter(hint => hint.label && hint.label.length > 0);

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

  private getQualifierInlayHints(segment: EdiSegment, document: vscode.TextDocument): vscode.InlayHint[] {
    if (!segment.elements) {
      return [];
    }

    const hints: vscode.InlayHint[] = [];
    for (const element of segment.elements) {
      hints.push(...this.getElementQualifierInlayHints(segment, element, document));
    }
    return hints;
  }

  private getElementQualifierInlayHints(segment: EdiSegment, element: EdiElement, document: vscode.TextDocument): vscode.InlayHint[] {
    const hints: vscode.InlayHint[] = [];

    if (element.components && element.components.length > 0) {
      for (const component of element.components) {
        hints.push(...this.getElementQualifierInlayHints(segment, component, document));
      }
      return hints;
    }

    if (element.ediReleaseSchemaElement?.qualifierRef && element.value) {
      const qualifier = element.ediReleaseSchemaElement.getCodeOrNullByValue(element.value);
      if (qualifier) {
        const hint = new vscode.InlayHint(
          document.positionAt(segment.startIndex + element.endIndex + 1),
          qualifier.desc
        );
        hint.paddingLeft = true;
        hints.push(hint);
      }
    }

    return hints;
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
