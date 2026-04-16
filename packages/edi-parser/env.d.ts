type EdiElementType = "Data Element" | "Component Element";

interface EdiElementObject {
  type: EdiElementType;
  value?: string;
  components?: EdiElementObject[];
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

interface EdiSegmentObject {
  id: string;
  segmentStr?: string;
  elements: Array<EdiElementObject>;
  desc?: string;
  purpose?: string;
  Loop?: EdiSegmentObject[];
}

type EdiTypeValue = "x12" | "edifact" | "vda" | "unknown";

interface EdiMessageInfo {
  version: string;
  name: string;
  introduction: string;
}

interface EdiTransactionSetMeta {
  release?: string;
  version?: string;
  id?: string;
  messageInfo?: EdiMessageInfo;
}

interface EdiTransactionSetObject {
  meta: EdiTransactionSetMeta;
  id?: string;
  segments: EdiSegmentObject[];
  startSegment?: EdiSegmentObject;
  endSegment?: EdiSegmentObject;
}

interface EdiFunctionalGroupMeta {
  date?: string;
  time?: string;
  id?: string;
}

interface EdiFunctionalGroupObject {
  meta: EdiFunctionalGroupMeta;
  id?: string;
  transactionSets: EdiTransactionSetObject[];
  startSegment?: EdiSegmentObject;
  endSegment?: EdiSegmentObject;
}

interface EdiInterchangeMeta {
  senderQualifier?: string;
  senderID?: string;
  receiverQualifier?: string;
  receiverID?: string;
  date?: string;
  time?: string;
  id?: string;
}

interface EdiInterchangeObject {
  meta: EdiInterchangeMeta;
  id?: string;
  functionalGroups: EdiFunctionalGroupObject[];
  startSegment?: EdiSegmentObject;
  endSegment?: EdiSegmentObject;
}

interface EdiDocumentObject {
  interchanges: EdiInterchangeObject[];
  separatorsSegment?: EdiSegmentObject;
  startSegment?: EdiSegmentObject;
  endSegment?: EdiSegmentObject;
  ediType?: EdiTypeValue;
}
