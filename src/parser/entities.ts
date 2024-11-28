/// <reference path="../../env.d.ts" />

import { EdiReleaseSchemaElement, EdiReleaseSchemaSegment } from "../schemas/schemas";
import * as constants from "../constants";
import Utils from "../utils/utils";
import MessageInfo from "../interfaces/messageInfo";

interface IEdiMessageResult<T> {
  getIResult(): T;
}

interface SegmentMaximumOccurrencesExceed {
  expect: number;
  actual: number;
}

export class EdiSegment implements IEdiMessageResult<IEdiSegment>, IDiagnosticErrorAble {
  key: string;

  public id: string;
  public startIndex: number;
  public endIndex: number;
  public length: number;
  public elements: Array<EdiElement>;
  public endingDelimiter: string;
  public ediReleaseSchemaSegment?: EdiReleaseSchemaSegment;
  public isInvalidSegment: boolean;
  public Loop?: EdiSegment[];

  segmentMaximumOccurrencesExceed?: SegmentMaximumOccurrencesExceed;

  segmentStr?: string;

  transactionSetParent?: EdiTransactionSet;
  functionalGroupParent?: EdiFunctionalGroup;
  interchangeParent?: EdiInterchange;
  documentParent?: EdiDocument;

  parentSegment?: EdiSegment;

  constructor(id: string, startIndex: number, endIndex: number, length: number, endingDelimiter: string) {
    this.key = Utils.randomId();

    this.id = id;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.length = length;
    this.endingDelimiter = endingDelimiter;
    this.elements = [];
    this.isInvalidSegment = false;
  }

  getDesc(): string | undefined {
    if (this.isLoop() && this.Loop!.length > 0) {
      return this.Loop![0].getDesc();
    } else {
      return this.ediReleaseSchemaSegment?.desc;
    }
  }

  getPurpose(): string | undefined {
    if (this.isLoop() && this.Loop!.length > 0) {
      return this.Loop![0].getPurpose();
    } else {
      return this.ediReleaseSchemaSegment?.purpose;
    }
  }

  getSegments(withoutLoop?: boolean): EdiSegment[] {
    if (this.isLoop() && withoutLoop) {
      return this.Loop!.flatMap(i => i.getSegments(withoutLoop));
    } else {
      return [this];
    }
  }

  getLevel(): number {
    if (!this.parentSegment) return 0;
    if (this === this.parentSegment.Loop![0]) return this.parentSegment.getLevel();
    return this.parentSegment.getLevel() + 1;
  }

  getFormatString(options: EdiFormattingOptions): string {
    if (this.isLoop()) {
      return formatEdiDocumentPartsSegment({
        children: this.Loop!,
        lineBreakCount: 1,
        options,
      });
    } else {
      const indentString = options.getFormatString();
      return `${Array(this.getLevel()).fill(indentString).join("")}${this.id}${this.elements.join("")}${this.endingDelimiter}`;
    }
  }

  public toString() {
    return this.getFormatString(EdiFormattingOptions.TAB_SIZE_0);
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

  public getErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    if (this.isInvalidSegment) {
      errors.push({
        error: `Segment ${this.id} not found.`,
        code: DiagnosticErrors.INVALID_VALUE,
        severity: DiagnosticErrorSeverity.ERROR,
        errorSegment: this,
      });
    }

    if (this.segmentMaximumOccurrencesExceed) {
      errors.push({
        error: `Segment ${this.id} maximum occurrences exceed, expect ${this.segmentMaximumOccurrencesExceed.expect}, got ${this.segmentMaximumOccurrencesExceed.actual}`,
        code: DiagnosticErrors.SEGMENT_MAXIMUM_OCCURRENCES_EXCEED,
        severity: DiagnosticErrorSeverity.ERROR,
        errorSegment: this,
      });
    }

    if (this.isLoop()) {
      errors.push(...this.Loop!.flatMap(i => i.getErrors(context)));
    }

    if (!this.elements) return errors;
    return errors.concat(this.elements.flatMap(el => el.getErrors(context)));
  }

  getIResult(): IEdiSegment {
    return {
      key: this.key,
      id: this.id,
      desc: this.getDesc(),
      purpose: this.getPurpose(),
      elements: this.elements.map(e => e.getIResult()),
      Loop: this.Loop?.map(i => i.getIResult())
    };
  }

  public isLoop(): boolean {
    return this.Loop !== undefined;
  }

  public isHeaderSegment(): boolean {
    return !this.transactionSetParent;
  }
}

export enum ElementType {
  dataElement = "Data Element",
  componentElement = "Component Element"
}

interface IDiagnosticErrorAble {
  getErrors(context: DiagnoscticsContext): DiagnosticError[];
}

export enum DiagnosticErrorSeverity {
  ERROR, WARNING,
}

export interface DiagnosticError {
  error: string;
  code: string;
  errorSegment?: EdiSegment;
  errorElement?: EdiElement;
  severity: DiagnosticErrorSeverity;
}

