import { EdiType } from "../parser/entities";
import * as constants from "../constants";
import { type Nullable } from "./utils";

export class SchemaViewerUtils {
  static getSegmentUrl(ediType: EdiType, release: Nullable<string>, segment: Nullable<string>): string {
    if (!release || !segment) {
      return this.getIndexUrl();
    }

    return `https://www.kasoftware.com/schema/edi/${ediType}/${release}/segments/${segment}/`;
  }

  static getElementUrl(ediType: EdiType, release: Nullable<string>, segment: Nullable<string>, element: Nullable<string>): string {
    if (!release || !segment || !element) {
      return this.getIndexUrl();
    }
    
    return `https://www.kasoftware.com/schema/edi/${ediType}/${release}/elements/${segment}/${element}/`;
  }

  static getIndexUrl(): string {
    return constants.common.kasoftware.schemaViewer.url;
  }
}