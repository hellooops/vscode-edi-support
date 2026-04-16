import {
  EdiDocument,
  EdiElement,
  EdiFunctionalGroup,
  EdiInterchange,
  EdiSegment,
  EdiTransactionSet,
} from "edi-parser";

function sanitizePart(value: string | number | undefined): string {
  if (value === undefined || value === "") {
    return "none";
  }

  return String(value).replace(/[^A-Za-z0-9_.-]/g, "_");
}

function getSegmentAbsoluteRange(segment: EdiSegment): { start: number; end: number } {
  if (!segment.isLoop()) {
    return {
      start: segment.startIndex,
      end: segment.endIndex,
    };
  }

  const flatSegments = segment.getSegments(true);
  const firstSegment = flatSegments[0];
  const lastSegment = flatSegments[flatSegments.length - 1];

  return {
    start: firstSegment?.startIndex ?? segment.startIndex,
    end: lastSegment?.endIndex ?? segment.endIndex,
  };
}

export function getSegmentNodeKey(segment: EdiSegment): string {
  const range = getSegmentAbsoluteRange(segment);
  const type = segment.isLoop() ? "loop" : "segment";
  return `${type}:${sanitizePart(segment.id)}:${range.start}:${range.end}`;
}

export function getElementNodeKey(segment: EdiSegment, element: EdiElement): string {
  const absoluteStart = segment.startIndex + element.startIndex;
  const absoluteEnd = segment.startIndex + element.endIndex;
  return `element:${sanitizePart(element.getDesignator())}:${absoluteStart}:${absoluteEnd}`;
}

export function getTransactionSetNodeKey(transactionSet: EdiTransactionSet): string {
  const firstSegment = transactionSet.getFirstSegment();
  const lastSegment = transactionSet.getLastSegment();
  return `transaction-set:${sanitizePart(transactionSet.getId())}:${firstSegment?.startIndex ?? -1}:${lastSegment?.endIndex ?? -1}`;
}

export function getFunctionalGroupNodeKey(functionalGroup: EdiFunctionalGroup): string {
  const firstSegment = functionalGroup.getFirstSegment();
  const lastSegment = functionalGroup.getLastSegment();
  return `functional-group:${sanitizePart(functionalGroup.getId())}:${firstSegment?.startIndex ?? -1}:${lastSegment?.endIndex ?? -1}`;
}

export function getInterchangeNodeKey(interchange: EdiInterchange): string {
  const firstSegment = interchange.getFirstSegment();
  const lastSegment = interchange.getLastSegment();
  return `interchange:${sanitizePart(interchange.getId())}:${firstSegment?.startIndex ?? -1}:${lastSegment?.endIndex ?? -1}`;
}

export function getDocumentSegmentNodeKeys(document: EdiDocument): string[] {
  return document.getSegments().map(segment => getSegmentNodeKey(segment));
}
