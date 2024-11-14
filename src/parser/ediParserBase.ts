import { EdiVersion, EdiSegment, EdiElement, ElementType, EdiMessageSeparators, EdiDocument, EdiDocumentSeparators, type EdiStandardOptions, EdiDocumentBuilder } from './entities';
import { EdiSchema } from "../schemas/schemas";
import * as constants from "../constants";
import Utils from "../utils/utils";

export abstract class EdiParserBase {
  document: string;
  schema?: EdiSchema;
  _separators?: EdiMessageSeparators | null;
  private parseResult?: EdiDocument;
  private parsingPromise?: Promise<EdiDocument>;

  public constructor(document: string) {
    this.document = document;
  }

  public async parse(): Promise<EdiDocument> {
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

  private async parseInternal(): Promise<EdiDocument> {
    if (!this.parseResult) {
      this.parseResult = await this.parseDocument();
    }

    return this.parseResult;
  }

  public parseReleaseAndVersion(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment, transactionSetSegment: EdiSegment): EdiVersion {
    return this.parseReleaseAndVersionInternal(interchangeSegment, functionalGroupSegment, transactionSetSegment);
  }

  protected abstract parseReleaseAndVersionInternal(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment, transactionSetSegment: EdiSegment): EdiVersion;

  private async parseDocument(force: boolean = false): Promise<EdiDocument> {
    return await this.parseDocumentInternal();
  }

  private async parseDocumentInternal(): Promise<EdiDocument> {
    const regex = this.getSegmentRegex();
    let match: RegExpExecArray | null;
    const separators = this.getMessageSeparators();
    const standardOptions = this.getStardardOptions();
    const ediDocumentBuilder: EdiDocumentBuilder = new EdiDocumentBuilder(separators, standardOptions);
    ediDocumentBuilder.onParseReleaseAndVersion((interchangeSegment, funcitonalGroupSegment, transactionSetSegment) => {
      const releaseAndVersion = this.parseReleaseAndVersion(interchangeSegment, funcitonalGroupSegment, transactionSetSegment);
      return releaseAndVersion;
    });
    ediDocumentBuilder.onLoadSchema(async (ediVersion: EdiVersion) => {
      // TODO(Deric): Don't load schema here, in parseSegment
      await this.loadSchema(ediVersion);
    });
    ediDocumentBuilder.onUnloadSchema(() => {
      this.unloadSchema();
    });
    ediDocumentBuilder.onLoadTransactionSetStartSegmentSchema(async (segment) => {
      return await this.parseSegment(segment.segmentStr!, segment.startIndex, segment.endIndex, segment.endingDelimiter);
    });
    try {
      while ((match = regex.exec(this.document)) !== null) {
        const ediSegment = await this.parseSegment(match[0], match.index, match.index + match[0].length - 1, match[2]);
        await ediDocumentBuilder.addSegment(ediSegment);
      }

      return ediDocumentBuilder.buildEdiDocument();
    } catch (ex: any) {
      console.error(constants.errors.ediSupportError, ex);
      throw ex;
    }
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
    const firstElementSeparatorIndex = /\W/.exec(segmentStr)?.index ?? segmentStr.length - 1;
    const segment = new EdiSegment(
      segmentStr.substring(0, firstElementSeparatorIndex),
      startIndex,
      endIndex,
      segmentStr.length,
      endingDelimiter
    );

    segment.segmentStr = segmentStr;

    this.assembleSegmentReleaseSchema(segment, segmentStr);

    const customSegmentParser = this.getCustomSegmentParser(segment.id);
    if (customSegmentParser) {
      return await customSegmentParser(segment, segmentStr);
    }

    const parsedSegment = await this.parseSegmentInternal(segmentStr, segment);
    return parsedSegment;
  }

  public async parseSegmentInternal(segmentStr: string, segment: EdiSegment): Promise<EdiSegment> {
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

  private async assembleSegmentReleaseSchema(segment: EdiSegment, segmentStr: string): Promise<void> {
    if (this.schema?.ediReleaseSchema) {
      segment.ediReleaseSchemaSegment = this.schema.ediReleaseSchema.getSegment(segment.id);
      if (!segment.ediReleaseSchemaSegment) {
        segment.isInvalidSegment = true;
      }
    }

    const customSegmentSchemaBuilder = this.getCustomSegmentSchemaBuilder(segment.id);
    if (customSegmentSchemaBuilder) {
      await customSegmentSchemaBuilder(segment, segmentStr);
    }
  }

  private static isCharWithoutEscape(str: string, i: number, char: string, escapeChar: string): boolean {
    if (i < 0 || i >= str.length) return false;
    if (i === 0 || !escapeChar) {
      return str[i] === char;
    }

    return str[i] === char && str[i - 1] !== escapeChar;
  }

  protected abstract getCustomSegmentSchemaBuilder(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<void>) | undefined;

  protected abstract getCustomSegmentParser(segmentId: string): ((segment: EdiSegment, segmentStr: string) => Promise<EdiSegment>) | undefined;

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

  protected async loadSchema(ediVersion: EdiVersion): Promise<void> {
    if (!ediVersion.release || !ediVersion.version) return;
    let releaseSchema = null;
    try {
      releaseSchema = await import(`${this.getSchemaRootPath()}/${ediVersion.release}/RSSBus_${ediVersion.release}.json`);
    } catch (ex) {
      console.error(Utils.formatString(constants.errors.importSchemaError, ediVersion.release), ex);
      return;
    }

    const ediSchema = new EdiSchema(releaseSchema);
    this.schema = ediSchema;
  }

  protected unloadSchema(): void {
    this.schema = undefined;
  }

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

  protected abstract getStardardOptions(): EdiStandardOptions;
}
