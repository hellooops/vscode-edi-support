type VcmTemplate<T extends any> = {
  name: string;
  data: T;
};

type Vcm = VcmTemplate<any>;

type VcmFileChange = VcmTemplate<{
  fileName: string;
  text: string;
}>;

interface IEdiVersion {
  release?: string; // D96A
  version?: string; // ORDERS
}

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

interface IEdiTransactionSet {
  key: string;
  id?: string;

  ediVersion: IEdiVersion;
  segments: IEdiSegment[];

  startSegment?: IEdiSegment;
  endSegment?: IEdiSegment;
}

interface IEdiFunctionalGroup {
  key: string;
  id?: string;

  transactionSets: IEdiTransactionSet[];

  startSegment?: IEdiSegment;
  endSegment?: IEdiSegment;
}

interface IEdiInterchange {
  key: string;
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
