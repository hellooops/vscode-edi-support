import { EdiVersion, EdiSegment, EdiElement, ElementType, EdiMessageSeparators } from "./entities";
import { EdiParserBase, IEdiMessage } from "./ediParserBase";
import Utils from "../utils/utils";
import { EdiReleaseSchemaSegment, EdiSchema } from "../schemas/schemas";

export class EdifactParser extends EdiParserBase {
  public getCustomSegmentParser(segmentId: string): (segment: EdiSegment, segmentStr: string) => Promise<EdiSegment> {
    if (segmentId === "UNA") {
      return async (segment, segmentStr) => {
        if (segmentStr.length !== 9) {
          return segment;
        }
  
        return await this.parseSegmentUNA(segment, segmentStr);
      };
    }
  }

  public getDefaultMessageSeparators(): EdiMessageSeparators {
    const separators = new EdiMessageSeparators();
    separators.segmentSeparator = "'";
    separators.dataElementSeparator = "+";
    separators.componentElementSeparator = ":";
    return separators;
  }

  public parseReleaseAndVersionInternal(): EdiVersion {
    const ediVersion = new EdiVersion();
    let separater = this.escapeCharRegex(this.getMessageSeparators().segmentSeparator);
    let regex = new RegExp(`\\b([\\s\\S]*?)(${separater})`, "g");
    let unhStr: string | undefined = undefined;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(this.document)) !== null) {
      if (match[0].startsWith("UNH")) {
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

  public async parseMessage(): Promise<IEdiMessage | undefined> {
    const segments = await this.parseSegments();
    const unb = segments.find(segment => segment.id === "UNB");
    const unh = segments.find(segment => segment.id === "UNH");
    if (!unb || !unh) {
      return undefined;
    }

    const ediMessage: EdifactEdiMessage = new EdifactEdiMessage();
    ediMessage.segments = segments;

    ediMessage.sender = unb.getElement(2, 1)?.value;
    ediMessage.senderQualifier = unb.getElement(2, 2)?.value;

    ediMessage.recipient = unb.getElement(3, 1)?.value;
    ediMessage.recipientQualifier = unb.getElement(3, 2)?.value;

    const date = unb.getElement(4, 1)?.value;
    const time = unb.getElement(4, 2)?.value;
    if (date && time) {
      ediMessage.datetime = `${Utils.yyMMddFormat(date)} ${Utils.HHmmFormat(time)}`;
    }

    ediMessage.communicationsAgreementID = unb.getElement(10)?.value;
    ediMessage.testIndicator = unb.getElement(11)?.value;

    ediMessage.referenceNumber = unh.getElement(1)?.value;
    ediMessage.type = unh.getElement(2, 1)?.value;
    ediMessage.release = `${unh.getElement(2, 2)?.value}${unh.getElement(2, 3)?.value}`;

    return ediMessage;
  }

  public getSchemaRootPath(): string {
    return "../schemas/edifact";
  }

  async afterSchemaLoaded(schema: EdiSchema): Promise<void> {
    const unh = schema.ediReleaseSchema?.getSegment("UNH");
    if (unh) {
      unh.desc = "Message header";
    }

    const unt = schema.ediReleaseSchema?.getSegment("UNT");
    if (unt) {
      unt.desc = "Message trailer";
    }

    if (schema.ediReleaseSchema?.segments) {
      schema.ediReleaseSchema.segments["UNA"] = EdiReleaseSchemaSegment.UNA;
      schema.ediReleaseSchema.segments["UNB"] = EdiReleaseSchemaSegment.UNB;
      schema.ediReleaseSchema.segments["UNZ"] = EdiReleaseSchemaSegment.UNZ;
    }
  }

  private async parseSegmentUNA(segment: EdiSegment, segmentStr: string): Promise<EdiSegment> {
    await this.loadSchema();
    segment.elements = [];
    if (segmentStr.length !== 9) {
      return;
    }

    const ediMessageSeparators = new EdiMessageSeparators();
    ediMessageSeparators.segmentSeparator = segmentStr[8];
    ediMessageSeparators.dataElementSeparator = segmentStr[4];
    ediMessageSeparators.componentElementSeparator = segmentStr[3];
    this._separators = ediMessageSeparators;

    for (let i = 0; i < 6; i++) {
      const element = new EdiElement();
      element.value = segmentStr[i + 3];
      element.ediReleaseSchemaElement = this.schema?.ediReleaseSchema?.getSegment("UNA")?.elements[i];
      element.type = ElementType.dataElement;
      element.startIndex = i + 3;
      element.endIndex = i + 3;
      element.designatorIndex = this.pad(i + 1, 2, "0");
      element.separator = "";
      segment.elements.push(element);
    }

    return segment;
  }
}

export class EdifactEdiMessage implements IEdiMessage {
  public sender?: string; // UNB02-01
  public senderQualifier?: string; // UNB02-02
  public recipient?: string; // UNB03-01
  public recipientQualifier?: string; // UNB03-02

  public datetime?: string; // UNB04-01 + UNB04-02
  public communicationsAgreementID?: string; // UNB10
  public testIndicator?: string; // UNB11

  public referenceNumber?: string; // UNH01
  public type?: string; // UNH02-01
  public release?: string; // UNH02-02 + UNH02-03
  public segments: EdiSegment[];

  public buildMessageDescriptions(): string[] {
    const descriptions: string[] = [];
    let sender: string | undefined = this.sender?.trim();
    let recipient: string | undefined = this.recipient?.trim();

    if (sender) {
      if (this.senderQualifier) {
        sender += `(${this.senderQualifier})`;
      }
    } else {
      sender = "Unknown";
    }

    if (recipient) {
      if (this.recipientQualifier) {
        recipient += `(${this.recipientQualifier})`;
      }
    } else {
      recipient = "Unknown";
    }

    descriptions.push(`From ${sender} to ${recipient} at ${this.datetime}`);

    let part2 = "";
    if (this.release && this.type) {
      const messageInfo = Utils.getMessageInfoByDocumentType(this.type);
      if (messageInfo) {
        part2 = `${this.release}-${this.type}(${messageInfo.name}): ${messageInfo.introduction}`;
      } else {
        part2 = `${this.release}-${this.type}`;
      }
    } else if (this.type) {
      const messageInfo = Utils.getMessageInfoByDocumentType(this.type);
      if (messageInfo) {
        part2 = `${this.type}(${messageInfo.name}): ${messageInfo.introduction}`;
      } else {
        part2 = `${this.type}`;
      }
    }

    if (part2) {
      descriptions.push(part2);
    }

    return descriptions;
  }
}
