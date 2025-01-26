import { EdiSegment, EdiElement, ElementType, EdiMessageSeparators, type EdiStandardOptions, type EdiInterchangeMeta, type EdiFunctionalGroupMeta, type EdiTransactionSetMeta } from "./entities";
import { EdiParserBase } from "./ediParserBase";

export class VdaParser extends EdiParserBase {
  protected getCustomSegmentSchemaBuilder(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<void>) | undefined {
    return undefined;
  }

  protected getSegmentNameBySegmentStr(segmentStr: string): string {
    return segmentStr.substring(0, 3);
  }

  protected getCustomSegmentParser(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<EdiSegment>) | undefined {
    return async (segment, segmentStr) => {
      if (!segment.ediReleaseSchemaSegment?.elements) return segment;
      let segmentParseIndex = segmentId.length;
      for (let i = 0; i < segment.ediReleaseSchemaSegment.elements.length; i++) {
        const elementReleaseSchema = segment.ediReleaseSchemaSegment.elements[i];
        const elementStartIndex = segmentParseIndex;
        const elementEndIndex = elementStartIndex + elementReleaseSchema.length! - 1;
        const element = new EdiElement(
          segment,
          ElementType.dataElement,
          elementStartIndex,
          elementEndIndex,
          "",
          segment.id,
          segment.startIndex,
          this.pad(i + 1, 2, "0")
        );
        element.value = segmentStr.substring(elementStartIndex, elementEndIndex + 1);
        element.ediReleaseSchemaElement = elementReleaseSchema;
        segment.elements.push(element);
        segmentParseIndex += elementReleaseSchema.length!;
      }
      return segment;
    };
  }

  protected getSegmentRegex(): RegExp {
    const segmentSeparator = this.escapeCharRegex(this.getMessageSeparators().segmentSeparator!);
    let regexPattern = `(\\d){5}[\\s\\S]{123}`;
    return new RegExp(regexPattern, "g");
  }

  protected parseSeparators(): EdiMessageSeparators | null {
    const document = this.document.trim();
    if (!document || document.length < 128) {
      return null;
    }
    
    const charAt128 = document.charAt(128);
    if (charAt128 === "\n" || charAt128 === "\r") {
      const separators = new EdiMessageSeparators();
      separators.segmentSeparator = charAt128;
      return separators;
    }

    return null;
  }

  protected getDefaultMessageSeparators(): EdiMessageSeparators {
    return new EdiMessageSeparators();
  }

  protected parseInterchangeMeta(interchangeSegment: EdiSegment | undefined): EdiInterchangeMeta {
    const meta: EdiInterchangeMeta = {};
    return meta;
  }

  protected parseFunctionalGroupMeta(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment): EdiFunctionalGroupMeta {
    const meta: EdiFunctionalGroupMeta = {};
    return meta;
  }

  protected parseTransactionSetMeta(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment, transactionSetSegment: EdiSegment): EdiTransactionSetMeta {
    const meta: EdiTransactionSetMeta = {};
    const document = this.document.trim();
    if (document.length >= 3 + 2) {
      meta.release = document.substring(3, 5);
      meta.version = document.substring(0, 3);
    }

    if (document.length >= 3 + 2 + 9 + 9 + 5 + 5) {
      meta.id = document.substring(28, 33);
    }

    return meta;
  }
  
  protected getSchemaRootPath(): string {
    return "../schemas/vda";
  }

  protected getStardardOptions(): EdiStandardOptions {
    return {
    };
  }
}
