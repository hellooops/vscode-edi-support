import { EdiVersion, EdiSegment, EdiElement, ElementType, EdiMessageSeparators } from "./entities";
import { EdiParserBase, IEdiMessage } from "./ediParserBase";
import Utils from "../utils/utils";

export class X12Parser extends EdiParserBase {
  public getCustomSegmentParser(segmentId: string): (segment: EdiSegment, segmentStr: string) => Promise<EdiSegment> {
    if (segmentId === "ISA") {
      return async (segment, segmentStr) => {
        if (segmentStr.length !== 106) {
          return segment;
        }
  
        return await this.parseSegmentISA(segment, segmentStr);
      };
    }
  }

  public getDefaultMessageSeparators(): EdiMessageSeparators {
    const separators = new EdiMessageSeparators();
    separators.segmentSeparator = "~";
    separators.dataElementSeparator = "*";
    separators.componentElementSeparator = ":";
    return separators;
  }

  public parseReleaseAndVersionInternal(): EdiVersion {
    // ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
    // GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
    // ST*850*0001~
    const ediVersion = new EdiVersion();
    let separater = this.escapeCharRegex(this.getMessageSeparators().segmentSeparator);
    let regex = new RegExp(`\\b([\\s\\S]*?)(${separater})`, "g");
    let isaStr: string | undefined = undefined;
    let stStr: string | undefined = undefined;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(this.document)) !== null) {
      if (match[0].startsWith("ISA")) {
        isaStr = match[0];
        if (isaStr && stStr) {
          break;
        }
      } else if (match[0].startsWith("ST")) {
        stStr = match[0];
        if (isaStr && stStr) {
          break;
        }
      }
    }

    if(isaStr) {
      const isaSegmentFrags: string[] = isaStr.split(/\*/);
      if (isaSegmentFrags.length >= 13) {
        ediVersion.release = isaSegmentFrags[12];
      }
    }

    if(stStr) {
      const stSegmentFrags: string[] = stStr.split(/\*/);
      if (stSegmentFrags.length >= 2) {
        ediVersion.version = stSegmentFrags[1];
      }
    }

    return ediVersion;
  }

  public async parseMessage(): Promise<IEdiMessage | undefined> {
    const segments = await this.parseSegments();
    const isa = segments.find(segment => segment.id === "ISA");
    const st = segments.find(segment => segment.id === "ST");
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

  private async parseSegmentISA(segment: EdiSegment, segmentStr: string): Promise<EdiSegment> {
    await this.loadSchema();
    segment.elements = [];
    let cIndex = 3;
    if (segmentStr.length !== 106) {
      return;
    }

    const ediMessageSeparators = new EdiMessageSeparators();
    ediMessageSeparators.segmentSeparator = segmentStr[105];
    ediMessageSeparators.dataElementSeparator = segmentStr[3];
    ediMessageSeparators.componentElementSeparator = segmentStr[104];
    this._separators = ediMessageSeparators;

    for (let i = 0; i < 16; i++) {
      const element = new EdiElement();
      element.ediReleaseSchemaElement = this.schema?.ediReleaseSchema?.getSegment("ISA")?.elements[i];
      const elementLength = element.ediReleaseSchemaElement.minLength + 1;
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
