type VcmTemplate<T extends any> = {
  name: string;
  data: T;
};

type Vcm = VcmTemplate<any>;

type VcmFileChange = VcmTemplate<{
  fileName: string;
  text: string;
}>;

type IElementType = "Data Element" | "Component Element";

interface IEdiElement {
  key: string;

  type: IElementType;
  value?: string;
  components?: IEdiElement[];

  // EdiReleaseSchemaElement
  id: string;
  desc: string;
  dataType?: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  codeValue?: string;
  definition?: string;
}

interface IEdiSegment {
  key: string;

  id: string;
  elements: Array<IEdiElement>;
  desc?: string;
  purpose: string;
}

type IEdiType = "x12" | "edifact" | "unknown";

interface IEdiTransactionSetMeta {
  release?: string;
  version?: string;
  id?: string;
}

interface IEdiTransactionSet {
  key: string;
  meta: IEdiTransactionSetMeta;
  id?: string;

  segments: IEdiSegment[];

  startSegment?: IEdiSegment;
  endSegment?: IEdiSegment;
}

interface IEdiFunctionalGroupMeta {
  date?: string;
  time?: string;
  id?: string;
}

interface IEdiFunctionalGroup {
  key: string;
  meta: IEdiFunctionalGroupMeta;
  id?: string;

  transactionSets: IEdiTransactionSet[];

  startSegment?: IEdiSegment;
  endSegment?: IEdiSegment;
}

interface IEdiInterchangeMeta {
  senderQualifer?: string;
  senderID?: string;
  receiverQualifer?: string;
  receiverID?: string;
  date?: string;
  time?: string;
  id?: string;
}

interface IEdiInterchange {
  key: string;
  meta: IEdiInterchangeMeta;
  id?: string;

  functionalGroups: IEdiFunctionalGroup[];

  startSegment?: IEdiSegment;
  endSegment?: IEdiSegment;
}

interface IEdiDocument {
  interchanges: IEdiInterchange[];

  separatorsSegment?: IEdiSegment; // ISA
  startSegment?: IEdiSegment;
  endSegment?: IEdiSegment;

  ediType?: IEdiType;
}

type VcmDocument = VcmTemplate<IEdiDocument>;

type IActiveContext = {
  segmentKey: string | undefined;
  elementKey: string | undefined;
}

type VcmActiveContext = VcmTemplate<IActiveContext>;
