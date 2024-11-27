import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiFunctionalGroup, EdiInterchange, EdiSegment, EdiTransactionSet, EdiType } from "../parser/entities";
import * as constants from "../constants";
import { EdiUtils } from "../utils/ediUtils";

export class FoldingRangeEdiProvider implements vscode.FoldingRangeProvider, IProvidable {
  async provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): Promise<vscode.FoldingRange[]> {
    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) return [];

    const ediDocument = await parser.parse();
    if (!ediDocument) {
      if (!parser) return [];
    }

    return ediDocument.interchanges.flatMap(i => this.getInterchangeFoldingRange(document, i));
  }

  getInterchangeFoldingRange(document: vscode.TextDocument, interchange: EdiInterchange): vscode.FoldingRange[] {
    const foldingRanges: vscode.FoldingRange[] = [];
    const firstSegment = interchange.getFirstSegment();
    const lastSegment = interchange.getLastSegment();
    const range = EdiUtils.getInterchangeRange(document, interchange);
    if (range.start.line === range.end.line) return [];
    if (firstSegment && EdiUtils.isOnlySegmentInLine(document, firstSegment) && lastSegment && EdiUtils.isOnlySegmentInLine(document, lastSegment)) {
      foldingRanges.push(new vscode.FoldingRange(range.start.line, range.end.line));
    }

    foldingRanges.push(...interchange.functionalGroups.flatMap(i => this.getFunctionalGroupFoldingRange(document, i)));

    return foldingRanges;
  }

  getFunctionalGroupFoldingRange(document: vscode.TextDocument, functionalGroup: EdiFunctionalGroup): vscode.FoldingRange[] {
    const foldingRanges: vscode.FoldingRange[] = [];
    const firstSegment = functionalGroup.getFirstSegment();
    const lastSegment = functionalGroup.getLastSegment();
    const range = EdiUtils.getFunctionalGroupRange(document, functionalGroup);
    if (range.start.line === range.end.line) return [];
    if (!functionalGroup.isFake()) {
      if (firstSegment && EdiUtils.isOnlySegmentInLine(document, firstSegment) && lastSegment && EdiUtils.isOnlySegmentInLine(document, lastSegment)) {
        foldingRanges.push(new vscode.FoldingRange(range.start.line, range.end.line));
      }
    }

    foldingRanges.push(...functionalGroup.transactionSets.flatMap(i => this.getTransactionSetFoldingRange(document, i)));

    return foldingRanges;
  }

  getTransactionSetFoldingRange(document: vscode.TextDocument, transactionSet: EdiTransactionSet): vscode.FoldingRange[] {
    const foldingRanges: vscode.FoldingRange[] = [];
    const firstSegment = transactionSet.getFirstSegment();
    const lastSegment = transactionSet.getLastSegment();
    const range = EdiUtils.getTransactionSetRange(document, transactionSet);
    if (range.start.line === range.end.line) return [];
    if (firstSegment && EdiUtils.isOnlySegmentInLine(document, firstSegment) && lastSegment && EdiUtils.isOnlySegmentInLine(document, lastSegment)) {
      foldingRanges.push(new vscode.FoldingRange(range.start.line, range.end.line));
    }

    foldingRanges.push(...this.getSegmentsFoldingRange(document, transactionSet.segments));

    return foldingRanges;
  }

  getSegmentsFoldingRange(document: vscode.TextDocument, segments: EdiSegment[]): vscode.FoldingRange[] {
    const foldingRanges: vscode.FoldingRange[] = [];
    for (const segment of segments) {
      if (segment.isLoop() && segment.Loop!.length > 0) {
        const firstSegment = getFirstNonLoopSegmentInSegments(segment.Loop!);
        const lastSegment = getLastNonLoopSegmentInSegments(segment.Loop!);
        const firstSegmentStartLine = EdiUtils.getSegmentStartPosition(document, firstSegment).line;
        const lastSegmentEndLine = EdiUtils.getSegmentEndPosition(document, lastSegment).line;
        if (firstSegmentStartLine === lastSegmentEndLine) continue;
        if (firstSegment && EdiUtils.isOnlySegmentInLine(document, firstSegment) && lastSegment && EdiUtils.isOnlySegmentInLine(document, lastSegment)) {
          foldingRanges.push(new vscode.FoldingRange(firstSegmentStartLine, lastSegmentEndLine));
          foldingRanges.push(...this.getSegmentsFoldingRange(document, segment.Loop!));
        }
      }
    }

    return foldingRanges;
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerFoldingRangeProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerFoldingRangeProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}

function getFirstNonLoopSegmentInSegments(segments: EdiSegment[]): EdiSegment {
  const firstSegment = segments[0];
  if (firstSegment.isLoop()) return getFirstNonLoopSegmentInSegments(firstSegment.Loop!);
  return firstSegment;
}

function getLastNonLoopSegmentInSegments(segments: EdiSegment[]): EdiSegment {
  const lastSegment = segments[segments.length - 1];
  if (lastSegment.isLoop()) return getLastNonLoopSegmentInSegments(lastSegment.Loop!);
  return lastSegment;
}
