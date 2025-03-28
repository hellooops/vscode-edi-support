import { EdiSegment, EdiElement, ElementType, EdiMessageSeparators, type EdiStandardOptions, type EdiInterchangeMeta, type EdiFunctionalGroupMeta, type EdiTransactionSetMeta, EdiType } from "./entities";
import { EdiParserBase } from "./ediParserBase";
import { EdiReleaseSchemaSegment, getMessageInfo } from "../schemas/schemas";
import * as constants from "../constants";

export class X12Parser extends EdiParserBase {
  protected ediType = EdiType.X12;

  protected getCustomSegmentParser(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<EdiSegment>) | undefined {
    if (segmentId === constants.ediDocument.x12.segment.ISA) {
      return async (segment, segmentStr) => {
        if (!segmentStr.length) {
          return segment;
        }
  
        return await this.parseSegmentISA(segment, segmentStr);
      };
    }
  }

  protected getCustomSegmentSchemaBuilder(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<void>) | undefined {
    if (segmentId === constants.ediDocument.x12.segment.ISA) {
      return async (segment) => {
        segment.ediReleaseSchemaSegment = EdiReleaseSchemaSegment.ISA;
      };
    } else if (segmentId === constants.ediDocument.x12.segment.IEA) {
      return async (segment) => {
        segment.ediReleaseSchemaSegment = EdiReleaseSchemaSegment.IEA;
      };
    } else if (segmentId === constants.ediDocument.x12.segment.GS) {
      return async (segment, segmentStr) => {
        const { segmentSeparator, dataElementSeparator } = <Required<EdiMessageSeparators>>this.getMessageSeparators();
        if (segmentStr.endsWith(segmentSeparator)) segmentStr = segmentStr.substring(0, segmentStr.length - segmentSeparator.length);
        const elementStrs = segmentStr.split(dataElementSeparator);
        const release = elementStrs.length >= 9 ? elementStrs[8] : undefined;
        if (this.isReleaseLt(release, "00401")) {
          segment.ediReleaseSchemaSegment = EdiReleaseSchemaSegment.GS_lt_00401;
        } else {
          segment.ediReleaseSchemaSegment = EdiReleaseSchemaSegment.GS_ge_00401;
        }
      };
    } else if (segmentId === constants.ediDocument.x12.segment.GE) {
      return async (segment) => {
        segment.ediReleaseSchemaSegment = EdiReleaseSchemaSegment.GE;
      };
    } else {
      return undefined;
    }
  }

  protected parseSeparators(): EdiMessageSeparators | null {
    const document = this.document.trim();
    if (!document || document.length < 106 || !document.startsWith(constants.ediDocument.x12.segment.ISA)) {
      return null;
    }

    const separators = new EdiMessageSeparators();
    separators.dataElementSeparator = document[3];
    const documentFrags = document.split(separators.dataElementSeparator);
    if (documentFrags.length < 17) {
      return null;
    }

    separators.segmentSeparator = documentFrags[16][1];
    separators.componentElementSeparator = documentFrags[16][0];
    
    return separators;
  }

  protected getDefaultMessageSeparators(): EdiMessageSeparators {
    const separators = new EdiMessageSeparators();
    separators.segmentSeparator = constants.ediDocument.x12.defaultSeparators.segmentSeparator;
    separators.dataElementSeparator = constants.ediDocument.x12.defaultSeparators.dataElementSeparator;
    separators.componentElementSeparator = constants.ediDocument.x12.defaultSeparators.componentElementSeparator;
    return separators;
  }

  protected parseInterchangeMeta(interchangeSegment: EdiSegment | undefined): EdiInterchangeMeta {
    // ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
    const meta: EdiInterchangeMeta = {};
    if (!interchangeSegment) return meta;
    if (interchangeSegment.elements.length > 4) meta.senderQualifer = interchangeSegment.elements[4].value;
    if (interchangeSegment.elements.length > 5) meta.senderID = interchangeSegment.elements[5].value;
    if (interchangeSegment.elements.length > 6) meta.receiverQualifer = interchangeSegment.elements[6].value;
    if (interchangeSegment.elements.length > 7) meta.receiverID = interchangeSegment.elements[7].value;
    if (interchangeSegment.elements.length > 8) meta.date = interchangeSegment.elements[8].value;
    if (interchangeSegment.elements.length > 9) meta.time = interchangeSegment.elements[9].value;
    if (interchangeSegment.elements.length > 12) meta.id = interchangeSegment.elements[12].value;
    return meta;
  }

