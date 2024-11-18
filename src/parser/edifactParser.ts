import { EdiSegment, EdiElement, ElementType, EdiMessageSeparators, type EdiStandardOptions, type EdiInterchangeMeta, type EdiFunctionalGroupMeta, type EdiTransactionSetMeta } from "./entities";
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

  protected parseInterchangeMeta(interchangeSegment: EdiSegment | undefined): EdiInterchangeMeta {
    // UNB+UNOA:2+<Sender GLN>:14+<Receiver GLN>:14+140407:0910+0001'
    const meta: EdiInterchangeMeta = {};
    if (!interchangeSegment) return meta;
    if (interchangeSegment.elements.length > 1) {
      const dataEle = interchangeSegment.elements[1];
      if (dataEle.components) {
        if (dataEle.components.length > 0) meta.senderID = dataEle.components[0].value;
        if (dataEle.components.length > 1) meta.senderQualifer = dataEle.components[1].value;
      }
    }
    if (interchangeSegment.elements.length > 2) {
      const dataEle = interchangeSegment.elements[2];
      if (dataEle.components) {
        if (dataEle.components.length > 0) meta.receiverID = dataEle.components[0].value;
        if (dataEle.components.length > 1) meta.receiverQualifer = dataEle.components[1].value;
      }
    }
    if (interchangeSegment.elements.length > 3) {
      const dataEle = interchangeSegment.elements[3];
      if (dataEle.components) {
        if (dataEle.components.length > 0) meta.date = dataEle.components[0].value;
        if (dataEle.components.length > 1) meta.time = dataEle.components[1].value;
      }
    }
    if (interchangeSegment.elements.length > 4) meta.id = interchangeSegment.elements[4].value;
    return meta;
  }

  protected parseFunctionalGroupMeta(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment): EdiFunctionalGroupMeta {
    // Fake
    return {};
  }

  protected parseTransactionSetMeta(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment, transactionSetSegment: EdiSegment): EdiTransactionSetMeta {
    // UNH+003+ORDERS:D:96A:UN:EAN001'
    const meta: EdiTransactionSetMeta = {};
    if (transactionSetSegment && transactionSetSegment.elements.length > 0) {
      meta.id = transactionSetSegment.elements[0].value;
    }

    if (transactionSetSegment && transactionSetSegment.elements.length > 1) {
      const eles = transactionSetSegment.elements[1].components!;
      if (eles.length > 0) meta.version = eles[0].value;
      if (eles.length > 2) meta.release = `${eles[1].value}${eles[2].value}`;
    }

    return meta;
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
