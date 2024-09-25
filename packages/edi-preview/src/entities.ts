export abstract class TreeItemBase {
  abstract getLevel(): number;
}

export class EdiElement {
  key: any;

  type: IElementType;
  value?: string;
  components?: EdiElement[];

  // EdiReleaseSchemaElement
  id: string;
  desc: string;
  dataType?: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  codeValue?: string;
  definition?: string;

  segment: EdiSegment;
  parentElement?: EdiElement;

  constructor(json: IEdiElement, segment: EdiSegment, parentElement?: EdiElement) {
    this.key = json.key;
    this.type = json.type;
    this.value = json.value;

    this.id = json.id;
    this.desc = json.desc;
    this.dataType = json.dataType;
    this.required = json.required;
    this.minLength = json.minLength;
    this.maxLength = json.maxLength;
    this.codeValue = json.codeValue;
    this.definition = json.definition;
    if (json.components) {
      this.components = json.components.map(i => new EdiElement(i, segment, this));
    }

    this.segment = segment;
    this.parentElement = parentElement;
  }

  getLevel(): number {
    if (this.parentElement) {
      return this.parentElement.getLevel() + 1;
    } else {
      return this.segment.getLevel() + 1;
    }
  }
}

export class EdiSegment {
  key: any;

  id: string;
  elements: EdiElement[];
  desc?: string;
  purpose: string;

  constructor(json: IEdiSegment) {
    this.key = json.key;
    this.id = json.id;
    this.desc = json.desc;
    this.purpose = json.purpose;
    this.elements = json.elements?.map(i => new EdiElement(i, this));
  }

  getLevel(): number {
    return 1;
  }
}


export class EdiMessage {
  ediVersion: IEdiVersion;
  segments: EdiSegment[];

  constructor(json: IEdiMessage) {
    this.ediVersion = json.ediVersion;
    this.segments = json.segments?.map(i => new EdiSegment(i));
  }
}