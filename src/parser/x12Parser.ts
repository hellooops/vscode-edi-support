import { EdiVersion, EdiSegment, EdiElement, ElementType, EdiMessageSeparators } from "./entities";
import { EdiParserBase, IEdiMessage } from "./ediParserBase";
import Utils from "../utils/utils";
import { EdiReleaseSchemaSegment, EdiSchema } from "../schemas/schemas";
import * as constants from "../constants";

export class X12Parser extends EdiParserBase {
  public getCustomSegmentParser(segmentId: string): (segment: EdiSegment, segmentStr: string) => Promise<EdiSegment> {
    if (segmentId === constants.ediDocument.x12.segment.ISA) {
      return async (segment, segmentStr) => {
        if (!segmentStr.length) {
          return segment;
        }
  
        return await this.parseSegmentISA(segment, segmentStr);
      };
    }
  }

  parseSeparators(): EdiMessageSeparators | null {
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

  public getDefaultMessageSeparators(): EdiMessageSeparators {
    const separators = new EdiMessageSeparators();
    separators.segmentSeparator = constants.ediDocument.x12.defaultSeparators.segmentSeparator;
    separators.dataElementSeparator = constants.ediDocument.x12.defaultSeparators.dataElementSeparator;
    separators.componentElementSeparator = constants.ediDocument.x12.defaultSeparators.componentElementSeparator;
    return separators;
  }

  public async parseReleaseAndVersionInternal(): Promise<EdiVersion> {
    // ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
    // GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
    // ST*850*0001~
    const ediVersion = new EdiVersion();
    const segments = await this.parseSegments(true);

    // Use GS segment to get edi release because ISA12 is a backward compatible release, see https://stackoverflow.com/questions/55401075/edi-headers-why-would-isa12-and-gs8-both-have-a-version-number
    // Eg: ISA segment version is 00400 while GS segment version is 00401
    const gsSegment = segments.find(s => s.id === constants.ediDocument.x12.segment.GS);
    if (gsSegment && gsSegment.elements && gsSegment.elements.length >= 8) {
      const gsEdiRelease = gsSegment.elements[7].value;
      if (gsEdiRelease && gsEdiRelease.length >= 6) {
        ediVersion.release = gsEdiRelease.substring(0, 5);
      }
    }

    if (!ediVersion.release) {
      const isaSegment = segments.find(s => s.id === constants.ediDocument.x12.segment.ISA);
      if (!isaSegment || !isaSegment.elements || isaSegment.elements.length < 12) {
        return ediVersion;
      }
  
      ediVersion.release = isaSegment.elements[11].value;
    }

    const stSegment = segments.find(s => s.id === constants.ediDocument.x12.segment.ST);
    if (!stSegment || !stSegment.elements || stSegment.elements.length < 1) {
      return ediVersion;
    }

    ediVersion.version = stSegment.elements[0].value;
    return ediVersion;
  }

  public async parseMessage(): Promise<IEdiMessage | undefined> {
    const segments = await this.parseSegments();
    const isa = segments.find(segment => segment.id === constants.ediDocument.x12.segment.ISA);
    const st = segments.find(segment => segment.id === constants.ediDocument.x12.segment.ST);
    if (!isa || !st) {
      return undefined;
    }

    const ediMessage: X12EdiMessage = new X12EdiMessage();
    ediMessage.segments = segments;

    ediMessage.sender = isa.getElement(6)?.value?.trim();
    ediMessage.senderQualifier = isa.getElement(5)?.value;

    ediMessage.recipient = isa.getElement(8)?.value.trim();
    ediMessage.recipientQualifier = isa.getElement(7)?.value;

    const date = isa.getElement(9)?.value;
    const time = isa.getElement(10)?.value;
    if (date && time) {
      ediMessage.datetime = `${Utils.yyMMddFormat(date)} ${Utils.HHmmFormat(time)}`;
    }

    ediMessage.release = isa.getElement(12)?.value;
    ediMessage.type = st.getElement(1)?.value;

    return ediMessage;
  }
  
  public getSchemaRootPath(): string {
    return "../schemas/x12";
  }

  async afterSchemaLoaded(schema: EdiSchema, ediVersion: EdiVersion): Promise<void> {
    if (schema.ediReleaseSchema?.segments) {
      schema.ediReleaseSchema.segments[constants.ediDocument.x12.segment.ISA] = EdiReleaseSchemaSegment.ISA;
      if (this.isReleaseLt(ediVersion.release, "00401")) {
        schema.ediReleaseSchema.segments[constants.ediDocument.x12.segment.GS] = EdiReleaseSchemaSegment.GS_lt_00401;
      } else {
        schema.ediReleaseSchema.segments[constants.ediDocument.x12.segment.GS] = EdiReleaseSchemaSegment.GS_ge_00401;
      }

      schema.ediReleaseSchema.segments[constants.ediDocument.x12.segment.GE] = EdiReleaseSchemaSegment.GE;
      schema.ediReleaseSchema.segments[constants.ediDocument.x12.segment.IEA] = EdiReleaseSchemaSegment.IEA;
    }
  }

  private isReleaseLt(release: string, compareTo: string): boolean {
    if (!release || !compareTo) return false;
    return parseInt(release) < parseInt(compareTo);
  }

  private async parseSegmentISA(segment: EdiSegment, segmentStr: string): Promise<EdiSegment> {
    if (!segmentStr) {
      return;
    }

    await this.loadSchema();
    segment.elements = [];
    let cIndex = 3;

    const separators = this.getMessageSeparators();
    if (segmentStr.endsWith(separators.segmentSeparator)) {
      segmentStr = segmentStr.substring(0, segmentStr.length - 1);
    }
    
    const segmentFrags = segmentStr.split(separators.dataElementSeparator);
    if (segmentFrags.length < 1) {
      return segment;
    }

    segmentFrags.splice(0, 1);
    for (let i = 0; i < segmentFrags.length; i++) {
      const element = new EdiElement();
      element.segmentName = segment.id;
      const segmentFrag = segmentFrags[i];
      element.ediReleaseSchemaElement = this.schema?.ediReleaseSchema?.getSegment(constants.ediDocument.x12.segment.ISA)?.elements[i];
      const elementLength = segmentFrag.length + 1;
      element.value = segmentStr.substring(cIndex + 1, cIndex + elementLength);
      element.type = ElementType.dataElement;
      element.startIndex = cIndex;
      element.endIndex = cIndex + elementLength - 1;
      element.designatorIndex = this.pad(i + 1, 2, "0");
      element.separator = this.getMessageSeparators().dataElementSeparator;
      segment.elements.push(element);
      cIndex += elementLength;
    }

    return segment;
  }
}

export class X12EdiMessage implements IEdiMessage {
  public sender?: string; // ISA06
  public senderQualifier?: string; // ISA05
  public recipient?: string; // ISA08
  public recipientQualifier?: string; // ISA07

  public datetime?: string; // ISA09 + ISA10

  public type?: string; // ST01
  public release?: string; // ISA12
  public segments: EdiSegment[];

  public buildIsaDescription(): string {
    return "TODO: Deric";
  }

  public buildUNHDescription(): string {
    return "TODO: Deric";
  }
}
