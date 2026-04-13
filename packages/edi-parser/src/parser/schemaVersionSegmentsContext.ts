import { EdiSegment } from "./entities";
import { EdiVersionSegment } from "../schemas/schemas";

export class SchemaVersionSegmentsContext {
  ediVersionSegments: EdiVersionSegment[];
  isLoop: boolean;

  constructor(ediVersionSegments: EdiVersionSegment[], isLoop: boolean = false) {
    this.ediVersionSegments = ediVersionSegments;
    this.isLoop = isLoop;
  }

  build(segments: EdiSegment[]): EdiSegment[] {
    const result: EdiSegment[] = [];
    for (let i = 0; i < this.ediVersionSegments.length; i++) {
      const ediVersionSegment = this.ediVersionSegments[i];
      let segmentMatchTimes = 0;
      const isFirstSegmentInLoop = i === 0 && this.isLoop;
      while (true) {
        if (segments.length === 0) {
          return result;
        }

        if (segments[0].isHeaderSegment()) {
          result.push(segments.shift()!);
          continue;
        }

        if (ediVersionSegment.isLoop()) {
          // loop
          const loopContext = new SchemaVersionSegmentsContext(ediVersionSegment.Loop!, true);
          const loopResult = loopContext.build(segments);
          if (!loopResult || loopResult.length <= 0) {
            break;
          }

          const loopFirstChild = loopResult[0];
          const loopLastChild = loopResult[loopResult.length - 1];
          const loopSegment = new EdiSegment(
            ediVersionSegment.Id,
            loopFirstChild.startIndex,
            loopLastChild.endIndex,
            loopResult.reduce((acc, cur) => acc + cur.length, 0),
            loopLastChild.endingDelimiter
          );
          loopSegment.Loop = loopResult;
          loopResult.forEach(i => i.parentSegment = loopSegment);
          result.push(loopSegment);
          segmentMatchTimes++;
          if (segmentMatchTimes >= ediVersionSegment.getMax()) {
            break;
          }
        } else {
          // non loop
          if (ediVersionSegment.Id === segments[0].id) {
            // segment match
            const segment = segments.shift()!;
            result.push(segment);
            segmentMatchTimes++;

            if (segmentMatchTimes >= ediVersionSegment.getMax()) {
              if (isFirstSegmentInLoop) {
                break;
              }
            }

            if (segmentMatchTimes > ediVersionSegment.getMax()) {
              segment.segmentMaximumOccurrencesExceed = {
                expect: ediVersionSegment.getMax(),
                actual: segmentMatchTimes
              };
            }
          } else {
            // segment not match
            if (isFirstSegmentInLoop) {
              // if the first child segment in loop does not match, break
              return result;
            }

            break;
          }
        }
      }
    }

    if (segments.length > 0 && !this.isLoop) {
      result.push(...segments);
    }

    return result;
  }
}