export namespace DiagnosticErrors {
  export const INVALID_VALUE = "Edi Support: Invalid value";
  export const VALUE_TOO_LONG = "Edi Support: Value too long";
  export const VALUE_TOO_SHORT = "Edi Support: Value too short";
  export const VALUE_REQUIRED = "Edi Support: Value required";
  export const QUALIFIER_INVALID_CODE = "Edi Support: Qualifier invalid code";
  export const SEGMENT_NOT_FOUND = "Edi Support: Segment not found";
  export const SEGMENT_MAXIMUM_OCCURRENCES_EXCEED = "Edi Support: Segment maximum occurrences exceed";
}

export interface DiagnoscticsContext {
  segment?: EdiSegment;
  element?: EdiElement;
  ediType: string;
  standardOptions: EdiStandardOptions;
}

export class EdiElement implements IEdiMessageResult<IEdiElement>, IDiagnosticErrorAble {
  key: string;

  public type: ElementType;
  public value?: string;
  public startIndex: number;
  public endIndex: number;
  public separator: string;
  public designatorIndex: string;
  public segmentStartIndex: number;
  public segmentName: string;
  public components?: EdiElement[];
  public ediReleaseSchemaElement?: EdiReleaseSchemaElement;

  public segment: EdiSegment;

  constructor(segment: EdiSegment, type: ElementType, startIndex: number, endIndex: number, separator: string, segmentName: string, segmentStartIndex: number, designatorIndex: string) {
    this.key = Utils.randomId();

    this.segment = segment;
    this.type = type;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.separator = separator;
    this.segmentName = segmentName;
    this.segmentStartIndex = segmentStartIndex;
    this.designatorIndex = designatorIndex;
  }

  public getDesignator() : string {
    return `${this.segmentName}${this.designatorIndex}`;
  }

  public getDesignatorWithId(): string {
    const elementId = this.ediReleaseSchemaElement?.id;
    if (!elementId) {
      return this.getDesignator();
    }

    return `${this.getDesignator()}(${elementId})`;
  }

  public getErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    if (this.components && this.components.length > 0) {
      return this.components.reduce((errors: DiagnosticError[], component: EdiElement) => {
        return errors.concat(component.getErrors(context).filter(i => i));
      }, errors);
    }

    if (!this.ediReleaseSchemaElement) {
      return errors;
    }

    if (this.value && this.value.length > this.ediReleaseSchemaElement.maxLength) {
      errors.push({
        error: `Element ${this.ediReleaseSchemaElement?.id} is too long. Max length is ${this.ediReleaseSchemaElement.maxLength}, got ${this.value.length}.`,
        code: DiagnosticErrors.VALUE_TOO_LONG,
        severity: DiagnosticErrorSeverity.ERROR,
        errorElement: this,
      });
    }

    if (this.value && this.value.length < this.ediReleaseSchemaElement.minLength) {
      errors.push({
        error: `Element ${this.ediReleaseSchemaElement?.id} is too short. Min length is ${this.ediReleaseSchemaElement.minLength}, got ${this.value.length}.`,
        code: DiagnosticErrors.VALUE_TOO_SHORT,
        severity: DiagnosticErrorSeverity.ERROR,
        errorElement: this,
      });
    }

    if (this.ediReleaseSchemaElement?.required && !this.value) {
      errors.push({
        error: `Element ${this.ediReleaseSchemaElement?.id} is required.`,
        code: DiagnosticErrors.VALUE_REQUIRED,
        severity: DiagnosticErrorSeverity.ERROR,
        errorElement: this,
      });
    }

    if (this.ediReleaseSchemaElement.qualifierRef && this.value) {
      const codes = this.ediReleaseSchemaElement.getCodes();
      if (codes) {
        const elementValueCode = this.ediReleaseSchemaElement.getCodeOrNullByValue(this.value);
        if (!elementValueCode) {
          errors.push({
            error: `Invalid code value '${this.value}' for qualifer '${this.ediReleaseSchemaElement.qualifierRef}'.`,
            code: DiagnosticErrors.QUALIFIER_INVALID_CODE,
            severity: DiagnosticErrorSeverity.ERROR,
            errorElement: this,
          });
        }
      }
    }

    return errors;
  }

  public isComposite(): boolean {
    return !!this.components && this.components.length > 0;
  }

  public toString() {
    return this.separator + this.value;
  }

  getIResult(): IEdiElement {
    let codeValue: string | undefined;
    if (this.ediReleaseSchemaElement?.qualifierRef && this.value) {
      const codes = this.ediReleaseSchemaElement.getCodes();
      if (codes) {
        const elementValueCode = this.ediReleaseSchemaElement.getCodeOrNullByValue(this.value);
        if (elementValueCode) {
          codeValue = elementValueCode.desc;
        } else {
          codeValue = "Invalid code value";
        }
      }
    }

    return {
      key: this.key,
      type: this.type,
      value: this.value,
      components: this.components?.map(e => e.getIResult()),
      id: this.ediReleaseSchemaElement?.id,
      desc: this.ediReleaseSchemaElement?.desc,
      dataType: this.ediReleaseSchemaElement?.dataType,
      required: this.ediReleaseSchemaElement?.required,
      minLength: this.ediReleaseSchemaElement?.minLength,
      maxLength: this.ediReleaseSchemaElement?.maxLength,
      codeValue,
      definition: this.ediReleaseSchemaElement?.definition,
    };
  }
}

