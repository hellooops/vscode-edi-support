import { EdiReleaseSchemaElement, EdiReleaseSchemaSegment } from "../schemas/schemas";
import * as constants from "../constants";

export class EdiVersion {
  public release?: string; // D96A
  public version?: string; // ORDERS

  constructor(release?: string, version?: string) {
    this.release = release;
    this.version = version;
  }
}

export class EdiSegment {
  public startIndex: number;
  public endIndex: number;
  public length: number;
  public id: string;
  public elements: Array<EdiElement>;
  public endingDelimiter: string;
  public ediReleaseSchemaSegment?: EdiReleaseSchemaSegment;

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

export class DiagnosticError {
  error: string;
  code: string;
  constructor(error: string, code: string) {
    this.error = error;
    this.code = `Edi Support: ${code}`;
  }
}

export interface DiagnoscticsContext {
  segment: EdiSegment;
  element: EdiElement;
  ediType: string;
  segments: EdiSegment[]
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
  public ediReleaseSchemaElement?: EdiReleaseSchemaElement;

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
        return errors.concat(component.getErrors(context));
      }, errors);
    }

    if (!this.ediReleaseSchemaElement) {
      return errors;
    }

    if (this.value && this.value.length > this.ediReleaseSchemaElement.maxLength) {
      errors.push(
        new DiagnosticError(
          `Element ${this.ediReleaseSchemaElement?.id} is too long. Max length is ${this.ediReleaseSchemaElement.maxLength}, got ${this.value.length}.`,
          "Value too long"
        )
      );
    }

    if (this.value && this.value.length < this.ediReleaseSchemaElement.minLength) {
      errors.push(
        new DiagnosticError(
          `Element ${this.ediReleaseSchemaElement?.id} is too short. Min length is ${this.ediReleaseSchemaElement.minLength}, got ${this.value.length}.`,
          "Value too short"
        )
      );
    }

    if (this.ediReleaseSchemaElement?.required && !this.value) {
      errors.push(
        new DiagnosticError(
          `Element ${this.ediReleaseSchemaElement?.id} is required.`,
          "Value required"
        )
      );
    }

    if (this.ediReleaseSchemaElement.qualifierRef && this.value) {
      const codes = this.ediReleaseSchemaElement.getCodes();
      if (codes) {
        const elementValueCode = this.ediReleaseSchemaElement.getCodeOrNullByValue(this.value);
        if (!elementValueCode) {
          errors.push(
            new DiagnosticError(
              `Invalid code value '${this.value}' for qualifer '${this.ediReleaseSchemaElement.qualifierRef}'.`,
              "Qualifier invalid code"
            )
          );
        }
      }
    }

    return errors;
  }

  getCustomElementErrors(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    if (context.ediType === EdiType.X12) {
      if (context.element.getDesignator() === "SE01") {
        errors.push(...this.getErrors_SE01(context));
      }
    } else if (context.ediType === EdiType.EDIFACT) {
      if (context.element.getDesignator() === "UNT01") {
        errors.push(...this.getErrors_UNT01(context));
      }
    }

    return errors;
  }

  getErrors_SE01(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    const startSegmentIndex = context.segments.findIndex(segment => segment.id === "ST");
    if (startSegmentIndex === -1) {
      return errors;
    }

    const endSegmentIndex = context.segments.findIndex(segment => segment === context.segment);
    if (startSegmentIndex === -1) {
      return errors;
    }
    // To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)
    const valueExpected = (endSegmentIndex - startSegmentIndex + 1).toString();
    if (context.element.value !== valueExpected) {
      errors.push(
        new DiagnosticError(
          `${valueExpected} is expected, got ${this.value}. There are ${valueExpected} transmitted segments in the message.`,
          "Wrong SE01 value"
        )
      );
    }

    return errors;
  }

  getErrors_UNT01(context: DiagnoscticsContext): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    const startSegmentIndex = context.segments.findIndex(segment => segment.id === "UNH");
    if (startSegmentIndex === -1) {
      return errors;
    }

    const endSegmentIndex = context.segments.findIndex(segment => segment === context.segment);
    if (startSegmentIndex === -1) {
      return errors;
    }
    // Control count of number of segments in a message.
    const valueExpected = (endSegmentIndex - startSegmentIndex + 1).toString();
    if (context.element.value !== valueExpected) {
      errors.push(
        new DiagnosticError(
          `${valueExpected} is expected, got ${this.value}. There are ${valueExpected} transmitted segments in the message.`,
          "Wrong UNT01 value"
        )
      );
    }

    return errors;
  }

  public isComposite(): boolean {
    return this.components && this.components.length > 0;
  }

  public toString() {
    return this.separator + this.value;
  }
}

export class EdiMessageSeparators {
  public segmentSeparator?: string;
  public dataElementSeparator?: string;
  public componentElementSeparator?: string;
}

export class EdiType {
  static X12 = constants.ediDocument.x12.name;
  static EDIFACT = constants.ediDocument.edifact.name;
  static UNKNOWN = "unknown";
}