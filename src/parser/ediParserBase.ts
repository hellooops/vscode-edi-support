import { EdiVersion, EdiSegment, EdiElement, ElementType, EdiMessageSeparators } from "./entities";
import { EdiSchema } from "../schemas/schemas";

export abstract class EdiParserBase {
  private _segments: EdiSegment[];
  private _ediVersion: EdiVersion;
  document: string;
  schema: EdiSchema;
  _separators?: EdiMessageSeparators;
  public constructor(document: string) {
    this.document = document;
  }

  public parseReleaseAndVersion(): EdiVersion {
    if (!this._ediVersion) {
      this._ediVersion = this.parseReleaseAndVersionInternal();
    }

    return this._ediVersion;
  }

  public abstract parseReleaseAndVersionInternal(): EdiVersion;

  public abstract parseMessage(): Promise<IEdiMessage | undefined>;

  public async parseSegments(): Promise<EdiSegment[]> {
    if (!this._segments) {
      this._segments = await this.parseSegmentsInternal();
    }

    return this._segments;
  }

  private async parseSegmentsInternal(): Promise<EdiSegment[]> {
    let separater = this.escapeCharRegex(this.getMessageSeparators().segmentSeparator!);
    let regex = new RegExp(`\\b([\\s\\S]*?)(${separater})`, "g");

    const results: EdiSegment[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(this.document)) !== null) {
      try {
        const ediSegment = await this.parseSegment(match[0], match.index, match.index + match[0].length - 1, match[2]);
        if (ediSegment) {
          results.push(ediSegment);
        }
      } catch (ex: any) {
        console.error("Edi Support Error", ex);
      }
    }
    return results;
  }

  public async parseSegment(segmentStr: string, startIndex: number, endIndex: number, endingDelimiter: string): Promise<EdiSegment> {
    await this.loadSchema();

    const segment = new EdiSegment();
    segment.endingDelimiter = endingDelimiter;
    segment.startIndex = startIndex;
    segment.endIndex = endIndex;
    segment.length = segmentStr.length;

    const firstElementSeparatorIndex = /\W/.exec(segmentStr)?.index ?? segmentStr.length - 1;
    segment.id = segmentStr.substring(0, firstElementSeparatorIndex);
    segment.elements = [];

    segment.ediReleaseSchemaSegment = this.schema?.ediReleaseSchema?.getSegment(segment.id);

    const customSegmentParser = this.getCustomSegmentParser(segment.id);
    if (customSegmentParser) {
      return await customSegmentParser(segment, segmentStr);
    }

    let element: EdiElement | undefined = undefined;
    let subElement: EdiElement | undefined = undefined;
    let elementIndex = 0;
    let subElementIndex = 0;
    let elementDesignator: string | undefined = undefined;
    const segmentSeparator = this.getMessageSeparators().segmentSeparator;
    const dataElementSeparator = this.getMessageSeparators().dataElementSeparator;
    const componentElementSeparator = this.getMessageSeparators().componentElementSeparator;
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

  public abstract getCustomSegmentParser(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<EdiSegment>) | undefined;

  public setEdiVersion(ediVersion: EdiVersion) {
    this._ediVersion = ediVersion;
  }

  public getMessageSeparators(): EdiMessageSeparators {
    if (!this._separators) {
      this._separators = this.parseSeparators();
    }

    if (!this._separators) {
      return this.getDefaultMessageSeparators();
    }
    
    return this._separators;
  }

  abstract parseSeparators(): EdiMessageSeparators | null;

  public abstract getDefaultMessageSeparators(): EdiMessageSeparators;

  private async parseRegex<T>(exp: RegExp, str: string, selector: (match: RegExpExecArray) => Promise<T>): Promise<Array<T>> {
    let results: Array<T> = [];
    let match: RegExpExecArray | null;
    while ((match = exp.exec(str)) !== null) {
      results.push(await selector(match));
    }
    return results;
  }

  public abstract getSchemaRootPath(): string;

  async loadSchema(): Promise<void> {
    if (this.schema) {
      return;
    }

    const ediVersion = this.parseReleaseAndVersion();
    if (!ediVersion || !ediVersion.release || !ediVersion.version) {
      return;
    }
    let releaseSchema = null;
    try {
      releaseSchema = await import(`${this.getSchemaRootPath()}/${ediVersion.release}/RSSBus_${ediVersion.release}.json`);
    } catch (ex) {
      console.error("Failed to import schema: ", ex);
      return;
    }

    const ediSchema = new EdiSchema(releaseSchema);
    await this.afterSchemaLoaded(ediSchema);
    this.schema = ediSchema;
  }

  abstract afterSchemaLoaded(schema: EdiSchema): Promise<void>;

  escapeCharRegex(str: string): string {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  pad(n: number, width: number, z: string = '0') {
      let nStr = n.toString() + '';
      return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
  }
}

export interface IEdiMessage {
}