export class EdiMessageSeparators {
  public segmentSeparator?: string;
  public dataElementSeparator?: string;
  public componentElementSeparator?: string;
  public releaseCharacter?: string; // escape char
}

export class EdiType {
  static X12 = constants.ediDocument.x12.name;
  static EDIFACT = constants.ediDocument.edifact.name;
  static UNKNOWN = "unknown";
}

export interface EdiTransactionSetMeta {
  release?: string;
  version?: string;
  id?: string;
  messageInfo?: MessageInfo;
}

export class EdiTransactionSet implements IEdiMessageResult<IEdiTransactionSet>, IDiagnosticErrorAble {
  key: string;
  meta: EdiTransactionSetMeta;

  segments: EdiSegment[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  functionalGroup: EdiFunctionalGroup;

  constructor(meta: EdiTransactionSetMeta, functionalGroup: EdiFunctionalGroup) {
    this.key = Utils.randomId();
    this.meta = meta;

    this.segments = [];
    this.functionalGroup = functionalGroup;
  }

  getIResult(): IEdiTransactionSet {
    return {
      key: this.key,
      meta: this.meta,
      id: this.getId(),

      segments: this.segments.map(segment => segment.getIResult()),

      startSegment: this.startSegment?.getIResult(),
      endSegment: this.endSegment?.getIResult(),
    };
  }

  getKey(): string {
    return "";
  }

  addSegment(segment: EdiSegment): void {
    segment.transactionSetParent = this;
    this.segments.push(segment);
  }

  getSegments(withoutLoop?: boolean): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.segments.flatMap(s => s.getSegments(withoutLoop)));
    if (this.endSegment) result.push(this.endSegment);
    return result;
  }

  getId(): string | undefined {
    if (this.startSegment?.id === "ST" && this.startSegment.elements.length >= 2) {
      return this.startSegment.elements[1].value;
    } else if (this.startSegment?.id === "UNH" && this.startSegment.elements.length >= 1) {
      return this.startSegment.elements[0].value;
    } else {
      return undefined;
    }
  }

  getEndId(): string | undefined {
    return this.getEndIdElement()?.value;
  }

  getEndIdElement(): EdiElement | undefined {
    if (this.endSegment?.id === "SE" && this.endSegment.elements.length >= 2) {
      return this.endSegment.elements[1];
    } else if (this.endSegment?.id === "UNT" && this.endSegment.elements.length >= 2) {
      return this.endSegment.elements[1];
    } else {
      return undefined;
    }
  }

  getControlCount(): number | undefined {
    return Utils.getStringAsInt(this.getControlCountElement()?.value);
  }

  getControlCountElement(): EdiElement | undefined {
    if (this.endSegment?.id === "SE" && this.endSegment.elements.length >= 1) {
      return this.endSegment.elements[0];
    } else if (this.endSegment?.id === "UNT" && this.endSegment.elements.length >= 1) {
      return this.endSegment.elements[0];
    } else {
      return undefined;
    }
  }

  getRealControlCount(): number | undefined {
    return this.getSegments(true).length;
  }

  getFirstSegment(): EdiSegment | undefined {
    const segments = this.getSegments(true);
    if (segments.length === 0) return undefined;
    return segments[0];
  }

  getLastSegment(): EdiSegment | undefined {
    const segments = this.getSegments(true);
    if (segments.length === 0) return undefined;
    return segments[segments.length - 1];
  }

  getSelfErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    if (context.standardOptions.transactionSetStartSegmentName && !this.startSegment) {
      errors.push({
        error: `Segment ${context.standardOptions.transactionSetStartSegmentName} not found.`,
        code: DiagnosticErrors.SEGMENT_NOT_FOUND,
        severity: DiagnosticErrorSeverity.ERROR,
      });
    }
    if (context.standardOptions.transactionSetEndSegmentName && !this.endSegment) {
      errors.push({
        error: `Segment ${context.standardOptions.transactionSetEndSegmentName} not found.`,
        code: DiagnosticErrors.SEGMENT_NOT_FOUND,
        severity: DiagnosticErrorSeverity.ERROR,
      });
    }

    if (this.startSegment && this.endSegment) {
      const startId = this.getId();
      const endId = this.getEndId();
      if (startId && startId !== endId) {
        errors.push({
          error: `Wrong transaction set control number, supposed to be ${startId}, got ${endId}`,
          code: DiagnosticErrors.INVALID_VALUE,
          severity: DiagnosticErrorSeverity.ERROR,
          errorElement: this.getEndIdElement()
        });
      }
  
      const controlCount = this.getControlCount();
      const realControlCount = this.getRealControlCount();
      if (controlCount !== realControlCount) {
        errors.push({
          error: `Wrong transaction set segments count, supposed to be ${realControlCount}, got ${controlCount}`,
          code: DiagnosticErrors.INVALID_VALUE,
          severity: DiagnosticErrorSeverity.ERROR,
          errorElement: this.getControlCountElement()
        });
      }
    }

    if (this.startSegment) {
      errors.push(...this.startSegment.getErrors(context));
    }

    if (this.endSegment) {
      errors.push(...this.endSegment.getErrors(context));
    }

    return errors;
  }

  getErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors = this.getSelfErrors(context);
    return errors.concat(this.segments.flatMap((segment) => segment.getErrors(context)).filter(i => i));
  }

  getFormattedReleaseAndSchemaString(): string {
    if (this.meta.release && this.meta.version) {
      return `${this.meta.release} ${this.meta.version}`;
    } else if (this.meta.release && !this.meta.version) {
      return this.meta.release;
    } else if (!this.meta.release && this.meta.version) {
      return this.meta.version;
    } else {
      return "";
    }
  }

  getFormatString(options: EdiFormattingOptions): string {
    return formatEdiDocumentPartsSegment({
      startSegment: this.startSegment,
      endSegment: this.endSegment,
      children: this.segments,
      lineBreakCount: 1,
      options,
    });
  }

  public toString() {
    return this.getFormatString(EdiFormattingOptions.TAB_SIZE_0);
  }
}

