import {
  EdiDocument,
  EdiElement,
  EdiFunctionalGroup,
  EdiInterchange,
  EdiSegment,
  EdiTransactionSet
} from "@/entities";

export type PreviewNodeKind =
  | "interchange"
  | "functional-group"
  | "transaction-set"
  | "segment"
  | "element";

export interface PreviewNode {
  nodeKey: string;
  kind: PreviewNodeKind;
  title: string;
  subtitle?: string;
  meta?: string;
  trailing?: string;
  purpose?: string;
  codeTag?: string;
  codeTagTone?: "blue" | "green";
  isLoop?: boolean;
  fieldCount?: number;
  elementId?: string;
  elementDesignator?: string;
  elementValue?: string;
  elementMeaning?: string;
  elementType?: string;
  elementLength?: string;
  elementRequired?: boolean;
  hasChildren: boolean;
  loadChildren?: () => PreviewNode[];
  containsNodeKey: (nodeKey: string) => boolean;
  defaultExpanded: boolean;
}

export function buildPreviewNodes(ediDocument: EdiDocument): PreviewNode[] {
  return compactNodes([
    ediDocument.separatorsSegment ? buildSegmentNode(ediDocument.separatorsSegment) : undefined,
    ediDocument.startSegment ? buildSegmentNode(ediDocument.startSegment) : undefined,
    ...ediDocument.interchanges.flatMap(interchange => buildInterchangeEntries(interchange)),
    ediDocument.endSegment ? buildSegmentNode(ediDocument.endSegment) : undefined
  ]);
}

export function nodeContainsNodeKey(node: PreviewNode, nodeKey?: string): boolean {
  if (!nodeKey) {
    return false;
  }

  return node.nodeKey === nodeKey || node.containsNodeKey(nodeKey);
}

function buildInterchangeEntries(interchange: EdiInterchange): PreviewNode[] {
  const loadChildren = () => compactNodes([
    interchange.startSegment ? buildSegmentNode(interchange.startSegment) : undefined,
    ...interchange.functionalGroups.flatMap(buildFunctionalGroupEntries),
    interchange.endSegment ? buildSegmentNode(interchange.endSegment) : undefined
  ]);

  if (interchange.isFake()) {
    return loadChildren();
  }

  const interchangeId = interchange.id ?? interchange.meta.id ?? "Unknown";
  const sender = formatPartnerLabel(interchange.meta.senderID, interchange.meta.senderQualifier);
  const receiver = formatPartnerLabel(interchange.meta.receiverID, interchange.meta.receiverQualifier);
  return [
    createNode({
      nodeKey: interchange.nodeKey,
      kind: "interchange",
      title: `Interchange ${interchangeId}`,
      codeTag: interchange.startSegment?.id?.toUpperCase() ?? "ISA",
      codeTagTone: "blue",
      trailing: compactText([sender, receiver]).join(" → ") || undefined,
      hasChildren: Boolean(interchange.startSegment || interchange.functionalGroups.length || interchange.endSegment),
      loadChildren,
      containsNodeKey: nodeKey => interchangeContainsNodeKey(interchange, nodeKey),
      defaultExpanded: true
    })
  ];
}

function buildFunctionalGroupEntries(functionalGroup: EdiFunctionalGroup): PreviewNode[] {
  const loadChildren = () => compactNodes([
    functionalGroup.startSegment ? buildSegmentNode(functionalGroup.startSegment) : undefined,
    ...functionalGroup.transactionSets.map(buildTransactionSetNode),
    functionalGroup.endSegment ? buildSegmentNode(functionalGroup.endSegment) : undefined
  ]);

  if (functionalGroup.isFake()) {
    return loadChildren();
  }

  const functionalGroupId = functionalGroup.id ?? functionalGroup.meta.id ?? "Unknown";
  return [
    createNode({
      nodeKey: functionalGroup.nodeKey,
      kind: "functional-group",
      title: `Functional group ${functionalGroupId}`,
      codeTag: functionalGroup.startSegment?.id?.toUpperCase() ?? "GS",
      codeTagTone: "blue",
      trailing: "Control envelope",
      hasChildren: Boolean(functionalGroup.startSegment || functionalGroup.transactionSets.length || functionalGroup.endSegment),
      loadChildren,
      containsNodeKey: nodeKey => functionalGroupContainsNodeKey(functionalGroup, nodeKey),
      defaultExpanded: false
    })
  ];
}

function buildTransactionSetNode(transactionSet: EdiTransactionSet): PreviewNode {
  const transactionSetId = transactionSet.id ?? transactionSet.meta.id ?? "Unknown";
  const segments = transactionSet.getSegments();
  return createNode({
    nodeKey: transactionSet.nodeKey,
    kind: "transaction-set",
    title: transactionSet.meta.messageInfo?.name || `Transaction set ${transactionSetId}`,
    codeTag: transactionSet.meta.version || "ST",
    codeTagTone: "green",
    trailing: `Control #${transactionSetId}`,
    hasChildren: segments.length > 0,
    loadChildren: () => segments.map(segment => buildSegmentNode(segment)),
    containsNodeKey: nodeKey => transactionSetContainsNodeKey(transactionSet, nodeKey),
    defaultExpanded: true
  });
}