  protected parseFunctionalGroupMeta(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment): EdiFunctionalGroupMeta {
    // ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
    // GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
    const meta: EdiFunctionalGroupMeta = {};
    if (!functionalGroupSegment) return meta;
    if (functionalGroupSegment.elements.length > 3) meta.date = functionalGroupSegment.elements[3].value;
    if (functionalGroupSegment.elements.length > 4) meta.time = functionalGroupSegment.elements[4].value;
    if (functionalGroupSegment.elements.length > 5) meta.id = functionalGroupSegment.elements[5].value;
    return meta;
  }

  protected parseTransactionSetMeta(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment, transactionSetSegment: EdiSegment): EdiTransactionSetMeta {
    // ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
    // GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
    // ST*850*0001~

    // Use GS segment to get edi release because ISA12 is a backward compatible release
    // see https://stackoverflow.com/questions/55401075/edi-headers-why-would-isa12-and-gs8-both-have-a-version-number
    // Eg: ISA segment version is 00400 while GS segment version is 00401
    const meta: EdiTransactionSetMeta = {};
    if (functionalGroupSegment && functionalGroupSegment.elements.length > 7) {
      meta.release = this.normalizeRelease(functionalGroupSegment.elements[7].value);
    }

    if (!meta.release) {
      if (interchangeSegment && interchangeSegment.elements.length > 11) {
        meta.release = this.normalizeRelease(interchangeSegment.elements[11].value);
      }
    }

    if (transactionSetSegment && transactionSetSegment.elements.length > 0) {
      meta.version = transactionSetSegment.elements[0].value;
      meta.messageInfo = getMessageInfo(meta.version);
    }

    if (transactionSetSegment && transactionSetSegment.elements.length > 1) {
      meta.id = transactionSetSegment.elements[1].value;
    }

    return meta;
  }

  private getElementValueByIndex(segmentStr: string, index: number): string | null {
    const segmentSeparator = this.escapeCharRegex(this.getMessageSeparators().segmentSeparator!);
    const dataElementSeparator = this.escapeCharRegex(this.getMessageSeparators().dataElementSeparator!);
    const regex = new RegExp(`(.*?${dataElementSeparator}){${index + 1}}(.*?)[${dataElementSeparator}|${segmentSeparator}]`, "g");
    const match = regex.exec(segmentStr);
    if (match) {
      return match[2];
    }

    return null;
  }
  
  protected getSchemaRootPath(): string {
    return "../schemas/x12";
  }

  private isReleaseLt(release: string | undefined, compareTo: string): boolean {
    if (!release || !compareTo) return false;
    return parseInt(release) < parseInt(compareTo);
  }

  private async parseSegmentISA(segment: EdiSegment, segmentStr: string): Promise<EdiSegment> {
    segment.elements = [];
    let cIndex = 3;

    const separators = <Required<EdiMessageSeparators>>this.getMessageSeparators();
    if (segmentStr.endsWith(separators.segmentSeparator)) {
      segmentStr = segmentStr.substring(0, segmentStr.length - 1);
    }
    
    const segmentFrags = segmentStr.split(separators.dataElementSeparator);
    if (segmentFrags.length < 1) {
      return segment;
    }

    segmentFrags.splice(0, 1);
    for (let i = 0; i < segmentFrags.length; i++) {
      const segmentFrag = segmentFrags[i];
      const elementLength = segmentFrag.length + 1;
      const element = new EdiElement(
        segment,
        ElementType.dataElement,
        cIndex,
        cIndex + elementLength - 1,
        separators.dataElementSeparator,
        segment.id,
        segment.startIndex,
        this.pad(i + 1, 2, "0")
      );
      element.ediReleaseSchemaElement = EdiReleaseSchemaSegment.ISA.elements[i];
      element.value = segmentStr.substring(cIndex + 1, cIndex + elementLength);
      segment.elements.push(element);
      cIndex += elementLength;
    }

    return segment;
  }

  protected getStardardOptions(): EdiStandardOptions {
    return {
      interchangeStartSegmentName: "ISA",
      interchangeEndSegmentName: "IEA",

      functionalGroupStartSegmentName: "GS",
      functionalGroupEndSegmentName: "GE",

      transactionSetStartSegmentName: "ST",
      transactionSetEndSegmentName: "SE",
    };
  }

  private normalizeRelease(value: string | undefined) {
    if (!value) return value;
    return value.substring(0, 5);
  }
}
