export type RawQualifierCodes = Record<string, string>;

export interface RawReleaseSchemaElement {
  Id: string;
  Desc: string;
  DataType?: string;
  Required?: boolean;
  MinLength?: number;
  MaxLength?: number;
  QualifierRef?: string;
  Definition?: string;
  Length?: number;
  Components?: RawReleaseSchemaElement[];
  mock?: boolean;
  [key: string]: unknown;
}

export interface RawReleaseSchemaSegment {
  Desc?: string;
  Purpose?: string;
  Elements?: RawReleaseSchemaElement[];
  mock?: boolean;
  [key: string]: unknown;
}

export interface RawReleaseSchema {
  Release: string;
  Qualifiers?: Record<string, RawQualifierCodes>;
  Segments?: Record<string, RawReleaseSchemaSegment>;
  [key: string]: unknown;
}

export interface RawVersionSchemaTransactionSet {
  Id: string;
  Min?: number;
  Max?: number | "unbounded";
  Loop?: RawVersionSchemaTransactionSet[];
  [key: string]: unknown;
}

export interface RawVersionSchema {
  Release?: string;
  DocumentType?: string;
  Introduction?: string;
  name?: string;
  TransactionSet: RawVersionSchemaTransactionSet[];
  [key: string]: unknown;
}

export interface RawVersionSchemaIndex {
  DocumentTypes?: Record<string, RawVersionSchema>;
  [key: string]: unknown;
}
