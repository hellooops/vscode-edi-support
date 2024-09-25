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
  key: any;

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
  key: any;

  id: string;
  elements: Array<IEdiElement>;
  desc?: string;
  purpose: string;
}

interface IEdiMessage {
  ediVersion: IEdiVersion;
  segments: IEdiSegment[];
}

type VcmMessage = VcmTemplate<IEdiMessage>;

type IActiveContext = {
  segmentKey: any;
  elementKey: any;
}

type VcmActiveContext = VcmTemplate<IActiveContext>;
