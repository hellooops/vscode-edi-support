import { Utils } from "./utils";

export interface TreeItemBase {
  getHeight(): number;
  getParentHeight(): number;
}

export class EdiElement implements TreeItemBase {
  nodeKey: string;

  type: EdiElementType;
  value?: string;
  components?: EdiElement[];

  // EdiReleaseSchemaElement
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

  segment: EdiSegment;
  parentElement?: EdiElement;

  constructor(json: EdiElementObject, segment: EdiSegment, parentElement?: EdiElement) {
    this.nodeKey = json.nodeKey;
    this.type = json.type;
    this.value = json.value;

    this.id = json.id;
    this.desc = json.desc;
    this.dataType = json.dataType;
    this.required = json.required;
    this.minLength = json.minLength;
    this.maxLength = json.maxLength;
    this.length = json.length;
    this.codeValue = json.codeValue;
    this.definition = json.definition;
    this.designator = json.designator;
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
  nodeKey: string;

  id: string;
  segmentStr?: string;
  elements: EdiElement[];
  desc?: string;
  purpose?: string;
  Loop?: EdiSegment[];

  parent: EdiDocument | EdiInterchange | EdiFunctionalGroup | EdiTransactionSet;
  parentSegment?: EdiSegment;

  constructor(json: EdiSegmentObject, parent: EdiDocument | EdiInterchange | EdiFunctionalGroup | EdiTransactionSet) {
    this.nodeKey = json.nodeKey;
    this.id = json.id;
    this.segmentStr = json.segmentStr;
    this.desc = json.desc;
    this.purpose = json.purpose;
    this.elements = json.elements?.map(i => new EdiElement(i, this));
    this.Loop = json.Loop?.map(i => new EdiSegment(i, parent).withParentSegment(this));

    this.parent = parent;
  }

  public isLoop(): boolean {
    return this.Loop !== undefined;
  }

  withParentSegment(parentSegment: EdiSegment): EdiSegment {
    this.parentSegment = parentSegment;
    return this;
  }

  getHeight(): number {
    return 48;
  }

  getParentHeight(): number {
    if (this.parentSegment) {
      return this.parentSegment.getHeight() + this.parentSegment.getParentHeight();
    } else {
      return this.parent.getHeight() + this.parent.getParentHeight();
    }
  }
}

export class EdiTransactionSet implements TreeItemBase {
  nodeKey: string;
  meta: EdiTransactionSetMeta;
  id?: string;
  
  segments: EdiSegment[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  functionalGroup: EdiFunctionalGroup;

  constructor(json: EdiTransactionSetObject, functionalGroup: EdiFunctionalGroup) {
    this.nodeKey = json.nodeKey;
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
    return 48 + (this.meta.messageInfo?.introduction ? 40 : 0);
  }

  getParentHeight(): number {
    return this.functionalGroup.getHeight() + this.functionalGroup.getParentHeight();
  }
}

export class EdiFunctionalGroup implements TreeItemBase {
  nodeKey: string;
  meta: EdiFunctionalGroupMeta;
  id?: string;
  
  transactionSets: EdiTransactionSet[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  interchange: EdiInterchange;

  constructor(json: EdiFunctionalGroupObject, interchange: EdiInterchange) {
    this.nodeKey = json.nodeKey;
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
    return 48;
  }

  getParentHeight(): number {
    return this.interchange.getHeight() + this.interchange.getParentHeight();
  }

  getSegments(): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.transactionSets.flatMap(i => i.getSegments()));
    if (this.endSegment) result.push(this.endSegment);
    return result;
  }
}

export class EdiInterchange implements TreeItemBase {
  nodeKey: string;
  meta: EdiInterchangeMeta;
  id?: string;

  functionalGroups: EdiFunctionalGroup[];

  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  ediDocument: EdiDocument;

  constructor(json: EdiInterchangeObject, ediDocument: EdiDocument) {
    this.nodeKey = json.nodeKey;
    this.meta = json.meta;
    this.id = json.id;

    this.functionalGroups = json.functionalGroups?.map(i => new EdiFunctionalGroup(i, this));

    if (json.startSegment) this.startSegment = new EdiSegment(json.startSegment, this);
    if (json.endSegment) this.endSegment = new EdiSegment(json.endSegment, this);

    this.ediDocument = ediDocument;
  }

  isFake(): boolean {
    return !this.startSegment;
  }

  getHeight(): number {
    if (this.isFake()) return 0;
    return 48;
  }

  getParentHeight(): number {
    return this.ediDocument.getHeight() + this.ediDocument.getParentHeight();
  }

  getSegments(): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.functionalGroups.flatMap(i => i.getSegments()));
    if (this.endSegment) result.push(this.endSegment);
    return result;
  }
}

export class EdiDocument implements TreeItemBase {
  interchanges: EdiInterchange[];

  separatorsSegment?: EdiSegment; // ISA
  startSegment?: EdiSegment;
  endSegment?: EdiSegment;

  constructor(json: EdiDocumentObject) {
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

  getSegments(): EdiSegment[] {
    const result: EdiSegment[] = [];
    if (this.separatorsSegment) result.push(this.separatorsSegment);
    if (this.startSegment) result.push(this.startSegment);
    result.push(...this.interchanges.flatMap(i => i.getSegments()));
    if (this.endSegment) result.push(this.endSegment);
    return result;
  }

  getSegmentOrElementByNodeKey(nodeKey: string): EdiSegment | EdiElement | undefined {
    const segments = this.getSegments();
    const flatSegments = Utils.flatSegments(segments); // Loop and nonloop segments are in the same level
    for (const segment of flatSegments) {
      if (segment.nodeKey === nodeKey) return segment;
      if (segment.elements) {
        for (const dataEle of segment.elements) {
          if (dataEle.nodeKey === nodeKey) return dataEle;
          if (dataEle.components) {
            for (const compEle of dataEle.components) {
              if (compEle.nodeKey === nodeKey) return compEle;
            }
          }
        }
      }
    }

    return undefined;
  }
}
