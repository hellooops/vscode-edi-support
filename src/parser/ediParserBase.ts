import { EdiVersion, EdiSegment, EdiElement, ElementType, EdiMessageSeparators, EdiMessage } from "./entities";
import { EdiSchema } from "../schemas/schemas";
import * as constants from "../constants";
import Utils from "../utils/utils";

export abstract class EdiParserBase {
  private _segments?: EdiSegment[];
  private _ediVersion?: EdiVersion;
  document: string;
  schema?: EdiSchema;
  _separators?: EdiMessageSeparators | null;
  private parseResult?: EdiMessage;
  private parsingPromise?: Promise<EdiMessage>;

  public constructor(document: string) {
    this.document = document;
  }

  public async parse(): Promise<EdiMessage> {
    if (this.parsingPromise) {
      return this.parsingPromise;
    }

    const parsingPromise = this.parseInternal();
    this.parsingPromise = parsingPromise;
    const that = this;
    parsingPromise.finally(() => {
      that.parsingPromise = undefined;
    })

    return parsingPromise;
  }

  private async parseInternal(): Promise<EdiMessage> {
    if (!this.parseResult) {
      const separators = this.getMessageSeparators();
      const releaseAndVersion = this.parseReleaseAndVersion();
      const segments = await this.parseSegments();
      this.parseResult = new EdiMessage(separators, releaseAndVersion, segments);
    }

    return this.parseResult;
  }

  public parseReleaseAndVersion(): EdiVersion {
    if (!this._ediVersion) {
      this._ediVersion = this.parseReleaseAndVersionInternal();
    }

    return this._ediVersion;
  }

  protected abstract parseReleaseAndVersionInternal(): EdiVersion;

  private async parseSegments(force: boolean = false): Promise<EdiSegment[]> {
    if (force) {
      return await this.parseSegmentsInternal();
    }
    
    if (!this._segments) {
      this._segments = await this.parseSegmentsInternal();
    }

    return this._segments;
  }

