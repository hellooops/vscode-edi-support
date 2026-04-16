type IElementType = "Data Element" | "Component Element";

interface IEdiElement {
  type: IElementType;
  value?: string;
  components?: IEdiElement[];
  id?: string;
  desc?: string;
  dataType?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  codeValue?: string;
  definition?: string;
  length?: number;
  designator: string;
}

interface IEdiSegment {
  id: string;
  segmentStr?: string;
  elements: Array<IEdiElement>;
  desc?: string;
  purpose?: string;
  Loop?: IEdiSegment[];
}

type IEdiType = "x12" | "edifact" | "vda" | "unknown";

interface IMessageInfo {
  version: string;
  name: string;
  introduction: string;
}

interface IEdiTransactionSetMeta {
  release?: string;
  version?: string;
  id?: string;
  messageInfo?: IMessageInfo;
}

interface IEdiTransactionSet {
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
  meta: IEdiInterchangeMeta;
  id?: string;
  functionalGroups: IEdiFunctionalGroup[];
  startSegment?: IEdiSegment;
  endSegment?: IEdiSegment;
}

interface IEdiDocument {
  interchanges: IEdiInterchange[];
  separatorsSegment?: IEdiSegment;
  startSegment?: IEdiSegment;
  endSegment?: IEdiSegment;
  ediType?: IEdiType;
}