function buildSegmentNode(segment: EdiSegment): PreviewNode {
  const isLoop = segment.isLoop();
  const hasChildren = isLoop
    ? Boolean(segment.Loop?.length)
    : Boolean(segment.elements?.length);

  const loadChildren = () => isLoop
    ? segment.Loop?.map(loopSegment => buildSegmentNode(loopSegment)) ?? []
    : segment.elements?.map(element => buildElementNode(element)) ?? [];

  return createNode({
    nodeKey: segment.nodeKey,
    kind: "segment",
    isLoop,
    title: isLoop ? segment.id : segment.desc ?? `${segment.id.toUpperCase()} Segment`,
    codeTag: isLoop ? "LOOP" : segment.id.toUpperCase(),
    codeTagTone: "blue",
    meta: isLoop ? undefined : formatSegmentMeta(segment),
    purpose: isLoop ? undefined : segment.purpose,
    fieldCount: isLoop ? undefined : segment.elements?.length,
    hasChildren,
    loadChildren,
    containsNodeKey: nodeKey => segmentContainsNodeKey(segment, nodeKey),
    defaultExpanded: false
  });
}

function buildElementNode(element: EdiElement): PreviewNode {
  return createNode({
    nodeKey: element.nodeKey,
    kind: "element",
    title: element.desc ?? "Element",
    elementId: element.id,
    elementDesignator: element.designator,
    elementValue: element.value,
    elementMeaning: element.codeValue,
    elementType: element.dataType,
    elementLength: formatLength(element),
    elementRequired: element.required,
    subtitle: element.definition,
    hasChildren: Boolean(element.components?.length),
    loadChildren: () => element.components?.map(component => buildElementNode(component)) ?? [],
    containsNodeKey: nodeKey => elementContainsNodeKey(element, nodeKey),
    defaultExpanded: false
  });
}

function createNode(node: PreviewNode): PreviewNode {
  return node;
}

function compactNodes<T>(items: Array<T | undefined>): T[] {
  return items.filter((item): item is T => Boolean(item));
}

function compactText(items: Array<string | undefined>): string[] {
  return items
    .map(item => item?.trim())
    .filter((item): item is string => Boolean(item));
}

function formatSegmentMeta(segment: EdiSegment): string | undefined {
  if (segment.isLoop()) {
    return "Loop";
  }

  return segment.segmentStr?.trim() || undefined;
}

function formatPartnerLabel(id?: string, qualifier?: string): string | undefined {
  const trimmedId = id?.trim();
  if (trimmedId) {
    return trimmedId;
  }

  return qualifier?.trim() || undefined;
}

function formatLength(element: EdiElement): string | undefined {
  if (element.length !== undefined) {
    return `${element.length}`;
  }

  if (element.minLength === undefined && element.maxLength === undefined) {
    return undefined;
  }

  if (element.minLength !== undefined && element.maxLength !== undefined) {
    return `${element.minLength}-${element.maxLength}`;
  }

  return `${element.minLength ?? element.maxLength}`;
}

function interchangeContainsNodeKey(interchange: EdiInterchange, nodeKey: string): boolean {
  return Boolean(
    (interchange.startSegment && segmentContainsNodeKey(interchange.startSegment, nodeKey))
    || interchange.functionalGroups.some(functionalGroup => functionalGroupContainsNodeKey(functionalGroup, nodeKey))
    || (interchange.endSegment && segmentContainsNodeKey(interchange.endSegment, nodeKey))
  );
}

function functionalGroupContainsNodeKey(functionalGroup: EdiFunctionalGroup, nodeKey: string): boolean {
  return Boolean(
    (functionalGroup.startSegment && segmentContainsNodeKey(functionalGroup.startSegment, nodeKey))
    || functionalGroup.transactionSets.some(transactionSet => transactionSetContainsNodeKey(transactionSet, nodeKey))
    || (functionalGroup.endSegment && segmentContainsNodeKey(functionalGroup.endSegment, nodeKey))
  );
}

function transactionSetContainsNodeKey(transactionSet: EdiTransactionSet, nodeKey: string): boolean {
  return transactionSet.getSegments().some(segment => segmentContainsNodeKey(segment, nodeKey));
}

function segmentContainsNodeKey(segment: EdiSegment, nodeKey: string): boolean {
  if (segment.nodeKey === nodeKey) {
    return true;
  }

  if (segment.isLoop()) {
    return segment.Loop?.some(loopSegment => segmentContainsNodeKey(loopSegment, nodeKey)) ?? false;
  }

  return segment.elements?.some(element => elementContainsNodeKey(element, nodeKey)) ?? false;
}

function elementContainsNodeKey(element: EdiElement, nodeKey: string): boolean {
  if (element.nodeKey === nodeKey) {
    return true;
  }

  return element.components?.some(component => elementContainsNodeKey(component, nodeKey)) ?? false;
}
