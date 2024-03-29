import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiElement, EdiSegment, EdiType } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

export class InlayHintsEdiProvider implements vscode.InlayHintsProvider, IProvidable {
  onDidChangeInlayHints?: vscode.Event<void> | undefined;
  async provideInlayHints(document: vscode.TextDocument, range: vscode.Range, token: vscode.CancellationToken): Promise<vscode.InlayHint[] | null | undefined> {
    const segmentNamesInlayHintsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.inlayHints.segmentNames) ?? false;
    const elementsInlayHintsEnabled = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.inlayHints.elements) ?? false;
    if (!segmentNamesInlayHintsEnabled && !elementsInlayHintsEnabled) {
      return [];
    }
    
    const { parser } = EdiUtils.getEdiParser(document)!;
    if (!parser) {
      return [];
    }

    const inlayHints: vscode.InlayHint[] = [];
    const { segments } = await parser.parse();
    for (let segment of segments) {
      if (segmentNamesInlayHintsEnabled) {
        const segmentInlayHint = this.getSegmentNameInlayHint(segment, document);
        if (segmentInlayHint) {
          inlayHints.push(segmentInlayHint);
        }
      }

      if (elementsInlayHintsEnabled) {
        if (!segment.elements) {
          continue;
        }
  
        for (let ele of segment.elements) {
          inlayHints.push(...this.getElementInlayHints(segment, ele, document));
        }
      }

    }

    return inlayHints;
  }

  private getSegmentNameInlayHint(segment: EdiSegment, document: vscode.TextDocument): vscode.InlayHint | undefined {
    if (!segment.ediReleaseSchemaSegment?.desc) {
      return;
    }

    const inlayHint = new vscode.InlayHint(
      document.positionAt(segment.startIndex),
      segment.ediReleaseSchemaSegment.desc
    );

    return inlayHint;
  }

  private getElementInlayHints(segment: EdiSegment, element: EdiElement, document: vscode.TextDocument): vscode.InlayHint[] {
    if (!segment.ediReleaseSchemaSegment) {
      return [];
    }

    if (element.components) {
      const subElementsInlayHints: vscode.InlayHint[] = [];
      for (let subEle of element.components) {
        subElementsInlayHints.push(...this.getElementInlayHints(segment, subEle, document));
      }
      return subElementsInlayHints;
    } else {
      if (!element.ediReleaseSchemaElement?.desc) {
        return [];
      }

      const inlayHint = new vscode.InlayHint(
        document.positionAt(segment.startIndex + element.startIndex),
        element.ediReleaseSchemaElement.desc
      );
      inlayHint.paddingLeft = true;
      return [inlayHint];
    }
  }

  resolveInlayHint?(hint: vscode.InlayHint, token: vscode.CancellationToken): vscode.ProviderResult<vscode.InlayHint> {
    return hint;
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerInlayHintsProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerInlayHintsProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
