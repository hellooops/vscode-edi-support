import { EdiVersion, EdiSegment, EdiElement, ElementType, EdiMessageSeparators } from "./entities";
import { EdiSchema } from "../schemas/schemas";
import Utils from "../utils/utils";

export class X12Parser {
  private _document: string;
  private _segments: EdiSegment[];
  private _ediVersion: EdiVersion;
  private _schema: EdiSchema;
  public _separators?: EdiMessageSeparators;
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
    // ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~
    // GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~
    // ST*850*0001~
    const ediVersion = new EdiVersion();
    let separater = this.escapeCharRegex("~");
    let regex = new RegExp(`\\b([\\s\\S]*?)(${separater})`, "g");
    let isaStr: string | undefined = undefined;
    let stStr: string | undefined = undefined;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(this._document)) !== null) {
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

  public async parseMessage(): Promise<X12EdiMessage | undefined> {
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

  public async parseSegments(): Promise<EdiSegment[]> {
    if (!this._segments) {
      this._segments = await this.parseSegmentsInternal();
    }

    return this._segments;
  }

  private async parseSegmentsInternal(): Promise<EdiSegment[]> {
    let separater = this.escapeCharRegex("~");
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

    const firstElementSeparatorIndex = segmentStr.indexOf("*");
    segment.id = segmentStr.substring(0, firstElementSeparatorIndex);
    segment.elements = [];

    segment.ediReleaseSchemaSegment = this._schema?.ediReleaseSchema?.getSegment(segment.id);

    if (segment.id === "ISA") {
      if (segmentStr.length !== 106) {
        return segment;
      }

      return await this.parseSegmentISA(segment, segmentStr);
    }

    let element: EdiElement | undefined = undefined;
    let subElement: EdiElement | undefined = undefined;
    let elementIndex = 0;
    let subElementIndex = 0;
    let elementDesignator: string | undefined = undefined;
    const segmentSeparator = this.getSegmentSeparator();
    const dataElementSeparator = this.getDataElementSeparator();
    const componentElementSeparator = this.getComponentElementSeparator();
    for (let i = segment.id.length; i < segmentStr.length; i++) {
      const c: string = segmentStr[i];
      if (c === dataElementSeparator || c === segmentSeparator) {
        if (element) {
          element.endIndex = i - 1;
          element.value = segmentStr.substring(element.startIndex + 1, element.endIndex + 1);
          element = undefined;
        }

        if (subElement) {
          subElement.endIndex = i - 1;
          subElement.value = segmentStr.substring(subElement.startIndex + 1, subElement.endIndex + 1);
          subElement = undefined;
        }

        subElementIndex = 0;
      } else if (c === componentElementSeparator) {
        if (subElement) {
          subElement.endIndex = i - 1;
          subElement.value = segmentStr.substring(subElement.startIndex + 1, subElement.endIndex + 1);
          subElement = undefined;
        }
      }

      if (c === dataElementSeparator) {
        elementIndex++;
        element = new EdiElement();
        element.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1];
        element.type = ElementType.dataElement;
        element.startIndex = i;
        element.designatorIndex = this.pad(elementIndex, 2, "0");
        elementDesignator = element.designatorIndex;
        element.separator = dataElementSeparator;
        element.segmentName = segment.id;
        segment.elements.push(element);
        if (element.ediReleaseSchemaElement?.isComposite()) {
          element.components = [];
          subElementIndex++;
          subElement = new EdiElement();
          subElement.type = ElementType.componentElement;
          subElement.startIndex = i;
          subElement.designatorIndex = `${elementDesignator}${this.pad(subElementIndex, 2, "0")}`;
          subElement.segmentName = segment.id;
          subElement.separator = dataElementSeparator;
          subElement.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1]?.components[subElementIndex - 1];
          element.components = element.components || [];
          element.components.push(subElement);
        }
      } else if (c === componentElementSeparator) {
        subElementIndex++;
        subElement = new EdiElement();
        subElement.type = ElementType.componentElement;
        subElement.startIndex = i;
        subElement.designatorIndex = `${elementDesignator}${this.pad(subElementIndex, 2, "0")}`;
        subElement.segmentName = segment.id;
        subElement.separator = componentElementSeparator;
        subElement.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1]?.components[subElementIndex - 1];
        element!.components = element!.components || [];
        element!.components.push(subElement);
      }
    }

    return segment;
  }

  public setEdiVersion(ediVersion: EdiVersion) {
    this._ediVersion = ediVersion;
  }

  public getMessageSeparator(): EdiMessageSeparators {
    return this._separators;
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
      element.ediReleaseSchemaElement = this._schema?.ediReleaseSchema?.getSegment("ISA")?.elements[i];
      const elementLength = element.ediReleaseSchemaElement.minLength + 1;
      element.value = segmentStr.substring(cIndex + 1, cIndex + elementLength);
      element.type = ElementType.dataElement;
      element.startIndex = cIndex;
      element.endIndex = cIndex + elementLength - 1;
      element.designatorIndex = this.pad(i + 1, 2, "0");
      element.separator = this.getDataElementSeparator();
      segment.elements.push(element);
      cIndex += elementLength;
    }

    return segment;
  }

  private async parseRegex<T>(exp: RegExp, str: string, selector: (match: RegExpExecArray) => Promise<T>): Promise<Array<T>> {
    let results: Array<T> = [];
    let match: RegExpExecArray | null;
    while ((match = exp.exec(str)) !== null) {
      results.push(await selector(match));
    }
    return results;
  }

  private async loadSchema(): Promise<void> {
    if (this._schema) {
      return;
    }

    const ediVersion = this.parseReleaseAndVersion();
    if (!ediVersion || !ediVersion.release || !ediVersion.version) {
      return;
    }
    let releaseSchema = null;
    try {
      releaseSchema = await import(`../schemas/x12/${ediVersion.release}/RSSBus_${ediVersion.release}.json`);
    } catch (ex) {
      console.error("Failed to import schema: ", ex);
      return;
    }

    const ediSchema = new EdiSchema(releaseSchema);
    this._schema = ediSchema;
  }

  private getDataElementSeparator(): string {
    return this._separators ? this._separators.dataElementSeparator : "*";
  }

  private getComponentElementSeparator(): string {
    return this._separators ? this._separators.componentElementSeparator : ">";
  }

  private getSegmentSeparator(): string {
    return this._separators ? this._separators.segmentSeparator : "~";
  }

  private escapeCharRegex(str: string): string {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  private pad(n: number, width: number, z: string = '0') {
      let nStr = n.toString() + '';
      return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
  }
}

export class X12EdiMessage {
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
