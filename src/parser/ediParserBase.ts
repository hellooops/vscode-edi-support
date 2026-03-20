import { EdiSegment, EdiElement, ElementType, EdiMessageSeparators, EdiDocument, type EdiStandardOptions, EdiDocumentBuilder, type EdiInterchangeMeta, type EdiTransactionSetMeta, type EdiFunctionalGroupMeta, EdiType, EdiComment } from "./entities";
import { EdiSchema } from "../schemas/schemas";
import * as constants from "../constants";
import Utils from "../utils/utils";
import * as vscode from "vscode";
import { type Conf_Supported_EdiType, type Conf_CustomSchema, Conf_Utils } from "../interfaces/configurations";
import { SegmentScanner } from "./segmentScanner";
import { SchemaVersionSegmentsContext } from "./schemaVersionSegmentsContext";

export abstract class EdiParserBase {
  document: string;
  schema?: EdiSchema;
  _separators?: EdiMessageSeparators | null;
  private parseResult?: EdiDocument;
  private parsingPromise?: Promise<EdiDocument>;
  protected abstract ediType: string;

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
    });

    return parsingPromise;
  }

  private async parseInternal(): Promise<EdiDocument> {
    if (!this.parseResult) {
      this.parseResult = await this.parseDocument();
    }

    return this.parseResult;
  }

  protected abstract parseInterchangeMeta(interchangeSegment: EdiSegment | undefined): EdiInterchangeMeta;
  protected abstract parseFunctionalGroupMeta(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment): EdiFunctionalGroupMeta;
  protected abstract parseTransactionSetMeta(interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment | undefined, transactionSetSegment: EdiSegment): EdiTransactionSetMeta;
  private fitSegmentsToVersion(segments: EdiSegment[]): EdiSegment[] {
    if (!this.schema?.ediVersionSchema) return segments;
    const versionSegmentsContext = new SchemaVersionSegmentsContext(this.schema.ediVersionSchema.TransactionSet);
    return versionSegmentsContext.build(segments);
  }

  private async parseDocument(force: boolean = false): Promise<EdiDocument> {
    return await this.parseDocumentInternal();
  }

  private async parseDocumentInternal(): Promise<EdiDocument> {
    const separators = this.getMessageSeparators();
    const standardOptions = this.getStardardOptions();
    const ediDocumentBuilder: EdiDocumentBuilder = new EdiDocumentBuilder(separators, standardOptions);
    ediDocumentBuilder.onParseInterchangeMeta((interchangeSegment) => {
      return this.parseInterchangeMeta(interchangeSegment);
    });
    ediDocumentBuilder.onParseFunctionalGroupMeta((interchangeSegment, funcitonalGroupSegment) => {
      return this.parseFunctionalGroupMeta(interchangeSegment, funcitonalGroupSegment);
    });
    ediDocumentBuilder.onParseTransactionSetMeta((interchangeSegment, funcitonalGroupSegment, transactionSetSegment) => {
      return this.parseTransactionSetMeta(interchangeSegment, funcitonalGroupSegment, transactionSetSegment);
    });
    ediDocumentBuilder.onLoadSchema(async (meta: EdiTransactionSetMeta) => {
      // TODO(Deric): Don't load schema here, in parseSegment
      return await this.loadSchema(meta);
    });
    ediDocumentBuilder.onUnloadSchema(() => {
      this.unloadSchema();
    });
    ediDocumentBuilder.onSchemaLoaded(() => {
      this.onSchemaLoaded();
    });
    ediDocumentBuilder.onLoadTransactionSetStartSegmentSchema(async (segment) => {
      const newSegment = await this.parseSegment(segment.segmentStr!, segment.startIndex, segment.endingDelimiter);
      newSegment.comments = segment.comments;
      return newSegment;
    });
    ediDocumentBuilder.onAfterEndTransactionSet(async (transactionSet) => {
      transactionSet.segments = this.fitSegmentsToVersion(transactionSet.segments);
    });
    try {
      const scanner = new SegmentScanner(this.document, this.getSegmentRegex(), this.getCommentRegex());
      while (true) {
        const token = scanner.next();
        if (!token) {
          break;
        }

        if (token.type === "comment") {
          ediDocumentBuilder.addComment(new EdiComment(token.startIndex, token.endIndex, token.value));
          continue;
        }

        const ediSegment = await this.parseSegment(token.value, token.startIndex, token.endingDelimiter);
        await ediDocumentBuilder.addSegment(ediSegment);
      }

      return ediDocumentBuilder.buildEdiDocument();
    } catch (ex: any) {
      console.error(constants.errors.ediSupportError, ex);
      throw ex;
    }
  }

  protected getSegmentRegex(): RegExp {
    const separater = this.escapeCharRegex(this.getMessageSeparators().segmentSeparator!);
    const releaseCharacter = this.escapeCharRegex(this.getMessageSeparators().releaseCharacter!);
    let regexPattern: string;
    if (releaseCharacter) {
      regexPattern = `\\b([\\s\\S]*?)((?<!${releaseCharacter})(${separater}|$))`;
    } else {
      regexPattern = `\\b([\\s\\S]*?)(${separater}|$)`;
    }
    return new RegExp(regexPattern, "g");
  }

  protected getCommentRegex(): RegExp {
    return new RegExp(`(?<=^\\s*?)\\/\\/[\\s\\S]*?(?=(\n|$))`, "g");
  }

  protected getSegmentNameBySegmentStr(segmentStr: string): string {
    const firstElementSeparatorIndex = /\W/.exec(segmentStr)?.index ?? segmentStr.length;
    return segmentStr.substring(0, firstElementSeparatorIndex);
  }

  public async parseSegment(segmentStr: string, startIndex: number, endingDelimiter: string): Promise<EdiSegment> {
    const endIndex = startIndex + segmentStr.length - (endingDelimiter?.length ?? 0);
    const segment = new EdiSegment(
      this.getSegmentNameBySegmentStr(segmentStr),
      startIndex,
      endIndex,
      segmentStr.length,
      endingDelimiter
    );

    segment.segmentStr = segmentStr;

    await this.assembleSegmentReleaseSchema(segment, segmentStr);

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
      const isEndOfSegment = i === segmentStr.length - 1;
      if (isDataElementSeparator || isSegmentSeparator || isEndOfSegment) {
        const elementEndIndex = (isEndOfSegment && !isSegmentSeparator) ? i : i - 1;
        element = this.closeElement(segmentStr, element, elementEndIndex);
        subElement = this.closeElement(segmentStr, subElement, elementEndIndex);

        subElementIndex = 0;
      } else if (isComponentElementSeparator) {
        subElement = this.closeElement(segmentStr, subElement, i - 1);
      }

      if (isDataElementSeparator) {
        elementIndex++;
        element = this.createDataElement(segment, i, dataElementSeparator, elementIndex);
        elementDesignator = element.designatorIndex;
        segment.elements.push(element);
        if (this.shouldCreateImplicitFirstComponent(segmentStr, element, i, segmentSeparator, dataElementSeparator, componentElementSeparator)) {
          subElementIndex++;
          subElement = this.createComponentElement(segment, i, dataElementSeparator, elementDesignator, elementIndex, subElementIndex);
          this.addComponentElement(element, subElement);
        }
      } else if (isComponentElementSeparator) {
        subElementIndex++;
        subElement = this.createComponentElement(segment, i, componentElementSeparator, elementDesignator, elementIndex, subElementIndex);
        this.addComponentElement(element!, subElement);
      }
    }

    return segment;
  }

  private closeElement(segmentStr: string, currentElement: EdiElement | undefined, elementEndIndex: number): EdiElement | undefined {
    if (!currentElement) {
      return undefined;
    }

    currentElement.endIndex = elementEndIndex;
    currentElement.value = segmentStr.substring(currentElement.startIndex + 1, currentElement.endIndex + 1);
    return undefined;
  }

  private createDataElement(segment: EdiSegment, startIndex: number, dataElementSeparator: string, elementIndex: number): EdiElement {
    const element = new EdiElement(
      segment,
      ElementType.dataElement,
      startIndex,
      -1, // endIndex will be set later
      dataElementSeparator,
      segment.id,
      segment.startIndex,
      this.pad(elementIndex, 2, "0")
    );
    element.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1];
    return element;
  }

  private createComponentElement(
    segment: EdiSegment,
    startIndex: number,
    separator: string,
    elementDesignator: string | undefined,
    elementIndex: number,
    subElementIndex: number
  ): EdiElement {
    const subElement = new EdiElement(
      segment,
      ElementType.componentElement,
      startIndex,
      -1, // endIndex will be set later
      separator,
      segment.id,
      segment.startIndex,
      `${elementDesignator}${this.pad(subElementIndex, 2, "0")}`
    );
    subElement.ediReleaseSchemaElement = segment.ediReleaseSchemaSegment?.elements[elementIndex - 1]?.components?.[subElementIndex - 1];
    return subElement;
  }

  private addComponentElement(element: EdiElement, subElement: EdiElement): void {
    element.components = element.components || [];
    element.components.push(subElement);
  }

  private shouldCreateImplicitFirstComponent(
    segmentStr: string,
    element: EdiElement,
    elementStartIndex: number,
    segmentSeparator: string,
    dataElementSeparator: string,
    componentElementSeparator: string
  ): boolean {
    if (!this.isElementComposite(segmentStr, element, elementStartIndex, segmentSeparator, dataElementSeparator, componentElementSeparator)) {
      return false;
    }

    const nextC: string | undefined = elementStartIndex < segmentStr.length - 1 ? segmentStr[elementStartIndex + 1] : undefined;
    const isElementValueEmpty = nextC === dataElementSeparator || nextC === segmentSeparator || nextC === undefined;
    return !isElementValueEmpty;
  }

  private isElementComposite(segmentStr: string, element: EdiElement, elementStartIndex: number, segmentSeparator: string, dataElementSeparator: string, componentElementSeparator: string): boolean {
    if (element.ediReleaseSchemaElement) return element.ediReleaseSchemaElement.isComposite();
    if (elementStartIndex >= segmentStr.length) return false;
    const releaseCharacter = this.getMessageSeparators().releaseCharacter ?? "";
    for (let i = elementStartIndex + 1; i < segmentStr.length; i++) {
      const isSegmentSeparator = EdiParserBase.isCharWithoutEscape(segmentStr, i, segmentSeparator, releaseCharacter);
      const isDataElementSeparator = EdiParserBase.isCharWithoutEscape(segmentStr, i, dataElementSeparator, releaseCharacter);
      const isComponentElementSeparator = EdiParserBase.isCharWithoutEscape(segmentStr, i, componentElementSeparator, releaseCharacter);
      if (isDataElementSeparator || isSegmentSeparator) return false;
      else if (isComponentElementSeparator) return true;
    }

    return false;
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
      const separators = this.getDefaultMessageSeparators();
      const parsedSeparators = this.parseSeparators();
      if (parsedSeparators) {
        for (const key of Object.keys(parsedSeparators)) {
          const separatorKey = key as keyof EdiMessageSeparators;
          const value = parsedSeparators[separatorKey];
          if (value !== undefined) {
            separators[separatorKey] = value;
          }
        }
      }

      this._separators = separators;
    }
    
    return this._separators;
  }

  public setMessageSeparators(separators: EdiMessageSeparators): void {
    this._separators = separators;
  }

  protected abstract parseSeparators(): EdiMessageSeparators | null;

  protected abstract getDefaultMessageSeparators(): EdiMessageSeparators;

  protected abstract getSchemaRootPath(): string;

  async loadSchema(meta: EdiTransactionSetMeta): Promise<boolean> {
    this.schema = undefined;
    if (!meta.release || !meta.version) return false;
    let releaseSchema = null;
    let versionSchema = null;
    try {
      releaseSchema = await import(`${this.getSchemaRootPath()}/${meta.release}/${meta.release}.json`);
    } catch (ex) {
      console.error(Utils.formatString(constants.errors.importSchemaError, meta.release), ex);
      return false;
    }

    try {
      const release_versions = await import(`${this.getSchemaRootPath()}/${meta.release}/${meta.release}_versions.json`);
      const versionKey = `${meta.release}_${meta.version}`;
      if (!release_versions || !release_versions["DocumentTypes"][versionKey]) {
        console.error(Utils.formatString(constants.errors.importSchemaError, meta.release), new Error(`Version ${versionKey} not found in ${meta.release}_versions.json`));
        return false;
      }

      // versionSchema = await import(`${this.getSchemaRootPath()}/${meta.release}/${meta.release}_${meta.version}.json`);
      versionSchema = release_versions["DocumentTypes"][versionKey];
    } catch (ex) {
      console.error(Utils.formatString(constants.errors.importSchemaError, meta.release), ex);
      return false;
    }

    const ediSchema = new EdiSchema(releaseSchema, versionSchema);
    this.schema = ediSchema;
    return true;
  }

  protected unloadSchema(): void {
    this.schema = undefined;
  }

  protected onSchemaLoaded(): void {
    try {
      const customSchemas: Conf_CustomSchema = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.customSchemas) ?? {};
      const qualifiers = Conf_Utils.getQualifiers(customSchemas, this.ediType as Conf_Supported_EdiType, this.schema!.ediReleaseSchema.release);
      qualifiers.forEach(q => {
        this.schema?.ediReleaseSchema?.addQualifier(q.qualifier, q.code, q.desc);
      });
    } catch (ex: any) {
      console.error(ex);
    }
  }

  protected escapeCharRegex(str: string | undefined | null): string | undefined | null {
    if (str === undefined || str === null) {
      return str;
    }

    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  protected pad(n: number, width: number, z: string = "0") {
    let nStr = n.toString();
    return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
  }

  protected abstract getStardardOptions(): EdiStandardOptions;
}