export interface EdiFunctionalGroupMeta {
  date?: string;
  time?: string;
  id?: string;
}

export class EdiFunctionalGroup implements IEdiMessageResult<IEdiFunctionalGroup>, IDiagnosticErrorAble {
  key: string;
  meta: EdiFunctionalGroupMeta;

  transactionSets: EdiTransactionSet[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  interchange: EdiInterchange;

  private hasActiveTransactionSet: boolean = false;

  constructor(meta: EdiFunctionalGroupMeta, interchange: EdiInterchange) {
    this.key = Utils.randomId();
    this.meta = meta;

    this.transactionSets = [];
    this.interchange = interchange;
  }

  getIResult(): IEdiFunctionalGroup {
    return {
      key: this.key,
      meta: this.meta,
      id: this.getId(),

      transactionSets: this.transactionSets.map(transactionSet => transactionSet.getIResult()),

      startSegment: this.startSegment?.getIResult(),
      endSegment: this.endSegment?.getIResult(),
    };
  }

  getActiveTransactionSet() {
    return this.transactionSets[this.transactionSets.length - 1];
  }

  startTransactionSet(meta: EdiTransactionSetMeta, startSegment: EdiSegment): EdiTransactionSet {
    const ediTransactionSet = new EdiTransactionSet(meta, this);
    if (startSegment) startSegment.functionalGroupParent = this;
    ediTransactionSet.startSegment = startSegment;
    this.transactionSets.push(ediTransactionSet);
    this.hasActiveTransactionSet = true;
    return ediTransactionSet;
  }

  endTransactionSet(endSegment: EdiSegment): EdiTransactionSet {
    this.hasActiveTransactionSet = false;
    endSegment.functionalGroupParent = this;
    const activeTransactionSet = this.getActiveTransactionSet();
    activeTransactionSet.endSegment = endSegment;
    return activeTransactionSet;
  }

  addSegment(segment: EdiSegment): void {
    if (!this.hasActiveTransactionSet) {
      throw new Error("Functional Group is invalid");
    }

    this.transactionSets[this.transactionSets.length - 1].addSegment(segment);
  }

  getSegments(withoutLoop?: boolean): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.transactionSets.flatMap(i => i.getSegments(withoutLoop)));
    if (this.endSegment) result.push(this.endSegment);
    return result;
  }

  getId(): string | undefined {
    if (this.startSegment?.id === "GS" && this.startSegment.elements.length >= 6) {
      return this.startSegment.elements[5].value;
    } else if (!this.startSegment) {
      return "";
    } else {
      return undefined;
    }
  }

  getEndId(): string | undefined {
    return this.getEndIdElement()?.value;
  }

  getEndIdElement(): EdiElement | undefined {
    if (this.endSegment?.id === "GE" && this.endSegment.elements.length >= 2) {
      return this.endSegment.elements[1];
    } else {
      return undefined;
    }
  }

  getControlCount(): number | undefined {
    return Utils.getStringAsInt(this.getControlCountElement()?.value);
  }

  getControlCountElement(): EdiElement | undefined {
    if (this.endSegment?.id === "GE" && this.endSegment.elements.length >= 1) {
      return this.endSegment.elements[0];
    } else {
      return undefined;
    }
  }

  getRealControlCount(): number | undefined {
    return this.transactionSets.length;
  }

  isFake(): boolean {
    return !this.startSegment;
  }

  getFirstSegment(): EdiSegment | undefined {
    const segments = this.getSegments(true);
    if (segments.length === 0) return undefined;
    return segments[0];
  }

  getLastSegment(): EdiSegment | undefined {
    const segments = this.getSegments(true);
    if (segments.length === 0) return undefined;
    return segments[segments.length - 1];
  }

  getSelfErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    if (this.isFake()) return errors;
    if (context.standardOptions.functionalGroupStartSegmentName && !this.startSegment) {
      errors.push({
        error: `Segment ${context.standardOptions.functionalGroupStartSegmentName} not found.`,
        code: DiagnosticErrors.SEGMENT_NOT_FOUND,
        severity: DiagnosticErrorSeverity.ERROR,
      });
    }
    if (context.standardOptions.functionalGroupEndSegmentName && !this.endSegment) {
      errors.push({
        error: `Segment ${context.standardOptions.functionalGroupEndSegmentName} not found.`,
        code: DiagnosticErrors.SEGMENT_NOT_FOUND,
        severity: DiagnosticErrorSeverity.ERROR,
      });
    }

    if (this.startSegment && this.endSegment) {
      const startId = this.getId();
      const endId = this.getEndId();
      if (startId && startId !== endId) {
        errors.push({
          error: `Wrong functional group control number, supposed to be ${startId}, got ${endId}`,
          code: DiagnosticErrors.INVALID_VALUE,
          severity: DiagnosticErrorSeverity.ERROR,
          errorElement: this.getEndIdElement()
        });
      }
  
      const controlCount = this.getControlCount();
      const realControlCount = this.getRealControlCount();
      if (controlCount !== realControlCount) {
        errors.push({
          error: `Wrong functional group control count, supposed to be ${realControlCount}, got ${controlCount}`,
          code: DiagnosticErrors.INVALID_VALUE,
          severity: DiagnosticErrorSeverity.ERROR,
          errorElement: this.getControlCountElement()
        });
      }
    }

    if (this.startSegment) {
      errors.push(...this.startSegment.getErrors(context));
    }

    if (this.endSegment) {
      errors.push(...this.endSegment.getErrors(context));
    }

    return errors;
  }

  getErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors = this.getSelfErrors(context);
    return errors.concat(this.transactionSets.flatMap((transactionSet) => transactionSet.getErrors(context)).filter(i => i));
  }

  getFormatString(options: EdiFormattingOptions): string {
    return formatEdiDocumentPartsSegment({
      startSegment: this.startSegment,
      endSegment: this.endSegment,
      children: this.transactionSets,
      lineBreakCount: 2,
      options,
    });
  }

  public toString() {
    return this.getFormatString(EdiFormattingOptions.TAB_SIZE_0);
  }
}

