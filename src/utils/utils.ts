import MessageInfo from "../interfaces/messageInfo";
import { d96a_message_infos } from "../schemas/edifact_d96a_meta";

export type Nullable<T> = T | null | undefined;

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

  static toString(value: Nullable<any>): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    return value.toString();
  }

  static formatString(value: string, ...args: string[]): string {
    return value.replace(/{(\d+)}/g, (match, index) => {
      return args[index] || "";
    });
  }

  static getStringAsInt(value: string | number | undefined) {
    if (typeof value === 'number') {
      return Math.floor(value);
    } else if (typeof value ==='string') {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        return num;
      }
    }

    return undefined;
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
