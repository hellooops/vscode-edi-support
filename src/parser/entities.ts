/// <reference path="../../env.d.ts" />

import { EdiReleaseSchemaElement, EdiReleaseSchemaSegment } from "../schemas/schemas";
import * as constants from "../constants";
import Utils from "../utils/utils";

interface IEdiMessageResult<T> {
  getIResult(): T;
}

export class EdiVersion implements IEdiMessageResult<IEdiVersion> {
  public release?: string; // D96A
  public version?: string; // ORDERS

  constructor(release?: string, version?: string) {
    this.release = release;
    this.version = version;
  }

  getIResult(): IEdiVersion {
    return this;
  }

  getFormattedString(): string {
    if (this.release && this.version) {
      return `${this.release} ${this.version}`;
    } else if (this.release && !this.version) {
      return this.release;
    } else if (!this.release && this.version) {
      return this.version;
    } else {
      return "";
    }
  }
}

export class EdiSegment implements IEdiMessageResult<IEdiSegment>, IDiagnosticErrorAble {
  public id: string;
  public startIndex: number;
  public endIndex: number;
  public length: number;
  public elements: Array<EdiElement>;
  public endingDelimiter: string;
  public ediReleaseSchemaSegment?: EdiReleaseSchemaSegment;
  public isInvalidSegment: boolean;

  segmentStr?: string;

  transactionSetParent?: EdiTransactionSet;
  functionalGroupParent?: EdiFunctionalGroup;
  interchangeParent?: EdiInterchange;
  documentParent?: EdiDocument;

  constructor(id: string, startIndex: number, endIndex: number, length: number, endingDelimiter: string) {
    this.id = id;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.length = length;
    this.endingDelimiter = endingDelimiter;
    this.elements = [];
    this.isInvalidSegment = false;
  }

  public getKey(): string {
    return `seg-${this.id}-${this.startIndex}`
  }

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

    if (!this.elements) return errors;
    return errors.concat(this.elements.flatMap(el => el.getErrors(context)));
  }

  getIResult(): IEdiSegment {
    return {
      key: this.getKey(),
      id: this.id,
      desc: this.ediReleaseSchemaSegment!.desc,
      purpose: this.ediReleaseSchemaSegment!.purpose,
      elements: this.elements.map(e => e.getIResult())
    };
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
}

export interface DiagnoscticsContext {
  segment?: EdiSegment;
  element?: EdiElement;
  ediType: string;
  standardOptions: EdiStandardOptions;
}

export class EdiElement implements IEdiMessageResult<IEdiElement>, IDiagnosticErrorAble {
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
    this.segment = segment;
    this.type = type;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.separator = separator;
    this.segmentName = segmentName;
    this.segmentStartIndex = segmentStartIndex;
    this.designatorIndex = designatorIndex;
  }

  public getKey(): string {
    return `ele-${this.getDesignator()}-${this.segmentStartIndex}-${this.startIndex}`;
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
    const errors = this.getCustomElementErrors(context);
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

  getCustomElementErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    // if (context.ediType === EdiType.X12) {
    //   if (context.element!.getDesignator() === "SE01") {
    //     errors.push(...this.getErrors_SE01(context));
    //   }
    // } else if (context.ediType === EdiType.EDIFACT) {
    //   if (context.element!.getDesignator() === "UNT01") {
    //     errors.push(...this.getErrors_UNT01(context));
    //   }
    // }

    return errors;
  }

  // getErrors_SE01(context: DiagnoscticsContext): DiagnosticError[] {
  //   const errors: DiagnosticError[] = [];
  //   const endSegmentIndex = context.segments.findIndex(segment => segment === context.segment);
  //   let startSegmentIndex = -1;
  //   context.segments.forEach((segment, i) => {
  //     if (i >= endSegmentIndex) return;
  //     if (segment.id === "ST") {
  //       startSegmentIndex = i;
  //     }
  //   });
  //   if (startSegmentIndex === -1) {
  //     return errors;
  //   }
  //   // To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)
  //   const valueExpected = (endSegmentIndex - startSegmentIndex + 1).toString();
  //   if (context.element!.value !== valueExpected) {
  //     errors.push({
  //       error: `${valueExpected} is expected, got ${this.value}. There are ${valueExpected} transmitted segments in the message.`,
  //       code: DiagnosticErrors.WRONG_SE01,
  //       severity: DiagnosticErrorSeverity.ERROR
  //     });
  //   }

  //   return errors;
  // }

  // getErrors_UNT01(context: DiagnoscticsContext): DiagnosticError[] {
  //   const errors: DiagnosticError[] = [];
  //   const endSegmentIndex = context.segments.findIndex(segment => segment === context.segment);
  //   let startSegmentIndex = -1;
  //   context.segments.forEach((segment, i) => {
  //     if (i >= endSegmentIndex) return;
  //     if (segment.id === "UNH") {
  //       startSegmentIndex = i;
  //     }
  //   });

  //   if (startSegmentIndex === -1) {
  //     return errors;
  //   }
  //   // Control count of number of segments in a message.
  //   const valueExpected = (endSegmentIndex - startSegmentIndex + 1).toString();
  //   if (context.element!.value !== valueExpected) {
  //     errors.push({
  //       error: `${valueExpected} is expected, got ${this.value}. There are ${valueExpected} transmitted segments in the message.`,
  //       code: DiagnosticErrors.WRONG_UNT01,
  //       severity: DiagnosticErrorSeverity.ERROR
  //     });
  //   }

  //   return errors;
  // }

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
      key: this.getKey(),
      type: this.type,
      value: this.value,
      components: this.components?.map(e => e.getIResult()),
      id: this.ediReleaseSchemaElement!.id,
      desc: this.ediReleaseSchemaElement!.desc,
      dataType: this.ediReleaseSchemaElement!.dataType,
      required: this.ediReleaseSchemaElement!.required,
      minLength: this.ediReleaseSchemaElement!.minLength,
      maxLength: this.ediReleaseSchemaElement!.maxLength,
      codeValue,
      definition: this.ediReleaseSchemaElement!.definition,
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