export interface EdiInterchangeMeta {
  senderQualifer?: string;
  senderID?: string;
  receiverQualifer?: string;
  receiverID?: string;
  date?: string;
  time?: string;
  id?: string;
}

export class EdiInterchange implements IEdiMessageResult<IEdiInterchange>, IDiagnosticErrorAble {
  key: string;
  meta: EdiInterchangeMeta;

  // TODO(Deric): Meta info
  functionalGroups: EdiFunctionalGroup[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  document: EdiDocument;

  private hasActiveFunctionalGroup: boolean = false;

  constructor(meta: EdiInterchangeMeta, document: EdiDocument) {
    this.key = Utils.randomId();
    this.meta = meta;
    this.functionalGroups = [];
    this.document = document;
  }

  getIResult(): IEdiInterchange {
    return {
      key: this.key,
      meta: this.meta,
      id: this.getId(),

      functionalGroups: this.functionalGroups.map(functionalGroup => functionalGroup.getIResult()),

      startSegment: this.startSegment?.getIResult(),
      endSegment: this.endSegment?.getIResult(),
    };
  }

  ensureActiveFunctionalGroup(): void {
    if (!this.hasActiveFunctionalGroup) {
      this.startFunctionalGroup({}, undefined);
    }
  }

  getActiveFunctionalGroup() {
    return this.functionalGroups[this.functionalGroups.length - 1];
  }

  startFunctionalGroup(meta: EdiFunctionalGroupMeta, startSegment: EdiSegment | undefined): EdiFunctionalGroup {
    const ediFunctionalGroup = new EdiFunctionalGroup(meta, this);
    if (startSegment) startSegment.interchangeParent = this;
    ediFunctionalGroup.startSegment = startSegment;
    this.functionalGroups.push(ediFunctionalGroup);
    this.hasActiveFunctionalGroup = true;
    return ediFunctionalGroup;
  }

  endFunctionalGroup(endSegment: EdiSegment): EdiFunctionalGroup {
    this.hasActiveFunctionalGroup = false;
    endSegment.interchangeParent = this;
    const activeFunctionalGroup = this.getActiveFunctionalGroup();
    activeFunctionalGroup.endSegment = endSegment;
    return activeFunctionalGroup;
  }

  startTransactionSet(meta: EdiTransactionSetMeta, startSegment: EdiSegment): EdiTransactionSet {
    this.ensureActiveFunctionalGroup();
    return this.getActiveFunctionalGroup().startTransactionSet(meta, startSegment);
  }

  endTransactionSet(endSegment: EdiSegment): EdiTransactionSet {
    return this.getActiveFunctionalGroup().endTransactionSet(endSegment);
  }

  addSegment(segment: EdiSegment): void {
    this.ensureActiveFunctionalGroup();
    this.getActiveFunctionalGroup().addSegment(segment);
  }

  getSegments(withoutLoop?: boolean): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.functionalGroups.flatMap(i => i.getSegments(withoutLoop)));
    if (this.endSegment) result.push(this.endSegment);
    return result;
  }

  getId(): string | undefined {
    if (this.startSegment?.id === "ISA" && this.startSegment.elements.length >= 13) {
      return this.startSegment.elements[12].value;
    } else if (this.startSegment?.id === "UNB" && this.startSegment.elements.length >= 5) {
      return this.startSegment.elements[4].value;
    } else {
      return undefined;
    }
  }

  getEndId(): string | undefined {
    return this.getEndIdElement()?.value;
  }

  getEndIdElement(): EdiElement | undefined {
    if (this.endSegment?.id === "IEA" && this.endSegment.elements.length >= 2) {
      return this.endSegment.elements[1];
    } else if (this.endSegment?.id === "UNZ" && this.endSegment.elements.length >= 2) {
      return this.endSegment.elements[1];
    } else {
      return undefined;
    }
  }

  getControlCount(): number | undefined {
    return Utils.getStringAsInt(this.getControlCountElement()?.value);
  }

  getControlCountElement(): EdiElement | undefined {
    if (this.endSegment?.id === "IEA" && this.endSegment.elements.length >= 1) {
      return this.endSegment.elements[0];
    } else if (this.endSegment?.id === "UNZ" && this.endSegment.elements.length >= 1) {
      return this.endSegment.elements[0];
    } else {
      return undefined;
    }
  }

  getRealControlCount(): number | undefined {
    if (this.functionalGroups.length > 0 && this.functionalGroups[0].isFake()) {
      return this.functionalGroups.reduce((s, cur) => s + cur.transactionSets.length, 0);
    } else {
      return this.functionalGroups.length;
    }
  }

  getFirstSegment(): EdiSegment | undefined {
    const segments = this.getSegments(true);
    if (segments.length === 0) return undefined;
    return segments[0];
  }

  getLastSegment(): EdiSegment | undefined {
    const segments = this.getSegments(true);
    if (segments.length === 0) return undefined;
    return segments[segments.length - 1];
  }

  getSelfErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    if (context.standardOptions.interchangeStartSegmentName && !this.startSegment) {
      errors.push({
        error: `Segment ${context.standardOptions.interchangeStartSegmentName} not found.`,
        code: DiagnosticErrors.SEGMENT_NOT_FOUND,
        severity: DiagnosticErrorSeverity.ERROR,
      });
    }
    if (context.standardOptions.interchangeEndSegmentName && !this.endSegment) {
      errors.push({
        error: `Segment ${context.standardOptions.interchangeEndSegmentName} not found.`,
        code: DiagnosticErrors.SEGMENT_NOT_FOUND,
        severity: DiagnosticErrorSeverity.ERROR,
      });
    }

    if (this.startSegment && this.endSegment) {
      const startId = this.getId();
      const endId = this.getEndId();
      if (startId && startId !== endId) {
        errors.push({
          error: `Wrong interchange control reference, supposed to be ${startId}, got ${endId}`,
          code: DiagnosticErrors.INVALID_VALUE,
          severity: DiagnosticErrorSeverity.ERROR,
          errorElement: this.getEndIdElement()
        });
      }
  
      const controlCount = this.getControlCount();
      const realControlCount = this.getRealControlCount();
      if (controlCount !== realControlCount) {
        errors.push({
          error: `Wrong interchange control count, supposed to be ${realControlCount}, got ${controlCount}`,
          code: DiagnosticErrors.INVALID_VALUE,
          severity: DiagnosticErrorSeverity.ERROR,
          errorElement: this.getControlCountElement()
        });
      }
    }

    if (this.startSegment) {
      errors.push(...this.startSegment.getErrors(context));
    }

    if (this.endSegment) {
      errors.push(...this.endSegment.getErrors(context));
    }

    return errors;
  }

  getErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors = this.getSelfErrors(context);
    return errors.concat(this.functionalGroups.flatMap((functionalGroup) => functionalGroup.getErrors(context)).filter(i => i));
  }

  getFormatString(options: EdiFormattingOptions): string {
    return formatEdiDocumentPartsSegment({
      startSegment: this.startSegment,
      endSegment: this.endSegment,
      children: this.functionalGroups,
      lineBreakCount: 2,
      options,
    });
  }

  public toString() {
    return this.getFormatString(EdiFormattingOptions.TAB_SIZE_0);
  }
}

