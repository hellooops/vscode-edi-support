import { EdiDocument, EdiSegment } from "@/entities";

export interface PreviewDocumentSummary {
  title: string;
  sender?: string;
  receiver?: string;
  controlNumber?: string;
  transactions: number;
  segments: number;
  elements: number;
}

export function buildPreviewSummary(ediDocument: EdiDocument): PreviewDocumentSummary {
  const transactionSets = ediDocument.interchanges.flatMap(interchange =>
    interchange.functionalGroups.flatMap(functionalGroup => functionalGroup.transactionSets)
  );
  const segments = ediDocument.interchanges.flatMap(interchange => interchange.getSegments());
  const interchange = ediDocument.interchanges.find(item => !item.isFake()) ?? ediDocument.interchanges[0];
  const primaryTransaction = transactionSets[0];

  return {
    title: formatTitle(primaryTransaction?.meta.messageInfo?.name, primaryTransaction?.id ?? primaryTransaction?.meta.id),
    sender: interchange?.meta.senderID?.trim(),
    receiver: interchange?.meta.receiverID?.trim(),
    controlNumber: interchange?.id ?? interchange?.meta.id,
    transactions: transactionSets.length,
    segments: countSegments(segments),
    elements: countElements(segments)
  };
}

function formatTitle(messageName?: string, transactionId?: string): string {
  const name = messageName?.trim();
  if (name) {
    return name;
  }

  const id = transactionId?.trim();
  return id ? `Transaction set ${id}` : "EDI document";
}

function countSegments(segments: EdiSegment[]): number {
  return segments.reduce((total, segment) => {
    if (segment.isLoop()) {
      return total + countSegments(segment.Loop ?? []);
    }

    return total + 1;
  }, 0);
}

function countElements(segments: EdiSegment[]): number {
  return segments.reduce((total, segment) => {
    if (segment.isLoop()) {
      return total + countElements(segment.Loop ?? []);
    }

    return total + (segment.elements?.length ?? 0);
  }, 0);
}