  private async parseSegmentsInternal(): Promise<EdiSegment[]> {
    const regex = this.getSegmentRegex();
    const results: EdiSegment[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(this.document)) !== null) {
      try {
        const ediSegment = await this.parseSegment(match[0], match.index, match.index + match[0].length - 1, match[2]);
        if (ediSegment) {
          results.push(ediSegment);
        }
      } catch (ex: any) {
        console.error(constants.errors.ediSupportError, ex);
      }
    }
    return results;
  }

  protected getSegmentByRegex(segmentId: string): string | null {
    const regex = this.getSegmentRegex(segmentId);
    let match: RegExpExecArray | null;
    if ((match = regex.exec(this.document)) !== null) {
      return match[0];
    }

    return null;
  }

  private getSegmentRegex(segmentId?: string): RegExp {
    const separater = this.escapeCharRegex(this.getMessageSeparators().segmentSeparator!);
    const releaseCharacter = this.escapeCharRegex(this.getMessageSeparators().releaseCharacter!);
    let regexPattern: string;
    if (releaseCharacter) {
      regexPattern = `\\b(${segmentId ?? ""}[\\s\\S]*?)((?<!${releaseCharacter})${separater})`;
    } else {
      regexPattern = `\\b(${segmentId ?? ""}[\\s\\S]*?)(${separater})`;
    }
    return new RegExp(regexPattern, "g");
  }

  public async parseSegment(segmentStr: string, startIndex: number, endIndex: number, endingDelimiter: string): Promise<EdiSegment> {
    await this.loadSchema();

    const firstElementSeparatorIndex = /\W/.exec(segmentStr)?.index ?? segmentStr.length - 1;
    const segment = new EdiSegment(
      segmentStr.substring(0, firstElementSeparatorIndex),
      startIndex,
      endIndex,
      segmentStr.length,
      endingDelimiter
    );
    if (this.schema?.ediReleaseSchema) {
      segment.ediReleaseSchemaSegment = this.schema.ediReleaseSchema.getSegment(segment.id);
      if (!segment.ediReleaseSchemaSegment) {
        segment.isInvalidSegment = true;
      }
    }

    const customSegmentParser = this.getCustomSegmentParser(segment.id);
    if (customSegmentParser) {
      return await customSegmentParser(segment, segmentStr);
    }

    let element: EdiElement | undefined = undefined;
    let subElement: EdiElement | undefined = undefined;
    let elementIndex = 0;
    let subElementIndex = 0;
    let elementDesignator: string | undefined = undefined;
    const { segmentSeparator, dataElementSeparator, componentElementSeparator, releaseCharacter } = <Required<EdiMessageSeparators>>this.getMessageSeparators();
    for (let i = segment.id.length; i < segmentStr.length; i++) {
      const isSegmentSeparator = EdiParserBase.isCharWithoutEscape(segmentStr, i, segmentSeparator, releaseCharacter);
      const isDataElementSeparator = EdiParserBase.isCharWithoutEscape(segmentStr, i, dataElementSeparator, releaseCharacter);
      const isComponentElementSeparator = EdiParserBase.isCharWithoutEscape(segmentStr, i, componentElementSeparator, releaseCharacter);
      if (isDataElementSeparator || isSegmentSeparator) {
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
      } else if (isComponentElementSeparator) {
        if (subElement) {
          subElement.endIndex = i - 1;
          subElement.value = segmentStr.substring(subElement.startIndex + 1, subElement.endIndex + 1);
          subElement = undefined;
        }
      }

      if (isDataElementSeparator) {
        elementIndex++;
        element = new EdiElement(
          ElementType.dataElement,
          i,
          -1, // endIndex will be set later
          dataElementSeparator,
          segment.id,
          segment.startIndex,
          this.pad(elementIndex, 2, "0")
        );
        element.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1];
        elementDesignator = element.designatorIndex;
        segment.elements.push(element);
        if (element.ediReleaseSchemaElement?.isComposite()) {
          const nextC: string | undefined = i < segmentStr.length - 1 ? segmentStr[i + 1] : undefined;
          const isElementValueEmpty = nextC === dataElementSeparator || nextC === segmentSeparator || nextC === undefined;
          if (!isElementValueEmpty) {
            subElementIndex++;
            subElement = new EdiElement(
              ElementType.componentElement,
              i,
              -1, // endIndex will be set later
              dataElementSeparator,
              segment.id,
              segment.startIndex,
              `${elementDesignator}${this.pad(subElementIndex, 2, "0")}`
            );
            subElement.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1]?.components[subElementIndex - 1];
            element.components = element.components || [];
            element.components.push(subElement);
          }
        }
      } else if (isComponentElementSeparator) {
        subElementIndex++;
        subElement = new EdiElement(
          ElementType.componentElement,
          i,
          -1, // endIndex will be set later
          componentElementSeparator,
          segment.id,
          segment.startIndex,
          `${elementDesignator}${this.pad(subElementIndex, 2, "0")}`
        );
        subElement.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1]?.components[subElementIndex - 1];
        element!.components = element!.components || [];
        element!.components.push(subElement);
      }
    }

    return segment;
  }

  private static isCharWithoutEscape(str: string, i: number, char: string, escapeChar: string): boolean {
    if (i < 0 || i >= str.length) return false;
    if (i === 0 || !escapeChar) {
      return str[i] === char;
    }

    return str[i] === char && str[i - 1] !== escapeChar;
  }

  protected abstract getCustomSegmentParser(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<EdiSegment>) | undefined;

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

  public setMessageSeparators(separators: EdiMessageSeparators): void {
    this._separators = separators;
  }

  protected abstract parseSeparators(): EdiMessageSeparators | null;

  protected abstract getDefaultMessageSeparators(): EdiMessageSeparators;

  protected abstract getSchemaRootPath(): string;

  protected async loadSchema(): Promise<void> {
    if (this.schema) {
      return;
    }

    const ediVersion = this.parseReleaseAndVersion();
    if (!ediVersion || !ediVersion.release) {
      return;
    }

    let releaseSchema = null;
    try {
      releaseSchema = await import(`${this.getSchemaRootPath()}/${ediVersion.release}/RSSBus_${ediVersion.release}.json`);
    } catch (ex) {
      console.error(Utils.formatString(constants.errors.importSchemaError, ediVersion.release), ex);
      return;
    }

    const ediSchema = new EdiSchema(releaseSchema);
    await this.afterSchemaLoaded(ediSchema, ediVersion);
    this.schema = ediSchema;
  }

  protected abstract afterSchemaLoaded(schema: EdiSchema, ediVersion: EdiVersion): Promise<void>;

  protected escapeCharRegex(str: string | undefined | null): string | undefined | null {
    if (str === undefined || str === null) {
      return str;
    }

    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  protected pad(n: number, width: number, z: string = '0') {
      let nStr = n.toString() + '';
      return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
  }
}