export class EdiDocumentSeparators {
  public segmentSeparator?: string;
  public dataElementSeparator?: string;
  public componentElementSeparator?: string;
  public releaseCharacter?: string; // escape char
}

export class EdiDocument implements IEdiMessageResult<IEdiDocument>, IDiagnosticErrorAble {
  separators: EdiDocumentSeparators;
  interchanges: EdiInterchange[];

  separatorsSegment?: EdiSegment; // ISA
  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  standardOptions: EdiStandardOptions;

  private hasActiveInterchange: boolean = false;

  constructor(separators: EdiDocumentSeparators, standardOptions: EdiStandardOptions) {
    this.separators = separators;
    this.standardOptions = standardOptions;
    this.interchanges = [];
  }

  getIResult(): IEdiDocument {
    return {
      interchanges: this.interchanges.map(interchange => interchange.getIResult()),

      separatorsSegment: this.separatorsSegment?.getIResult(),
      startSegment: this.startSegment?.getIResult(),
      endSegment: this.endSegment?.getIResult(),
    };
  }

  ensureActiveInterchange(): void {
    if (!this.hasActiveInterchange) {
      this.startInterchange({}, undefined);
    }
  }

  getActiveInterchange() {
    return this.interchanges[this.interchanges.length - 1];
  }

