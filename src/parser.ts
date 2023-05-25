import path = require("path");
import { EdiReleaseSchemaElement, EdiReleaseSchemaSegment, EdiSchema } from "./schemas/schemas";
import Utils from "./utils/utils";

export class EdifactParser {
  private _document: string;
  private _segments: EdiSegment[];
  private _ediVersion: EdiVersion;
  private _schema: EdiSchema;
  public constructor(document: string) {
    this._document = document;
  }

  public parseReleaseAndVersion(): EdiVersion {
    if (!this._ediVersion) {
      this._ediVersion = this.parseReleaseAndVersionInternal();
    }

    return this._ediVersion;
  }

  public parseReleaseAndVersionInternal(): EdiVersion {
    const ediVersion = new EdiVersion();
    let separater = this.escapeCharRegex("'");
    let regex = new RegExp(`\\b([\\s\\S]*?)(${separater})`, "g");
    let unhStr: string = null;
    let match: RegExpExecArray;
    while ((match = regex.exec(this._document)) !== null) {
      if (match[0].startsWith("UNH")) {
        unhStr = match[0];
        break;
      }
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

  public async parseMessage(): Promise<EdiMessage> {
    // await this.loadSchema();
    // TODO
    const segments = await this.parseSegments();
    const unb = segments.find(segment => segment.id === "UNB");
    const unh = segments.find(segment => segment.id === "UNH");
    if (!unb || !unh) {
      return null;
    }

    const ediMessage: EdiMessage = new EdiMessage();
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

  public async parseSegments(): Promise<EdiSegment[]> {
    if (!this._segments) {
      this._segments = await this.parseSegmentsInternal();
    }

    return this._segments;
  }

  private async parseSegmentsInternal(): Promise<EdiSegment[]> {
    let separater = this.escapeCharRegex("'");
    let regex = new RegExp(`\\b([\\s\\S]*?)(${separater})`, "g");
    let results = await this.parseRegex(regex, this._document, (x) =>
      this.parseSegment(x[0], x.index, x.index + x[0].length - 1, x[2])
    );

    return results;
  }

  public async parseSegment(segmentStr: string, startIndex: number, endIndex: number, endingDelimiter: string): Promise<EdiSegment> {
    await this.loadSchema();

    const segment = new EdiSegment();
    segment.endingDelimiter = endingDelimiter;
    segment.startIndex = startIndex;
    segment.endIndex = endIndex;
    segment.length = segmentStr.length;

    segment.id = segmentStr.substring(0, 3);
    segment.elements = [];

    segment.ediReleaseSchemaSegment = this._schema?.ediReleaseSchema?.getSegment(segment.id);

    if (segment.id === "UNA") {
      if (segmentStr.length !== 9) {
        return segment;
      }

      return await this.parseSegmentUNA(segment, segmentStr);
    }

    let element: EdiElement = null;
    let subElement: EdiElement = null;
    let elementIndex = 0;
    let subElementIndex = 0;
    let elementDesignator = null;
    for (let i = 3; i < segmentStr.length; i++) {
      const c: string = segmentStr[i];
      if (c === "+" || c === "'") {
        if (element) {
          element.endIndex = i - 1;
          element.value = segmentStr.substring(element.startIndex + 1, element.endIndex + 1);
          element = null;
        }

        if (subElement) {
          subElement.endIndex = i - 1;
          subElement.value = segmentStr.substring(subElement.startIndex + 1, subElement.endIndex + 1);
          subElement = null;
        }

        subElementIndex = 0;
      } else if (c === ":") {
        if (subElement) {
          subElement.endIndex = i - 1;
          subElement.value = segmentStr.substring(subElement.startIndex + 1, subElement.endIndex + 1);
          subElement = null;
        }
      }

      if (c === "+") {
        elementIndex++;
        element = new EdiElement();
        element.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1];
        element.type = ElementType.dataElement;
        element.startIndex = i;
        element.designatorIndex = this.pad(elementIndex, 2, "0");
        elementDesignator = element.designatorIndex;
        element.separator = "+";
        segment.elements.push(element);
        if (element.ediReleaseSchemaElement?.isComposite()) {
          element.components = [];
          subElementIndex++;
          subElement = new EdiElement();
          subElement.type = ElementType.componentElement;
          subElement.startIndex = i;
          subElement.designatorIndex = `${elementDesignator}${this.pad(subElementIndex, 2, "0")}`;
          subElement.segmentName = segment.id;
          subElement.separator = "+";
          subElement.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1]?.components[subElementIndex - 1];
          element.components = element.components || [];
          element.components.push(subElement);
        }
      } else if (c === ":") {
        subElementIndex++;
        subElement = new EdiElement();
        subElement.type = ElementType.componentElement;
        subElement.startIndex = i;
        subElement.designatorIndex = `${elementDesignator}${this.pad(subElementIndex, 2, "0")}`;
        subElement.segmentName = segment.id;
        subElement.separator = ":";
        subElement.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1]?.components[subElementIndex - 1];
        element.components = element.components || [];
        element.components.push(subElement);
      }
    }

    return segment;
  }

