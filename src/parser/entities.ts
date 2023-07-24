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

  public getErrors(): DiagnosticError[] {
    if (this.components && this.components.length > 0) {
      return this.components.reduce((errors: DiagnosticError[], component: EdiElement) => {
        return errors.concat(component.getErrors());
      }, []);
    }

    if (!this.ediReleaseSchemaElement) {
      return [];
    }

    const errors: DiagnosticError[] = [];
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