  addSeparatorsSegment(separatorsSegment: EdiSegment): void {
    separatorsSegment.documentParent = this;
    this.separatorsSegment = separatorsSegment;
  }

  startInterchange(meta: EdiInterchangeMeta, startSegment: EdiSegment | undefined): EdiInterchange {
    const ediInterchange = new EdiInterchange(meta, this);
    if (startSegment) startSegment.documentParent = this;
    ediInterchange.startSegment = startSegment;
    this.interchanges.push(ediInterchange);
    this.hasActiveInterchange = true;
    return ediInterchange;
  }

  endInterchange(endSegment: EdiSegment): EdiInterchange {
    this.hasActiveInterchange = false;
    endSegment.documentParent = this;
    const activeInterchange = this.getActiveInterchange();
    activeInterchange.endSegment = endSegment;
    return activeInterchange;
  }

  startFunctionalGroup(meta: EdiFunctionalGroupMeta, startSegment: EdiSegment | undefined): EdiFunctionalGroup {
    this.ensureActiveInterchange();
    return this.getActiveInterchange().startFunctionalGroup(meta, startSegment);
  }

  endFunctionalGroup(endSegment: EdiSegment): EdiFunctionalGroup {
    return this.getActiveInterchange().endFunctionalGroup(endSegment);
  }

  startTransactionSet(meta: EdiTransactionSetMeta, startSegment: EdiSegment): EdiTransactionSet {
    this.ensureActiveInterchange();
    return this.getActiveInterchange().startTransactionSet(meta, startSegment);
  }

  endTransactionSet(endSegment: EdiSegment): EdiTransactionSet {
    return this.getActiveInterchange().endTransactionSet(endSegment);
  }

  addSegment(segment: EdiSegment): void {
    this.ensureActiveInterchange();
    this.getActiveInterchange().addSegment(segment);
  }

  getSegments(withoutLoop?: boolean): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.separatorsSegment) result.push(this.separatorsSegment);
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.interchanges.flatMap(i => i.getSegments(withoutLoop)));
    if (this.endSegment) result.push(this.endSegment);
    return result;
  }

  getSelfErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    if (this.standardOptions.separatorsSegmentName && !this.separatorsSegment) {
      errors.push({
        error: `Segment ${this.standardOptions.separatorsSegmentName} not found.`,
        code: DiagnosticErrors.SEGMENT_NOT_FOUND,
        severity: DiagnosticErrorSeverity.WARNING,
      });
    }

    return errors;
  }

  getErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors = this.getSelfErrors(context);
    return errors.concat(this.interchanges.flatMap((interchange) => interchange.getErrors(context)).filter(i => i));
  }

  getFormatString(options: EdiFormattingOptions): string {
    return formatEdiDocumentPartsSegment({
      startSegment: this.startSegment,
      endSegment: this.endSegment,
      children: this.interchanges,
      lineBreakCount: 2,
      options,
      separatorsSegment: this.separatorsSegment,
    });
  }

  public toString() {
    return this.getFormatString(EdiFormattingOptions.TAB_SIZE_0);
  }
}

export interface EdiStandardOptions {
  separatorsSegmentName?: string;

  interchangeStartSegmentName: string;
  interchangeEndSegmentName?: string;

  isFunctionalGroupSupport: boolean;
  functionalGroupStartSegmentName?: string;
  functionalGroupEndSegmentName?: string;

  transactionSetStartSegmentName: string;
  transactionSetEndSegmentName: string;
}

type ParseInterchangeMetaFunc = (interchangeSegment: EdiSegment | undefined) => EdiInterchangeMeta;
type ParseFunctionalGroupMetaFunc = (interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment) => EdiFunctionalGroupMeta;
type ParseTransactionSetMetaFunc = (interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment, transactionSetSegment: EdiSegment) => EdiTransactionSetMeta;
type LoadSchemaFunc = (meta: EdiTransactionSetMeta) => Promise<void>;
type UnloadSchemaFunc = () => void;
type LoadTransactionSetStartSegmentSchemaFunc = (segment: EdiSegment) => Promise<EdiSegment>;
type AfterEndTransactionSetFunc = (transactionSet: EdiTransactionSet) => Promise<void>;

export class EdiDocumentBuilder {
  private options: EdiStandardOptions;
  private ediDocument: EdiDocument;
  private interchangeSegment?: EdiSegment;
  private functionalGroupSegment?: EdiSegment;

  parseInterchangeMetaFunc?: ParseInterchangeMetaFunc;
  parseFunctionalGroupMetaFunc?: ParseFunctionalGroupMetaFunc;
  parseTransactionSetMetaFunc?: ParseTransactionSetMetaFunc;
  loadSchemaFunc?: LoadSchemaFunc;
  unloadSchemaFunc?: UnloadSchemaFunc;
  loadTransactionSetStartSegmentSchemaFunc?: LoadTransactionSetStartSegmentSchemaFunc;
  afterEndTransactionSetFunc?: AfterEndTransactionSetFunc;

  constructor(separators: EdiDocumentSeparators, options: EdiStandardOptions) {
    this.ediDocument = new EdiDocument(separators, options);
    this.options = options;
  }

