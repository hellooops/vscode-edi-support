import { EdiType } from "../parser/entities";
import * as constants from "../constants";
import { EdiQualifier } from "../schemas/schemas";


// "ediSupport.customSchemas": {
//   "x12": {
//     "00401": {
//       "qualifiers": {
//         "Date/Time Qualifier": {
//           "value": "desc"
//         }
//       }
//     }
//   }
// }


export type Conf_Qualifier = Record<string, string>;

export type Conf_Qualifiers = Record<string, Conf_Qualifier>;

export interface Conf_Release {
  qualifiers?: Conf_Qualifiers;
}

export interface Conf_EdiType {
  [key: string]: Conf_Release;
}

export type Conf_Supported_EdiType = "x12" | "edifact" | "vda";

export type Conf_CustomSchema = {
  [key in Conf_Supported_EdiType]?: Conf_EdiType;
};

export class Conf_Utils {
  static addQualifier(conf_schema: Conf_CustomSchema, ediType: Conf_Supported_EdiType, release: string, qualifier: string, code: string, desc: string) {
    if (!conf_schema[ediType]) conf_schema[ediType] = {};

    if (!conf_schema[ediType][release]) {
      conf_schema[ediType][release] = { qualifiers: {} };
    }

    const conf_schema_qualifiers = conf_schema[ediType][release].qualifiers!;

    const qualifierKeys = Object.keys(conf_schema_qualifiers);
    if (!qualifierKeys.includes(qualifier)) {
      conf_schema_qualifiers[qualifier] = {};
    }

    const qualifierCodeKeys = Object.keys(conf_schema_qualifiers[qualifier]);
    if (!qualifierCodeKeys.includes(code)) {
      conf_schema_qualifiers[qualifier][code] = desc;
    }
  }

  static getQualifiers(conf_schema: Conf_CustomSchema | undefined, ediType: Conf_Supported_EdiType, release: string): { qualifier: string, code: string, desc: string }[] {
    const qualifiers = conf_schema?.[ediType]?.[release].qualifiers;
    if (!qualifiers) return [];
    return Object.keys(qualifiers).flatMap(qualifier => {
      return Object.keys(qualifiers[qualifier]).map(code => {
        return {
          qualifier,
          code,
          desc: qualifiers[qualifier][code]
        };
      });
    });
  }
}
