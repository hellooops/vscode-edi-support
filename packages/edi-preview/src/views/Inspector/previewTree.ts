import {
  EdiDocument,
  EdiElement,
  EdiFunctionalGroup,
  EdiInterchange,
  EdiSegment,
  EdiTransactionSet
} from "@/entities";
import { Utils } from "@/utils";

export type PreviewBadge = "Required" | "Optional";

export type PreviewNodeKind =
  | "interchange"
  | "functional-group"
  | "transaction-set"
  | "segment"
  | "element";

export interface PreviewDetail {
  label: string;
  value?: string;
  mono?: boolean;
}

export interface PreviewNode {
  key: string;
  kind: PreviewNodeKind;
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: PreviewBadge;
  details: PreviewDetail[];
  hasChildren: boolean;
  loadChildren?: () => PreviewNode[];
  containsKey: (key: string) => boolean;
  defaultExpanded: boolean;
  stickyOffset: number;
  stickyLayer: number;
}

const PREVIEW_STICKY_STEP = 54;
const PREVIEW_STICKY_BASE_LAYER = 80;

export function buildPreviewNodes(ediDocument: EdiDocument): PreviewNode[] {
  return compactNodes([
    ediDocument.separatorsSegment ? buildSegmentNode(ediDocument.separatorsSegment, 0) : undefined,
    ediDocument.startSegment ? buildSegmentNode(ediDocument.startSegment, 0) : undefined,
    ...ediDocument.interchanges.flatMap(interchange => buildInterchangeEntries(interchange, 0)),
    ediDocument.endSegment ? buildSegmentNode(ediDocument.endSegment, 0) : undefined
  ]);
}

export function nodeContainsKey(node: PreviewNode, key?: string): boolean {
  if (!key) {
    return false;
  }

  return node.key === key || node.containsKey(key);
}

function buildInterchangeEntries(interchange: EdiInterchange, stickyDepth: number): PreviewNode[] {
  const childStickyDepth = interchange.isFake() ? stickyDepth : stickyDepth + 1;
  const loadChildren = () => compactNodes([
    interchange.startSegment ? buildSegmentNode(interchange.startSegment, childStickyDepth) : undefined,
    ...interchange.functionalGroups.flatMap(functionalGroup => buildFunctionalGroupEntries(functionalGroup, childStickyDepth)),
    interchange.endSegment ? buildSegmentNode(interchange.endSegment, childStickyDepth) : undefined
  ]);

  if (interchange.isFake()) {
    return loadChildren();
  }

  const interchangeId = interchange.id ?? interchange.meta.id ?? "Unknown";
  return [
    createNode({
      key: interchange.key,
      kind: "interchange",
      title: `Interchange ID: ${interchangeId}`,
      subtitle: compactText([
        formatPartner(interchange.meta.senderQualifer, interchange.meta.senderID),
        formatPartner(interchange.meta.receiverQualifer, interchange.meta.receiverID)
      ]).join(" to "),
      badge: "Required",
      details: compactDetails([
        createDetail("Interchange ID", interchangeId, true),
        createDetail(
          "Sender",
          formatPartner(interchange.meta.senderQualifer, interchange.meta.senderID),
          true
        ),
        createDetail(
          "Receiver",
          formatPartner(interchange.meta.receiverQualifer, interchange.meta.receiverID),
          true
        ),
        createDetail(
          "Timestamp",
          Utils.normalizeMetaDateAndTime(interchange.meta.date, interchange.meta.time),
          true
        )
      ]),
      hasChildren: Boolean(interchange.startSegment || interchange.functionalGroups.length || interchange.endSegment),
      loadChildren,
      containsKey: key => interchangeContainsKey(interchange, key),
      defaultExpanded: true,
      stickyOffset: stickyDepth * PREVIEW_STICKY_STEP,
      stickyLayer: PREVIEW_STICKY_BASE_LAYER - stickyDepth
    })
  ];
}

function buildFunctionalGroupEntries(functionalGroup: EdiFunctionalGroup, stickyDepth: number): PreviewNode[] {
  const childStickyDepth = functionalGroup.isFake() ? stickyDepth : stickyDepth + 1;
  const loadChildren = () => compactNodes([
    functionalGroup.startSegment ? buildSegmentNode(functionalGroup.startSegment, childStickyDepth) : undefined,
    ...functionalGroup.transactionSets.map(transactionSet => buildTransactionSetNode(transactionSet, childStickyDepth)),
    functionalGroup.endSegment ? buildSegmentNode(functionalGroup.endSegment, childStickyDepth) : undefined
  ]);

  if (functionalGroup.isFake()) {
    return loadChildren();
  }

  const functionalGroupId = functionalGroup.id ?? functionalGroup.meta.id ?? "Unknown";
  return [
    createNode({
      key: functionalGroup.key,
      kind: "functional-group",
      title: `Functional Group ID: ${functionalGroupId}`,
      subtitle: "Control envelope",
      badge: "Required",
      details: compactDetails([
        createDetail("Functional Group ID", functionalGroupId, true),
        createDetail(
          "Timestamp",
          Utils.normalizeMetaDateAndTime(functionalGroup.meta.date, functionalGroup.meta.time),
          true
        )
      ]),
      hasChildren: Boolean(functionalGroup.startSegment || functionalGroup.transactionSets.length || functionalGroup.endSegment),
      loadChildren,
      containsKey: key => functionalGroupContainsKey(functionalGroup, key),
      defaultExpanded: false,
      stickyOffset: stickyDepth * PREVIEW_STICKY_STEP,
      stickyLayer: PREVIEW_STICKY_BASE_LAYER - stickyDepth
    })
  ];
}

