export default class Utils {
  static isNullOrUndefined(o: any): boolean {
    return o === null || o === undefined;
  }
}

export class SchemaViewerUtils {
  static getSegmentUrl(release: string, segment: string): string {
    if (!release || !segment) {
      return this.getIndexUrl();
    }

    return `https://www.kasoftware.com/schema/edi/edifact/${release}/segments/${segment}/`;
  }

  static getElementUrl(release: string, segment: string, element: string): string {
    if (!release || !segment || !element) {
      return this.getIndexUrl();
    }
    
    return `https://www.kasoftware.com/schema/edi/edifact/${release}/elements/${segment}/${element}/`;
  }

  static getIndexUrl(): string {
    return "https://www.kasoftware.com/schema/";
  }
}

export class StringBuilder {
  private buffer: string[];

  constructor() {
    this.buffer = [];
  }

  public append(value: string): StringBuilder {
    this.buffer.push(value);
    return this;
  }

  public toString(): string {
    return this.buffer.join("");
  }
}