export class EdiTransactionSet implements IDiagnosticErrorAble {
  ediVersion: EdiVersion;
  segments: EdiSegment[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  functionalGroup: EdiFunctionalGroup;

  constructor(ediVersion: EdiVersion, functionalGroup: EdiFunctionalGroup) {
    this.ediVersion = ediVersion;
    this.segments = [];
    this.functionalGroup = functionalGroup;
  }

  getIResult(): IEdiMessage {
    return {
      ediVersion: this.ediVersion.getIResult(),
      segments: this.segments.map(segment => segment.getIResult())
    };
  }

  addSegment(segment: EdiSegment): void {
    segment.transactionSetParent = this;
    this.segments.push(segment);
  }

  getSegments(): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.segments);
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

  getFirstSegment(): EdiSegment | undefined {
    const segments = this.getSegments();
    if (segments.length === 0) return undefined;
    return segments[0];
  }

  getLastSegment(): EdiSegment | undefined {
    const segments = this.getSegments();
    if (segments.length === 0) return undefined;
    return segments[segments.length - 1];
  }

  getSelfErrors(context: DiagnoscticsContext): DiagnosticError[] {
    return [];
  }

  getErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors = this.getSelfErrors(context);
    return errors.concat(this.segments.flatMap((segment) => segment.getErrors(context)).filter(i => i));
  }

  public toString() {
    return formatEdiDocumentPartsSegment(
      this.startSegment,
      this.endSegment,
      this.segments,
      1
    );
  }
}

export class EdiFunctionalGroup implements IDiagnosticErrorAble {
  transactionSets: EdiTransactionSet[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  interchange: EdiInterchange;

  private hasActiveTransactionSet: boolean = false;

  constructor(interchange: EdiInterchange) {
    this.transactionSets = [];
    this.interchange = interchange;
  }

  getActiveTransactionSet() {
    return this.transactionSets[this.transactionSets.length - 1];
  }

  startTransactionSet(ediVersion: EdiVersion, startSegment: EdiSegment): void {
    const ediTransactionSet = new EdiTransactionSet(ediVersion, this);
    if (startSegment) startSegment.functionalGroupParent = this;
    ediTransactionSet.startSegment = startSegment;
    this.transactionSets.push(ediTransactionSet);
    this.hasActiveTransactionSet = true;
  }

  endTransactionSet(endSegment: EdiSegment): void {
    this.hasActiveTransactionSet = false;
    endSegment.functionalGroupParent = this;
    this.getActiveTransactionSet().endSegment = endSegment;
  }

  addSegment(segment: EdiSegment): void {
    if (!this.hasActiveTransactionSet) {
      throw new Error("Functional Group is invalid");
    }

    this.transactionSets[this.transactionSets.length - 1].addSegment(segment);
  }

  getSegments(): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.transactionSets.flatMap(i => i.getSegments()));
    if (this.endSegment) result.push(this.endSegment);
    return result;
  }

  getId(): string | undefined {
    if (this.startSegment?.id === "GS" && this.startSegment.elements.length >= 6) {
      return this.startSegment.elements[5].value;
    } else if (!this.startSegment) {
      return "";
    } else {
      return undefined
    }
  }

  isFake(): boolean {
    return !this.startSegment;
  }

  getFirstSegment(): EdiSegment | undefined {
    const segments = this.getSegments();
    if (segments.length === 0) return undefined;
    return segments[0];
  }

  getLastSegment(): EdiSegment | undefined {
    const segments = this.getSegments();
    if (segments.length === 0) return undefined;
    return segments[segments.length - 1];
  }

  getSelfErrors(context: DiagnoscticsContext): DiagnosticError[] {
    return [];
  }

  getErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors = this.getSelfErrors(context);
    return errors.concat(this.transactionSets.flatMap((transactionSet) => transactionSet.getErrors(context)).filter(i => i));
  }

  public toString() {
    return formatEdiDocumentPartsSegment(
      this.startSegment,
      this.endSegment,
      this.transactionSets,
      2
    );
  }
}

