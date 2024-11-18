export interface TreeItemBase {
  getHeight(): number;
  getParentHeight(): number;
}

export class EdiElement implements TreeItemBase {
  key: string;

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

  getHeight(): number {
    return 48;
  }

  getParentHeight(): number {
    if (this.parentElement) {
      return this.parentElement.getHeight() + this.parentElement.getParentHeight();
    } else {
      return this.segment.getHeight() + this.segment.getParentHeight();
    }
  }
}

export class EdiSegment implements TreeItemBase {
  key: any;

  id: string;
  elements: EdiElement[];
  desc?: string;
  purpose: string;

  parent: EdiDocument | EdiInterchange | EdiFunctionalGroup | EdiTransactionSet;

  constructor(json: IEdiSegment, parent: EdiDocument | EdiInterchange | EdiFunctionalGroup | EdiTransactionSet) {
    this.key = json.key;
    this.id = json.id;
    this.desc = json.desc;
    this.purpose = json.purpose;
    this.elements = json.elements?.map(i => new EdiElement(i, this));

    this.parent = parent;
  }

  getHeight(): number {
    return 48;
  }

  getParentHeight(): number {
    return this.parent.getHeight() + this.parent.getParentHeight();
  }
}

export class EdiTransactionSet implements TreeItemBase {
  key: string;
  meta: IEdiTransactionSetMeta;
  id?: string;
  
  segments: EdiSegment[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  functionalGroup: EdiFunctionalGroup;

  constructor(json: IEdiTransactionSet, functionalGroup: EdiFunctionalGroup) {
    this.key = json.key;
    this.meta = json.meta;
    this.id = json.id;

    this.segments = json.segments?.map(i => new EdiSegment(i, this));

    if (json.startSegment) this.startSegment = new EdiSegment(json.startSegment, this);
    if (json.endSegment) this.endSegment = new EdiSegment(json.endSegment, this);

    this.functionalGroup = functionalGroup;
  }

  getSegments(): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.segments);
    if (this.endSegment) result.push(this.endSegment);
    return result;
  } 

  getHeight(): number {
    return 28;
  }

  getParentHeight(): number {
    return this.functionalGroup.getHeight() + this.functionalGroup.getParentHeight();
  }
}

export class EdiFunctionalGroup implements TreeItemBase {
  key: string;
  meta: IEdiFunctionalGroupMeta;
  id?: string;
  
  transactionSets: EdiTransactionSet[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  interchange: EdiInterchange;

  constructor(json: IEdiFunctionalGroup, interchange: EdiInterchange) {
    this.key = json.key;
    this.meta = json.meta;
    this.id = json.id;

    this.transactionSets = json.transactionSets?.map(i => new EdiTransactionSet(i, this));

    if (json.startSegment) this.startSegment = new EdiSegment(json.startSegment, this);
    if (json.endSegment) this.endSegment = new EdiSegment(json.endSegment, this);

    this.interchange = interchange;
  }

  isFake(): boolean {
    return !this.startSegment;
  }

  getHeight(): number {
    if (this.isFake()) return 0;
    return 28;
  }

  getParentHeight(): number {
    return this.interchange.getHeight() + this.interchange.getParentHeight();
  }
}

export class EdiInterchange implements TreeItemBase {
  key: string;
  meta: IEdiInterchangeMeta;
  id?: string;

  functionalGroups: EdiFunctionalGroup[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  ediDocument: EdiDocument;

  constructor(json: IEdiInterchange, ediDocument: EdiDocument) {
    this.key = json.key;
    this.meta = json.meta;
    this.id = json.id;

    this.functionalGroups = json.functionalGroups?.map(i => new EdiFunctionalGroup(i, this));

    if (json.startSegment) this.startSegment = new EdiSegment(json.startSegment, this);
    if (json.endSegment) this.endSegment = new EdiSegment(json.endSegment, this);

    this.ediDocument = ediDocument;
  }

  getHeight(): number {
    return 28;
  }

  getParentHeight(): number {
    return this.ediDocument.getHeight() + this.ediDocument.getParentHeight();
  }
}

export class EdiDocument implements TreeItemBase {
  interchanges: EdiInterchange[];

  separatorsSegment?: EdiSegment; // ISA
  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  constructor(json: IEdiDocument) {
    this.interchanges = json.interchanges?.map(i => new EdiInterchange(i, this));

    if (json.separatorsSegment) this.separatorsSegment = new EdiSegment(json.separatorsSegment, this);
    if (json.startSegment) this.startSegment = new EdiSegment(json.startSegment, this);
    if (json.endSegment) this.endSegment = new EdiSegment(json.endSegment, this);
  }

  getHeight(): number {
    return 0;
  }

  getParentHeight(): number {
    return 0;
  }
}