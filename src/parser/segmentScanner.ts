export type SegmentScannerToken = SegmentScannerCommentToken | SegmentScannerSegmentToken;

export interface SegmentScannerCommentToken {
  type: "comment";
  startIndex: number;
  endIndex: number;
  value: string;
}

export interface SegmentScannerSegmentToken {
  type: "segment";
  startIndex: number;
  endingDelimiter: string;
  value: string;
}

export class SegmentScanner {
  private remaining: string;

  constructor(
    private readonly document: string,
    private readonly segmentRegex: RegExp,
    private readonly commentRegex: RegExp
  ) {
    this.remaining = document;
  }

  next(): SegmentScannerToken | undefined {
    while (this.remaining.length > 0) {
      const commentMatch = this.commentRegex.exec(this.remaining);
      const segmentMatch = this.segmentRegex.exec(this.remaining);
      const lengthBeforeRemaining = this.document.length - this.remaining.length;

      if (commentMatch && commentMatch[0]) {
        const startIndex = lengthBeforeRemaining + commentMatch.index;
        const commentToken: SegmentScannerCommentToken = {
          type: "comment",
          startIndex,
          endIndex: startIndex + commentMatch[0].length - 1,
          value: commentMatch[0],
        };
        this.remaining = this.remaining.slice(commentMatch.index + commentMatch[0].length);
        this.resetRegexIndex();
        return commentToken;
      }

      if (segmentMatch) {
        if (segmentMatch.length <= 0 || !segmentMatch[0]) {
          return undefined;
        }

        const segmentToken: SegmentScannerSegmentToken = {
          type: "segment",
          startIndex: lengthBeforeRemaining + segmentMatch.index,
          endingDelimiter: segmentMatch[2],
          value: segmentMatch[0],
        };
        this.remaining = this.remaining.slice(segmentMatch.index + segmentMatch[0].length);
        this.resetRegexIndex();
        return segmentToken;
      }

      return undefined;
    }

    return undefined;
  }

  private resetRegexIndex(): void {
    this.commentRegex.lastIndex = 0;
    this.segmentRegex.lastIndex = 0;
  }
}