function buildTransactionSetNode(transactionSet: EdiTransactionSet, stickyDepth: number): PreviewNode {
  const transactionSetId = transactionSet.id ?? transactionSet.meta.id ?? "Unknown";
  const segments = transactionSet.getSegments();
  return createNode({
    key: transactionSet.key,
    kind: "transaction-set",
    title: `Transaction Set ID: ${transactionSetId}`,
    subtitle: compactText([
      transactionSet.meta.messageInfo?.name,
      transactionSet.meta.version,
      transactionSet.meta.release
    ]).join(" • "),
    badge: "Required",
    details: compactDetails([
      createDetail("Message", transactionSet.meta.messageInfo?.name),
      createDetail("Version", transactionSet.meta.version, true),
      createDetail("Release", transactionSet.meta.release, true),
      createDetail("Introduction", transactionSet.meta.messageInfo?.introduction)
    ]),
    hasChildren: segments.length > 0,
    loadChildren: () => segments.map(segment => buildSegmentNode(segment, stickyDepth + 1)),
    containsKey: key => transactionSetContainsKey(transactionSet, key),
    defaultExpanded: true,
    stickyOffset: stickyDepth * PREVIEW_STICKY_STEP,
    stickyLayer: PREVIEW_STICKY_BASE_LAYER - stickyDepth
  });
}

function buildSegmentNode(segment: EdiSegment, stickyDepth: number): PreviewNode {
  const hasChildren = segment.isLoop()
    ? Boolean(segment.Loop?.length)
    : Boolean(segment.elements?.length);

  const loadChildren = () => segment.isLoop()
    ? segment.Loop?.map(loopSegment => buildSegmentNode(loopSegment, stickyDepth + 1)) ?? []
    : segment.elements?.map(element => buildElementNode(element, stickyDepth + 1)) ?? [];

  return createNode({
    key: segment.key,
    kind: "segment",
    title: `${segment.id.toUpperCase()} Segment`,
    subtitle: segment.desc,
    meta: formatSegmentMeta(segment),
    badge: "Required",
    details: compactDetails([
      createDetail("Purpose", segment.purpose),
      createDetail("Description", segment.desc)
    ]),
    hasChildren,
    loadChildren,
    containsKey: key => segmentContainsKey(segment, key),
    defaultExpanded: false,
    stickyOffset: stickyDepth * PREVIEW_STICKY_STEP,
    stickyLayer: PREVIEW_STICKY_BASE_LAYER - stickyDepth
  });
}

function buildElementNode(element: EdiElement, stickyDepth: number): PreviewNode {
  const titleBase = element.id ?? element.designator;
  return createNode({
    key: element.key,
    kind: "element",
    title: `${titleBase}: ${element.desc ?? "Element"}`,
    subtitle: element.definition,
    meta: element.value,
    badge: element.required ? "Required" : "Optional",
    details: compactDetails([
      createDetail("Designator", element.designator, true),
      createDetail("Value", element.value, true),
      createDetail("Code", element.codeValue),
      createDetail("Data Type", element.dataType, true),
      createDetail("Length", formatLength(element), true),
      createDetail("Definition", element.definition)
    ]),
    hasChildren: Boolean(element.components?.length),
    loadChildren: () => element.components?.map(component => buildElementNode(component, stickyDepth + 1)) ?? [],
    containsKey: key => elementContainsKey(element, key),
    defaultExpanded: false,
    stickyOffset: stickyDepth * PREVIEW_STICKY_STEP,
    stickyLayer: PREVIEW_STICKY_BASE_LAYER - stickyDepth
  });
}

function createNode(node: PreviewNode): PreviewNode {
  return node;
}

function createDetail(
  label: string,
  value?: string,
  mono = false
): PreviewDetail | undefined {
  if (!value) {
    return undefined;
  }

  return {
    label,
    value,
    mono
  };
}

function compactNodes<T>(items: Array<T | undefined>): T[] {
  return items.filter((item): item is T => Boolean(item));
}

function compactDetails(details: Array<PreviewDetail | undefined>): PreviewDetail[] {
  return details.filter((detail): detail is PreviewDetail => Boolean(detail));
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

function formatPartner(qualifier?: string, id?: string): string | undefined {
  const value = compactText([qualifier, id]);
  if (!value.length) {
    return undefined;
  }

  return value.join(":");
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

function interchangeContainsKey(interchange: EdiInterchange, key: string): boolean {
  return Boolean(
    (interchange.startSegment && segmentContainsKey(interchange.startSegment, key))
    || interchange.functionalGroups.some(functionalGroup => functionalGroupContainsKey(functionalGroup, key))
    || (interchange.endSegment && segmentContainsKey(interchange.endSegment, key))
  );
}

function functionalGroupContainsKey(functionalGroup: EdiFunctionalGroup, key: string): boolean {
  return Boolean(
    (functionalGroup.startSegment && segmentContainsKey(functionalGroup.startSegment, key))
    || functionalGroup.transactionSets.some(transactionSet => transactionSetContainsKey(transactionSet, key))
    || (functionalGroup.endSegment && segmentContainsKey(functionalGroup.endSegment, key))
  );
}

function transactionSetContainsKey(transactionSet: EdiTransactionSet, key: string): boolean {
  return transactionSet.getSegments().some(segment => segmentContainsKey(segment, key));
}

function segmentContainsKey(segment: EdiSegment, key: string): boolean {
  if (segment.key === key) {
    return true;
  }

  if (segment.isLoop()) {
    return segment.Loop?.some(loopSegment => segmentContainsKey(loopSegment, key)) ?? false;
  }

  return segment.elements?.some(element => elementContainsKey(element, key)) ?? false;
}

function elementContainsKey(element: EdiElement, key: string): boolean {
  if (element.key === key) {
    return true;
  }

  return element.components?.some(component => elementContainsKey(component, key)) ?? false;
}
