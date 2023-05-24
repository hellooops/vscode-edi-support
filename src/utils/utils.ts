export default class Utils {
  static isNullOrUndefined(o: any): boolean {
    return o === null || o === undefined;
  }
}

export class SchemaViewerUtils {
  static getSegmentUrl(release: string, segment: string): string {
    return `https://www.kasoftware.com/schema/edi/edifact/${release}/segments/${segment}/`;
  }

  static getElementUrl(release: string, segment: string, element: string): string {
    return `https://www.kasoftware.com/schema/edi/edifact/${release}/elements/${segment}/${element}/`;
  }
}