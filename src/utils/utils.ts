import MessageInfo from "../interfaces/messageInfo";
import { d96a_message_infos } from "../schemas/edifact_d96a_meta";

export default class Utils {
  static isNullOrUndefined(o: any): boolean {
    return o === null || o === undefined;
  }

  static yyMMddFormat(date: string): string {
    // 140407 -> 14-04-07
    if (!date || date.length !== 6) {
      return date;
    }
    return `${date.substring(0, 2)}-${date.substring(2, 4)}-${date.substring(4, 6)}`;
  }

  static HHmmFormat(time: string): string {
    // 0910 -> 09:10
    // 091035 -> 09:10:35
    if (!time || time.length < 4) {
      return time;
    }
    if (time.length === 4) {
      return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
    }
    return `${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}`;
  }

  static getMessageInfoByDocumentType(documentType: string): MessageInfo | null {
    return d96a_message_infos.find(m => m.documentType === documentType) || null;
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