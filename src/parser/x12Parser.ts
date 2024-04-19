import { EdiVersion, EdiSegment, EdiElement, ElementType, EdiMessageSeparators } from "./entities";
import { EdiParserBase } from "./ediParserBase";
import { EdiReleaseSchemaSegment, EdiSchema } from "../schemas/schemas";
import * as constants from "../constants";

export class X12Parser extends EdiParserBase {
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

  protected parseReleaseAndVersionInternal(): EdiVersion {
    // ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
    // GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
    // ST*850*0001~

    // Use GS segment to get edi release because ISA12 is a backward compatible release
    // see https://stackoverflow.com/questions/55401075/edi-headers-why-would-isa12-and-gs8-both-have-a-version-number
    // Eg: ISA segment version is 00400 while GS segment version is 00401
    const ediVersion = new EdiVersion();
    const gsSegmentStr = this.getSegmentByRegex(constants.ediDocument.x12.segment.GS);
    if (gsSegmentStr) {
      const gsEdiRelease = this.getElementValueByIndex(gsSegmentStr, 7);
      if (gsEdiRelease && gsEdiRelease?.length >= 5) {
        ediVersion.release = gsEdiRelease.substring(0, 5);
      }
    }
    
    if (!ediVersion.release) {
      const isaSegmentStr = this.getSegmentByRegex(constants.ediDocument.x12.segment.ISA);
      if (isaSegmentStr) {
        const isaEdiRelease = this.getElementValueByIndex(isaSegmentStr, 11);
        if (isaEdiRelease) {
          ediVersion.release = isaEdiRelease;
        }
      }
    }

    if (!ediVersion.release) {
      return ediVersion;
    }

    const stSegmentStr = this.getSegmentByRegex(constants.ediDocument.x12.segment.ST);
    if (stSegmentStr) {
      const stEdiVersion = this.getElementValueByIndex(stSegmentStr, 0);
      if (stEdiVersion) {
        ediVersion.version = stEdiVersion;
      }
    }

    return ediVersion;
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

  private isReleaseLt(release: string | undefined, compareTo: string): boolean {
    if (!release || !compareTo) return false;
    return parseInt(release) < parseInt(compareTo);
  }

  private async parseSegmentISA(segment: EdiSegment, segmentStr: string): Promise<EdiSegment> {
    await this.loadSchema();
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
        ElementType.dataElement,
        cIndex,
        cIndex + elementLength - 1,
        separators.dataElementSeparator,
        segment.id,
        segment.startIndex,
        this.pad(i + 1, 2, "0")
      );
      element.ediReleaseSchemaElement = this.schema?.ediReleaseSchema?.getSegment(constants.ediDocument.x12.segment.ISA)?.elements[i];
      element.value = segmentStr.substring(cIndex + 1, cIndex + elementLength);
      segment.elements.push(element);
      cIndex += elementLength;
    }

    return segment;
  }
}
