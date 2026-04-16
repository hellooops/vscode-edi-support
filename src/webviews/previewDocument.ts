import {
  EdiDocument,
  EdiElement,
  EdiFunctionalGroup,
  EdiInterchange,
  EdiSegment,
  EdiTransactionSet,
} from "edi-parser";
import {
  getElementNodeKey,
  getFunctionalGroupNodeKey,
  getInterchangeNodeKey,
  getSegmentNodeKey,
  getTransactionSetNodeKey,
} from "./previewNodeKeys";

export interface IPreviewEdiElement {
  nodeKey: string;
  type: EdiElementType;
  value?: string;
  components?: IPreviewEdiElement[];
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

export interface IPreviewEdiSegment {
  nodeKey: string;
  id: string;
  segmentStr?: string;
  elements: IPreviewEdiElement[];
  desc?: string;
  purpose?: string;
  Loop?: IPreviewEdiSegment[];
}

export interface IPreviewEdiTransactionSet {
  nodeKey: string;
  meta: EdiTransactionSetMeta;
  id?: string;
  segments: IPreviewEdiSegment[];
  startSegment?: IPreviewEdiSegment;
  endSegment?: IPreviewEdiSegment;
}

export interface IPreviewEdiFunctionalGroup {
  nodeKey: string;
  meta: EdiFunctionalGroupMeta;
  id?: string;
  transactionSets: IPreviewEdiTransactionSet[];
  startSegment?: IPreviewEdiSegment;
  endSegment?: IPreviewEdiSegment;
}

export interface IPreviewEdiInterchange {
  nodeKey: string;
  meta: EdiInterchangeMeta;
  id?: string;
  functionalGroups: IPreviewEdiFunctionalGroup[];
  startSegment?: IPreviewEdiSegment;
  endSegment?: IPreviewEdiSegment;
}

export interface IPreviewEdiDocument {
  interchanges: IPreviewEdiInterchange[];
  separatorsSegment?: IPreviewEdiSegment;
  startSegment?: IPreviewEdiSegment;
  endSegment?: IPreviewEdiSegment;
  ediType?: EdiTypeValue;
}

function toPreviewElement(segment: EdiSegment, element: EdiElement): IPreviewEdiElement {
  return {
    nodeKey: getElementNodeKey(segment, element),
    type: element.type,
    value: element.value,
    components: element.components?.map(component => toPreviewElement(segment, component)),
    id: element.ediReleaseSchemaElement?.id,
    desc: element.ediReleaseSchemaElement?.desc,
    dataType: element.ediReleaseSchemaElement?.dataType,
    required: element.ediReleaseSchemaElement?.required,
    minLength: element.ediReleaseSchemaElement?.minLength,
    maxLength: element.ediReleaseSchemaElement?.maxLength,
    codeValue: element.toObject().codeValue,
    definition: element.ediReleaseSchemaElement?.definition,
    length: element.ediReleaseSchemaElement?.length,
    designator: element.getDesignator(),
  };
}

function toPreviewSegment(segment: EdiSegment): IPreviewEdiSegment {
  return {
    nodeKey: getSegmentNodeKey(segment),
    id: segment.id,
    segmentStr: segment.segmentStr,
    elements: segment.elements?.map(element => toPreviewElement(segment, element)) ?? [],
    desc: segment.getDesc(),
    purpose: segment.getPurpose(),
    Loop: segment.Loop?.map(loopSegment => toPreviewSegment(loopSegment)),
  };
}

function toPreviewTransactionSet(transactionSet: EdiTransactionSet): IPreviewEdiTransactionSet {
  return {
    nodeKey: getTransactionSetNodeKey(transactionSet),
    meta: transactionSet.meta,
    id: transactionSet.getId(),
    segments: transactionSet.segments.map(segment => toPreviewSegment(segment)),
    startSegment: transactionSet.startSegment ? toPreviewSegment(transactionSet.startSegment) : undefined,
    endSegment: transactionSet.endSegment ? toPreviewSegment(transactionSet.endSegment) : undefined,
  };
}

function toPreviewFunctionalGroup(functionalGroup: EdiFunctionalGroup): IPreviewEdiFunctionalGroup {
  return {
    nodeKey: getFunctionalGroupNodeKey(functionalGroup),
    meta: functionalGroup.meta,
    id: functionalGroup.getId(),
    transactionSets: functionalGroup.transactionSets.map(transactionSet => toPreviewTransactionSet(transactionSet)),
    startSegment: functionalGroup.startSegment ? toPreviewSegment(functionalGroup.startSegment) : undefined,
    endSegment: functionalGroup.endSegment ? toPreviewSegment(functionalGroup.endSegment) : undefined,
  };
}

function toPreviewInterchange(interchange: EdiInterchange): IPreviewEdiInterchange {
  return {
    nodeKey: getInterchangeNodeKey(interchange),
    meta: interchange.meta,
    id: interchange.getId(),
    functionalGroups: interchange.functionalGroups.map(functionalGroup => toPreviewFunctionalGroup(functionalGroup)),
    startSegment: interchange.startSegment ? toPreviewSegment(interchange.startSegment) : undefined,
    endSegment: interchange.endSegment ? toPreviewSegment(interchange.endSegment) : undefined,
  };
}

export function buildPreviewDocument(ediDocument: EdiDocument, ediType: EdiTypeValue): IPreviewEdiDocument {
  return {
    interchanges: ediDocument.interchanges.map(interchange => toPreviewInterchange(interchange)),
    separatorsSegment: ediDocument.separatorsSegment ? toPreviewSegment(ediDocument.separatorsSegment) : undefined,
    startSegment: ediDocument.startSegment ? toPreviewSegment(ediDocument.startSegment) : undefined,
    endSegment: ediDocument.endSegment ? toPreviewSegment(ediDocument.endSegment) : undefined,
    ediType,
  };
}