export class EdiInterchange implements IDiagnosticErrorAble {
  // TODO(Deric): Meta info
  functionalGroups: EdiFunctionalGroup[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  document: EdiDocument;

  private hasActiveFunctionalGroup: boolean = false;

  constructor(document: EdiDocument) {
    this.functionalGroups = [];
    this.document = document;
  }

  ensureActiveFunctionalGroup(): void {
    if (!this.hasActiveFunctionalGroup) {
      this.startFunctionalGroup(undefined);
    }
  }

  getActiveFunctionalGroup() {
    return this.functionalGroups[this.functionalGroups.length - 1];
  }

  startFunctionalGroup(startSegment: EdiSegment | undefined): void {
    const ediFunctionalGroup = new EdiFunctionalGroup(this);
    if (startSegment) startSegment.interchangeParent = this;
    ediFunctionalGroup.startSegment = startSegment;
    this.functionalGroups.push(ediFunctionalGroup);
    this.hasActiveFunctionalGroup = true;
  }

  endFunctionalGroup(endSegment: EdiSegment): void {
    this.hasActiveFunctionalGroup = false;
    endSegment.interchangeParent = this;
    this.getActiveFunctionalGroup().endSegment = endSegment;
  }

  startTransactionSet(ediVersion: EdiVersion, startSegment: EdiSegment): void {
    this.ensureActiveFunctionalGroup();
    this.getActiveFunctionalGroup().startTransactionSet(ediVersion, startSegment);
  }

  endTransactionSet(endSegment: EdiSegment): void {
    this.getActiveFunctionalGroup().endTransactionSet(endSegment);
  }

  addSegment(segment: EdiSegment): void {
    this.ensureActiveFunctionalGroup();
    this.getActiveFunctionalGroup().addSegment(segment);
  }

  getSegments(): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.functionalGroups.flatMap(i => i.getSegments()));
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
    return Utils.getStringAsInt(this.getInterchangeControlElement()?.value);
  }

  getInterchangeControlElement(): EdiElement | undefined {
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
      return this.functionalGroups.reduce((s, cur) => s + cur.transactionSets.length, 0)
    } else {
      return this.functionalGroups.length;
    }
  }

  getFirstSegment(): EdiSegment | undefined {
    const segments = this.getSegments();
    if (segments.length === 0) return undefined;
    return segments[0];
  }

  getLastSegment(): EdiSegment | undefined {
    const segments = this.getSegments();
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
        errorElement: this.getInterchangeControlElement()
      });
    }

    return errors;
  }

  getErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors = this.getSelfErrors(context);
    return errors.concat(this.functionalGroups.flatMap((functionalGroup) => functionalGroup.getErrors(context)).filter(i => i));
  }

  public toString() {
    return formatEdiDocumentPartsSegment(
      this.startSegment,
      this.endSegment,
      this.functionalGroups,
      2
    );
  }
}

export class EdiDocumentSeparators {
  public segmentSeparator?: string;
  public dataElementSeparator?: string;
  public componentElementSeparator?: string;
  public releaseCharacter?: string; // escape char
}

export class EdiDocument implements IDiagnosticErrorAble {
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

  ensureActiveInterchange(): void {
    if (!this.hasActiveInterchange) {
      this.startInterchange(undefined);
    }
  }

  getActiveInterchange() {
    return this.interchanges[this.interchanges.length - 1];
  }

  addSeparatorsSegment(separatorsSegment: EdiSegment): void {
    separatorsSegment.documentParent = this;
    this.separatorsSegment = separatorsSegment;
  }

  startInterchange(startSegment: EdiSegment | undefined): void {
    const ediInterchange = new EdiInterchange(this);
    if (startSegment) startSegment.documentParent = this;
    ediInterchange.startSegment = startSegment;
    this.interchanges.push(ediInterchange);
    this.hasActiveInterchange = true;
  }

  endInterchange(endSegment: EdiSegment): void {
    this.hasActiveInterchange = false;
    endSegment.documentParent = this;
    this.getActiveInterchange().endSegment = endSegment;
  }

  startFunctionalGroup(startSegment: EdiSegment | undefined): void {
    this.ensureActiveInterchange();
    this.getActiveInterchange().startFunctionalGroup(startSegment);
  }

