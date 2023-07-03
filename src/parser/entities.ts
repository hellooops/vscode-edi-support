import { EdiReleaseSchemaElement, EdiReleaseSchemaSegment } from "../schemas/schemas";

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

  public getDesignator() {
    return `${this.segmentName}${this.designatorIndex}`;
  }

  public toString() {
    return this.separator + this.value;
  }
}
