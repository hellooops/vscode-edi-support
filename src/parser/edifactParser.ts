import { EdiVersion, EdiSegment, EdiElement, ElementType, EdiMessageSeparators, type EdiStandardOptions } from "./entities";
import { EdiParserBase } from "./ediParserBase";
import { EdiReleaseSchemaSegment } from "../schemas/schemas";
import * as constants from "../constants";

export class EdifactParser extends EdiParserBase {
  protected getCustomSegmentParser(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<EdiSegment>) | undefined {
    if (segmentId === constants.ediDocument.edifact.segment.UNA) {
      return async (segment, segmentStr) => {
        if (segmentStr.length !== 9) {
          return segment;
        }
  
        return await this.parseSegmentUNA(segment, segmentStr);
      };
    }
  }

  protected getCustomSegmentSchemaBuilder(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<void>) | undefined {
    if (segmentId === constants.ediDocument.edifact.segment.UNA) {
      return async (segment) => {
        segment.ediReleaseSchemaSegment = EdiReleaseSchemaSegment.UNA;
      };
    } else if (segmentId === constants.ediDocument.edifact.segment.UNB) {
      return async (segment) => {
        segment.ediReleaseSchemaSegment = EdiReleaseSchemaSegment.UNB;
      };
    } else if (segmentId === constants.ediDocument.edifact.segment.UNZ) {
      return async (segment) => {
        segment.ediReleaseSchemaSegment = EdiReleaseSchemaSegment.UNZ;
      };
    } else if (segmentId === constants.ediDocument.edifact.segment.UNH) {
      return async (segment) => {
        if (segment.ediReleaseSchemaSegment) segment.ediReleaseSchemaSegment.desc = "Message header";
      };
    } else if (segmentId === constants.ediDocument.edifact.segment.UNT) {
      return async (segment) => {
        if (segment.ediReleaseSchemaSegment) segment.ediReleaseSchemaSegment.desc = "Message trailer";
      };
    } else {
      return undefined;
    }
  }

  protected parseSeparators(): EdiMessageSeparators | null {
    const document = this.document.trim();
    if (!document || document.length < 9 || !document.startsWith(constants.ediDocument.edifact.segment.UNA)) {
      return null;
    }

    const ediMessageSeparators = new EdiMessageSeparators();
    ediMessageSeparators.segmentSeparator = document[8];
    ediMessageSeparators.dataElementSeparator = document[4];
    ediMessageSeparators.componentElementSeparator = document[3];
    ediMessageSeparators.releaseCharacter = document[6];
    this._separators = ediMessageSeparators;
    
    return ediMessageSeparators;
  }

  protected getDefaultMessageSeparators(): EdiMessageSeparators {
    const separators = new EdiMessageSeparators();
    separators.segmentSeparator = constants.ediDocument.edifact.defaultSeparators.segmentSeparator;
    separators.dataElementSeparator = constants.ediDocument.edifact.defaultSeparators.dataElementSeparator;
    separators.componentElementSeparator = constants.ediDocument.edifact.defaultSeparators.componentElementSeparator;
    separators.releaseCharacter = constants.ediDocument.edifact.defaultSeparators.releaseCharacter;
    return separators;
  }

  protected parseReleaseAndVersionInternal(): EdiVersion {
    const ediVersion = new EdiVersion();
    let separater = this.escapeCharRegex(this.getMessageSeparators().segmentSeparator!);
    let regex = new RegExp(`\\b([\\s\\S]*?)(${separater})`, "g");
    let unhStr: string | undefined = undefined;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(this.document)) !== null) {
      if (match[0].startsWith(constants.ediDocument.edifact.segment.UNH)) {
        unhStr = match[0];
        break;
      }
    }

    if (!unhStr) {
      return ediVersion;
    }

    // UNH+1+ORDERS:D:96A:UN:EAN008'
    const segmentFrags: string[] = unhStr.split(/[+:]/);
    if (segmentFrags.length >= 3) {
      ediVersion.version = segmentFrags[2];
    }

    if (segmentFrags.length >= 5) {
      ediVersion.release = segmentFrags[3] + segmentFrags[4];
    }

    return ediVersion;
  }

  protected getSchemaRootPath(): string {
    return "../schemas/edifact";
  }

  private async parseSegmentUNA(segment: EdiSegment, segmentStr: string): Promise<EdiSegment> {
    segment.elements = [];
    const ediMessageSeparators = new EdiMessageSeparators();
    ediMessageSeparators.segmentSeparator = segmentStr[8];
    ediMessageSeparators.dataElementSeparator = segmentStr[4];
    ediMessageSeparators.componentElementSeparator = segmentStr[3];
    ediMessageSeparators.releaseCharacter = segmentStr[6];
    this._separators = ediMessageSeparators;

    for (let i = 0; i < 5; i++) {
      const element = new EdiElement(
        segment,
        ElementType.dataElement,
        i + 3,
        i + 3,
        "",
        segment.id,
        segment.startIndex,
        this.pad(i + 1, 2, "0")
      );
      element.value = segmentStr[i + 3];
      element.ediReleaseSchemaElement = EdiReleaseSchemaSegment.UNA.elements[i];
      segment.elements.push(element);
    }

    return segment;
  }

  protected getStardardOptions(): EdiStandardOptions {
    return {
      separatorsSegmentName: "UNA",

      interchangeStartSegmentName: "UNB",
      interchangeEndSegmentName: "UNZ",

      isFunctionalGroupSupport: false,
      functionalGroupStartSegmentName: undefined,
      functionalGroupEndSegmentName: undefined,

      transactionSetStartSegmentName: "UNH",
      transactionSetEndSegmentName: "UNT",
    };
  }
}