  endFunctionalGroup(endSegment: EdiSegment): void {
    this.getActiveInterchange().endFunctionalGroup(endSegment);
  }

  startTransactionSet(ediVersion: EdiVersion, startSegment: EdiSegment): void {
    this.ensureActiveInterchange();
    this.getActiveInterchange().startTransactionSet(ediVersion, startSegment);
  }

  endTransactionSet(endSegment: EdiSegment): void {
    this.getActiveInterchange().endTransactionSet(endSegment);
  }

  addSegment(segment: EdiSegment): void {
    this.ensureActiveInterchange();
    this.getActiveInterchange().addSegment(segment);
  }

  getSegments(): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.separatorsSegment) result.push(this.separatorsSegment);
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.interchanges.flatMap(i => i.getSegments()));
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

  public toString() {
    return formatEdiDocumentPartsSegment(
      this.startSegment,
      this.endSegment,
      this.interchanges,
      2,
      this.separatorsSegment
    );
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

type ParseReleaseAndVersionFunc = (interchangeSegment: EdiSegment | undefined, functionalGroupSegment: EdiSegment, transactionSetSegment: EdiSegment) => EdiVersion;
type LoadSchemaFunc = (ediVersion: EdiVersion) => Promise<void>;
type UnloadSchemaFunc = () => void;
type LoadTransactionSetStartSegmentSchemaFunc = (segment: EdiSegment) => Promise<EdiSegment>;

export class EdiDocumentBuilder {
  private options: EdiStandardOptions;
  private ediDocument: EdiDocument;
  private interchangeSegment?: EdiSegment;
  private functionalGroupSegment?: EdiSegment;

  parseReleaseAndVersionFunc?: ParseReleaseAndVersionFunc;
  loadSchemaFunc?: LoadSchemaFunc;
  unloadSchemaFunc?: UnloadSchemaFunc;
  loadTransactionSetStartSegmentSchemaFunc?: LoadTransactionSetStartSegmentSchemaFunc;

  constructor(separators: EdiDocumentSeparators, options: EdiStandardOptions) {
    this.ediDocument = new EdiDocument(separators, options);
    this.options = options;
  }

  async addSegment(segment: EdiSegment): Promise<void> {
    if (this.options.separatorsSegmentName && segment.id === this.options.separatorsSegmentName) {
      this.ediDocument.addSeparatorsSegment(segment);
    } else if (segment.id === this.options.interchangeStartSegmentName) {
      this.interchangeSegment = segment;
      this.ediDocument.startInterchange(segment);
    } else if (this.options.interchangeEndSegmentName && segment.id === this.options.interchangeEndSegmentName) {
      this.ediDocument.endInterchange(segment);
      this.interchangeSegment = undefined;
    } else if (segment.id === this.options.functionalGroupStartSegmentName) {
      this.functionalGroupSegment = segment;
      this.ediDocument.startFunctionalGroup(segment);
    } else if (segment.id === this.options.functionalGroupEndSegmentName) {
      this.ediDocument.endFunctionalGroup(segment);
      this.functionalGroupSegment = undefined;
    } else if (segment.id === this.options.transactionSetStartSegmentName) {
      const ediReleaseAndVersion = this.parseReleaseAndVersionFunc!(this.interchangeSegment, this.functionalGroupSegment!, segment);
      if (this.loadSchemaFunc) {
        await this.loadSchemaFunc(ediReleaseAndVersion);
        if (this.loadTransactionSetStartSegmentSchemaFunc) {
          segment = await this.loadTransactionSetStartSegmentSchemaFunc(segment);
        }
      }
      this.ediDocument.startTransactionSet(ediReleaseAndVersion, segment);
    } else if (segment.id === this.options.transactionSetEndSegmentName) {
      this.ediDocument.endTransactionSet(segment);
      this.unloadSchemaFunc && this.unloadSchemaFunc();
    } else {
      this.ediDocument.addSegment(segment);
    }
  }

  buildEdiDocument(): EdiDocument {
    return this.ediDocument;
  }

  onParseReleaseAndVersion(parseReleaseAndVersionFunc: ParseReleaseAndVersionFunc) {
    this.parseReleaseAndVersionFunc = parseReleaseAndVersionFunc;
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
}

function formatEdiDocumentPartsSegment<T extends any>(startSegment: EdiSegment | undefined, endSegment: EdiSegment | undefined, children: T[], lineBreakCount: number, separatorsSegment?: EdiSegment): string {
  if (!children) return "";
  let lineBreaks: string;
  if (children.length === 1) {
    lineBreaks = constants.ediDocument.lineBreak;
  } else {
    lineBreaks = Array(lineBreakCount).fill(constants.ediDocument.lineBreak).join("");
  }
  return [
    separatorsSegment,
    startSegment,
    ...children,
    endSegment,
  ].filter(i => i).join(lineBreaks);
}
