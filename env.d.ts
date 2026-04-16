type VcmTemplate<T extends any> = {
  name: string;
  data: T;
};

type Vcm = VcmTemplate<any>;

type VcmFileChange = VcmTemplate<{
  fileName: string;
  text: string;
}>;

type EdiElementType = "Data Element" | "Component Element";

interface EdiElementObject {
  nodeKey: string;

  type: EdiElementType;
  value?: string;
  components?: EdiElementObject[];

  // EdiReleaseSchemaElement
  id?: string;
  desc?: string;
  dataType?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  codeValue?: string;
  definition?: string;

  length?: number;  // VDA

  designator: string;
}

interface EdiSegmentObject {
  nodeKey: string;

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
  nodeKey: string;
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
  nodeKey: string;
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
  nodeKey: string;
  meta: EdiInterchangeMeta;
  id?: string;

  functionalGroups: EdiFunctionalGroupObject[];

  startSegment?: EdiSegmentObject;
  endSegment?: EdiSegmentObject;
}

interface EdiDocumentObject {
  interchanges: EdiInterchangeObject[];

  separatorsSegment?: EdiSegmentObject; // ISA
  startSegment?: EdiSegmentObject;
  endSegment?: EdiSegmentObject;

  ediType?: EdiTypeValue;
}

type VcmDocument = VcmTemplate<EdiDocumentObject>;

type IActiveContext = {
  segmentNodeKey: string | undefined;
  elementNodeKey: string | undefined;
}

type VcmActiveContext = VcmTemplate<IActiveContext>;