  private async parseSegmentUNA(segment: EdiSegment, segmentStr: string): Promise<EdiSegment> {
    await this.loadSchema();
    segment.elements = [];
    for (let i = 0; i < 6; i++) {
      const element = new EdiElement();
      element.value = segmentStr[i + 3];
      element.ediReleaseSchemaElement = this._schema?.ediReleaseSchema?.getSegment("UNA")?.elements[i];
      element.type = ElementType.dataElement;
      element.startIndex = i + 3;
      element.endIndex = i + 3;
      element.designatorIndex = this.pad(i + 1, 2, "0");
      element.separator = "";
      segment.elements.push(element);
    }

    return segment;
  }

  private async parseRegex<T>(exp: RegExp, str: string, selector: (match: RegExpExecArray) => Promise<T>): Promise<Array<T>> {
    let results: Array<T> = [];
    let match: RegExpExecArray;
    while ((match = exp.exec(str)) !== null) {
      results.push(await selector(match));
    }
    return results;
  }

  private async loadSchema(): Promise<EdiSchema> {
    if (!this._schema) {
      const ediVersion = this.parseReleaseAndVersion();
      if (!ediVersion || !ediVersion.release || !ediVersion.version) {
        return;
      }
      let releaseSchema = null;
      try {
        releaseSchema = await import(`./schemas/edifact/${ediVersion.release}/RSSBus_${ediVersion.release}.json`);
      } catch (ex) {
        return null;
      }

      const ediSchema = new EdiSchema(releaseSchema);
      this._schema = ediSchema;
    }

    return this._schema;
  }

  private escapeCharRegex(str: string): string {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  private pad(n: number, width: number, z: string = '0') {
      let nStr = n.toString() + '';
      return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
  }
}

export class EdiMessage {
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

  public buildUNBDescription(): string {
    let sender: string = this.sender?.trim(), recipient: string = this.recipient?.trim();

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

    return `From ${sender} to ${recipient} at ${this.datetime}`;
  }

  public buildUNHDescription(): string {
    if (!this.release || !this.type) {
      return "";
    }

    const messageInfo = Utils.getMessageInfoByDocumentType(this.type);
    if (!messageInfo) {
      return `${this.release}-${this.type}`;
    }

    return `${this.release}-${this.type}(${messageInfo.name}): ${messageInfo.introduction}`;
  }
}

export class EdiVersion {
  public release?: string; // D96A
  public version?: string; // ORDERS
}

export class EdiSegment {
  public startIndex: number;
  public endIndex: number;
  public length: number;
  public id: string;
  public elements: Array<EdiElement>;
  public endingDelimiter: string;
  public ediReleaseSchemaSegment: EdiReleaseSchemaSegment;

  public toString() {
    return `${this.id}${this.elements.join("")}${this.endingDelimiter}`;
  }

  public getElement(elementIndex: number, componentIndex: number | undefined = undefined): EdiElement | null {
    if (!this.elements || this.elements.length <= 0) {
      return null;
    }
    const element = this.elements[elementIndex - 1];
    if (!element) {
      return null;
    }
    if (componentIndex === undefined) {
      return element;
    }
    if (!element.components || element.components.length <= 0) {
      return null;
    }
    const component = element.components[componentIndex - 1];
    if (!component) {
      return null;
    }
    return component;
  }
}

export enum ElementType {
  dataElement = "Data Element",
  componentElement = "Component Element"
}

export class EdiElement {
  public type: ElementType;
  public value: string;
  public startIndex: number;
  public separator: string;
  public endIndex: number;
  public designatorIndex: string;
  public segmentName: string;
  public components: EdiElement[];
  public ediReleaseSchemaElement: EdiReleaseSchemaElement;

  public getDesignator() {
    return `${this.segmentName}${this.designatorIndex}`;
  }

  public toString() {
    return this.separator + this.value;
  }
}
