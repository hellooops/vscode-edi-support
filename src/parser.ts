export class EdifactParser {
  public constructor() {}

  public parseHeader(document: string) {}
  public parseSegments(document: string): EdiSegment[] {
    let separater = this.escapeCharRegex("'");
    let regex = new RegExp(`\\b([\\s\\S]*?)(${separater})`, "g");
    let results = this.parseRegex(regex, document, (x) =>
      this.parseSegment(x[0], x.index, x.index + x[0].length - 1, x[2])
    );

    return results;
  }

  public parseSegment(segmentStr: string, startIndex: number, endIndex: number, endingDelimiter: string): EdiSegment {
    const segment = new EdiSegment();
    segment.endingDelimiter = endingDelimiter;
    segment.startIndex = startIndex;
    segment.endIndex = endIndex;
    segment.length = segmentStr.length;

    segment.id = segmentStr.substring(0, 3);
    segment.elements = [];

    let element: EdiElement = null;
    let elementIndex = 0;
    let subElementIndex = 0;
    let elementName = null;
    for (let i = 3; i < segmentStr.length; i++) {
      const c: string = segmentStr[i];
      if (c === "+" || c === "'" || c === ":") {
        if (element) {
          element.endIndex = i - 1;
          element.value = segmentStr.substring(element.startIndex + 1, element.endIndex + 1);
          element = null;
        }
      } else if (c === "+" || c === "'") {
        subElementIndex = 0;
      }

      if (c === "+") {
        elementIndex++;
        element = new EdiElement();
        element.type = ElementType.dataElement;
        element.startIndex = i;
        element.name = this.pad(elementIndex, 2, "0");
        elementName = element.name;
        element.separator = "+";
        segment.elements.push(element);
      } else if (c === ":") {
        subElementIndex++;
        element = new EdiElement();
        element.type = ElementType.componentElement;
        element.startIndex = i;
        element.name = `${elementName}-${this.pad(subElementIndex, 2, "0")}`;
        element.segmentName = segment.id;
        element.separator = ":";
        segment.elements.push(element);
      }
    }

    return segment;
  }

  private parseRegex<T>(exp: RegExp, str: string, selector: (match: RegExpExecArray) => T): Array<T> {
    let results: Array<T> = [];
    let match: RegExpExecArray;
    while ((match = exp.exec(str)) !== null) {
      results.push(selector(match));
    }
    return results;
  }

  private escapeCharRegex(str: string): string {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  private pad(n: number, width: number, z: string = '0') {
      let nStr = n.toString() + '';
      return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
  }
}

export class EdiSegment {
  public startIndex: number;
  public endIndex: number;
  public length: number;
  public id: string;
  public elements: Array<EdiElement>;
  public endingDelimiter: string;

  public toString() {
    return `${this.id}${this.elements.join("")}${this.endingDelimiter}`;
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
  public name: string;
  public segmentName: string;

  public getDesignator() {
    return `${this.segmentName}${this.name}`;
  }

  public toString() {
    return this.separator + this.value;
  }
}