  async addSegment(segment: EdiSegment): Promise<void> {
    if (this.options.separatorsSegmentName && segment.id === this.options.separatorsSegmentName) {
      this.ediDocument.addSeparatorsSegment(segment);
    } else if (segment.id === this.options.interchangeStartSegmentName) {
      this.interchangeSegment = segment;
      // TODO(Deric): register func
      const interchangeMeta = this.parseInterchangeMetaFunc!(segment);
      this.ediDocument.startInterchange(interchangeMeta, segment);
    } else if (this.options.interchangeEndSegmentName && segment.id === this.options.interchangeEndSegmentName) {
      this.ediDocument.endInterchange(segment);
      this.interchangeSegment = undefined;
    } else if (segment.id === this.options.functionalGroupStartSegmentName) {
      this.functionalGroupSegment = segment;
      // TODO(Deric): register func
      const functionalGroupMeta = this.parseFunctionalGroupMetaFunc!(this.interchangeSegment, segment);
      this.ediDocument.startFunctionalGroup(functionalGroupMeta, segment);
    } else if (segment.id === this.options.functionalGroupEndSegmentName) {
      this.ediDocument.endFunctionalGroup(segment);
      this.functionalGroupSegment = undefined;
    } else if (segment.id === this.options.transactionSetStartSegmentName) {
      const transactionSetMeta = this.parseTransactionSetMetaFunc!(this.interchangeSegment, this.functionalGroupSegment!, segment);
      if (this.loadSchemaFunc) {
        await this.loadSchemaFunc(transactionSetMeta);
        if (this.loadTransactionSetStartSegmentSchemaFunc) {
          segment = await this.loadTransactionSetStartSegmentSchemaFunc(segment);
        }
      }
      this.ediDocument.startTransactionSet(transactionSetMeta, segment);
    } else if (segment.id === this.options.transactionSetEndSegmentName) {
      const transactionSet = this.ediDocument.endTransactionSet(segment);
      if (this.afterEndTransactionSetFunc) await this.afterEndTransactionSetFunc(transactionSet);
      this.unloadSchemaFunc && this.unloadSchemaFunc();
    } else {
      this.ediDocument.addSegment(segment);
    }
  }

  buildEdiDocument(): EdiDocument {
    return this.ediDocument;
  }

  onParseInterchangeMeta(parseInterchangeMetaFunc: ParseInterchangeMetaFunc) {
    this.parseInterchangeMetaFunc = parseInterchangeMetaFunc;
  }

  onParseFunctionalGroupMeta(parseFunctionalGroupMetaFunc: ParseFunctionalGroupMetaFunc) {
    this.parseFunctionalGroupMetaFunc = parseFunctionalGroupMetaFunc;
  }

  onParseTransactionSetMeta(parseTransactionSetMetaFunc: ParseTransactionSetMetaFunc) {
    this.parseTransactionSetMetaFunc = parseTransactionSetMetaFunc;
  }

  onLoadSchema(loadSchemaFunc: LoadSchemaFunc) {
    this.loadSchemaFunc = loadSchemaFunc;
  }

  onUnloadSchema(unloadSchemaFunc: UnloadSchemaFunc) {
    this.unloadSchemaFunc = unloadSchemaFunc;
  }

  onLoadTransactionSetStartSegmentSchema(loadTransactionSetStartSegmentSchemaFunc: LoadTransactionSetStartSegmentSchemaFunc) {
    this.loadTransactionSetStartSegmentSchemaFunc = loadTransactionSetStartSegmentSchemaFunc;
  }

  onAfterEndTransactionSet(afterEndTransactionSetFunc: AfterEndTransactionSetFunc) {
    this.afterEndTransactionSetFunc = afterEndTransactionSetFunc;
  }
}

export class EdiFormattingOptions {
  tabSize: number;
  insertSpaces: boolean;

  static TAB_SIZE_0: EdiFormattingOptions = new EdiFormattingOptions(0, true);

  constructor(tabSize: number, insertSpaces: boolean) {
    this.tabSize = tabSize;
    this.insertSpaces = insertSpaces;
  }

  getFormatString() {
    if (this.insertSpaces) {
      return Array(this.tabSize).fill(" ").join("");
    } else {
      return "\t";
    }
  }
}

function formatEdiDocumentPartsSegment<T extends EdiInterchange | EdiFunctionalGroup | EdiTransactionSet | EdiSegment>({
  startSegment,
  endSegment,
  children,
  lineBreakCount,
  options,
  separatorsSegment,
}: {
  startSegment?: EdiSegment,
  endSegment?: EdiSegment,
  children: T[],
  lineBreakCount: number,
  options: EdiFormattingOptions,
  separatorsSegment?: EdiSegment
}): string {
  if (!children) children = [];
  let lineBreaks: string;
  if (children.length === 1) {
    lineBreaks = constants.ediDocument.lineBreak;
  } else {
    lineBreaks = Array(lineBreakCount).fill(constants.ediDocument.lineBreak).join("");
  }
  return [
    separatorsSegment,
    startSegment,
    ...children.map(i => i.getFormatString(options)),
    endSegment,
  ].filter(i => i).join(lineBreaks);
}
