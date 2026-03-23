import * as assert from "assert";
import * as vscode from "vscode";

import { EdiDocument, EdiDocumentSeparators, EdiFunctionalGroup, EdiInterchange, EdiSegment, EdiTransactionSet, EdiType } from "../../../parser/entities";
import { FoldingRangeEdiProvider } from "../../../providers/foldingRangeEdiProvider";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("FoldingRangeEdiProvider Test Suite", () => {
  let provider: FoldingRangeEdiProvider;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalGetInterchangeRange: typeof EdiUtils.getInterchangeRange;
  let originalGetFunctionalGroupRange: typeof EdiUtils.getFunctionalGroupRange;
  let originalGetTransactionSetRange: typeof EdiUtils.getTransactionSetRange;
  let originalIsOnlySegmentInLine: typeof EdiUtils.isOnlySegmentInLine;
  let originalGetSegmentStartPosition: typeof EdiUtils.getSegmentStartPosition;
  let originalGetSegmentEndPosition: typeof EdiUtils.getSegmentEndPosition;
  let originalRegisterFoldingRangeProvider: typeof vscode.languages.registerFoldingRangeProvider;

  setup(() => {
    provider = new FoldingRangeEdiProvider();
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalGetInterchangeRange = EdiUtils.getInterchangeRange;
    originalGetFunctionalGroupRange = EdiUtils.getFunctionalGroupRange;
    originalGetTransactionSetRange = EdiUtils.getTransactionSetRange;
    originalIsOnlySegmentInLine = EdiUtils.isOnlySegmentInLine;
    originalGetSegmentStartPosition = EdiUtils.getSegmentStartPosition;
    originalGetSegmentEndPosition = EdiUtils.getSegmentEndPosition;
    originalRegisterFoldingRangeProvider = vscode.languages.registerFoldingRangeProvider;
  });

  teardown(() => {
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).getInterchangeRange = originalGetInterchangeRange;
    (EdiUtils as any).getFunctionalGroupRange = originalGetFunctionalGroupRange;
    (EdiUtils as any).getTransactionSetRange = originalGetTransactionSetRange;
    (EdiUtils as any).isOnlySegmentInLine = originalIsOnlySegmentInLine;
    (EdiUtils as any).getSegmentStartPosition = originalGetSegmentStartPosition;
    (EdiUtils as any).getSegmentEndPosition = originalGetSegmentEndPosition;
    vscode.languages.registerFoldingRangeProvider = originalRegisterFoldingRangeProvider;
  });

  test("Should return empty array when parser is unavailable or parse returns undefined", async () => {
    const document = EdiMockFactory.createMockDocument("ISA~\nGS~", "x12");

    (EdiUtils as any).getEdiParser = () => ({ parser: undefined });
    const withoutParser = await provider.provideFoldingRanges(document, {} as vscode.FoldingContext, EdiMockFactory.createMockCancellationToken());
    assert.deepStrictEqual(withoutParser, []);

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => undefined,
      },
    });
    const withoutDocument = await provider.provideFoldingRanges(document, {} as vscode.FoldingContext, EdiMockFactory.createMockCancellationToken());
    assert.deepStrictEqual(withoutDocument, []);
  });

  test("Should build folding ranges for interchange hierarchy and nested loops", async () => {
    const document = EdiMockFactory.createMockDocument("ISA~\nGS~\nST~\nPO1~\nPID~\nSLN~\nREF~\nSE~\nGE~\nIEA~", "x12");
    const { ediDocument, segmentLines } = createFoldingFixture();

    stubFoldingRanges(segmentLines);
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ediDocument,
      },
      ediType: EdiType.X12,
    });

    const result = await provider.provideFoldingRanges(document, {} as vscode.FoldingContext, EdiMockFactory.createMockCancellationToken());

    assert.deepStrictEqual(
      result.map(range => [range.start, range.end]),
      [
        [0, 9],
        [1, 8],
        [2, 7],
        [4, 6],
        [5, 6],
      ],
    );
  });

  test("Should skip fake functional group folding and single-line interchange ranges", () => {
    const document = EdiMockFactory.createMockDocument("ST~\nSE~", "x12");
    const separators = new EdiDocumentSeparators();
    separators.segmentSeparator = "~";
    const ediDocument = new EdiDocument(separators, {
      interchangeStartSegmentName: "ISA",
      interchangeEndSegmentName: "IEA",
      functionalGroupStartSegmentName: "GS",
      functionalGroupEndSegmentName: "GE",
      transactionSetStartSegmentName: "ST",
      transactionSetEndSegmentName: "SE",
    });
    const interchange = new EdiInterchange({ id: "flat" }, ediDocument);
    const functionalGroup = new EdiFunctionalGroup({ id: "fake-group" }, interchange);
    const transactionSet = new EdiTransactionSet({ id: "0002" }, functionalGroup);
    const st = new EdiSegment("ST", 0, 2, 3, "~");
    const se = new EdiSegment("SE", 3, 5, 3, "~");

    transactionSet.startSegment = st;
    transactionSet.endSegment = se;
    functionalGroup.transactionSets.push(transactionSet);
    interchange.functionalGroups.push(functionalGroup);

    const segmentLines = new Map<EdiSegment, { start: number; end: number }>([
      [st, { start: 0, end: 0 }],
      [se, { start: 1, end: 1 }],
    ]);
    stubFoldingRanges(segmentLines);
    (EdiUtils as any).getTransactionSetRange = () => new vscode.Range(0, 0, 1, 0);
    (EdiUtils as any).getFunctionalGroupRange = () => new vscode.Range(0, 0, 1, 0);

    const functionalGroupRanges = provider.getFunctionalGroupFoldingRange(document, functionalGroup);
    assert.deepStrictEqual(functionalGroupRanges.map(range => [range.start, range.end]), [[0, 1]]);

    (EdiUtils as any).getInterchangeRange = () => new vscode.Range(0, 0, 0, 3);
    const interchangeRanges = provider.getInterchangeFoldingRange(document, interchange);
    assert.deepStrictEqual(interchangeRanges, []);
  });

  test("Should register folding range providers for x12 and edifact", () => {
    const registeredLanguages: string[] = [];
    vscode.languages.registerFoldingRangeProvider = (
      selector: vscode.DocumentSelector,
      foldingProvider: vscode.FoldingRangeProvider,
    ): vscode.Disposable => {
      const language = (selector as vscode.DocumentFilter).language;
      if (language) {
        registeredLanguages.push(language);
      }
      assert.strictEqual(foldingProvider, provider);
      return { dispose: () => {} };
    };

    const result = provider.registerFunctions();

    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(registeredLanguages, [EdiType.X12, EdiType.EDIFACT]);
  });
});

function createFoldingFixture() {
  const separators = new EdiDocumentSeparators();
  separators.segmentSeparator = "~";

  const ediDocument = new EdiDocument(separators, {
    interchangeStartSegmentName: "ISA",
    interchangeEndSegmentName: "IEA",
    functionalGroupStartSegmentName: "GS",
    functionalGroupEndSegmentName: "GE",
    transactionSetStartSegmentName: "ST",
    transactionSetEndSegmentName: "SE",
  });

  const isa = new EdiSegment("ISA", 0, 3, 4, "~");
  const gs = new EdiSegment("GS", 4, 6, 3, "~");
  const st = new EdiSegment("ST", 7, 9, 3, "~");
  const outerLoop = new EdiSegment("PO1Loop1", 10, 14, 5, "~");
  const pid = new EdiSegment("PID", 15, 18, 4, "~");
  const innerLoop = new EdiSegment("SLNLoop1", 19, 23, 5, "~");
  const sln = new EdiSegment("SLN", 24, 27, 4, "~");
  const ref = new EdiSegment("REF", 28, 31, 4, "~");
  const se = new EdiSegment("SE", 32, 34, 3, "~");
  const ge = new EdiSegment("GE", 35, 37, 3, "~");
  const iea = new EdiSegment("IEA", 38, 41, 4, "~");

  innerLoop.Loop = [sln, ref];
  outerLoop.Loop = [pid, innerLoop];

  const interchange = new EdiInterchange({ id: "0001" }, ediDocument);
  const functionalGroup = new EdiFunctionalGroup({ id: "1" }, interchange);
  const transactionSet = new EdiTransactionSet({ id: "0001" }, functionalGroup);

  interchange.startSegment = isa;
  interchange.endSegment = iea;
  interchange.functionalGroups.push(functionalGroup);

  functionalGroup.startSegment = gs;
  functionalGroup.endSegment = ge;
  functionalGroup.transactionSets.push(transactionSet);

  transactionSet.startSegment = st;
  transactionSet.segments.push(outerLoop);
  transactionSet.endSegment = se;

  ediDocument.interchanges.push(interchange);

  const segmentLines = new Map<EdiSegment, { start: number; end: number }>([
    [isa, { start: 0, end: 0 }],
    [gs, { start: 1, end: 1 }],
    [st, { start: 2, end: 2 }],
    [outerLoop, { start: 3, end: 3 }],
    [pid, { start: 4, end: 4 }],
    [innerLoop, { start: 5, end: 5 }],
    [sln, { start: 5, end: 5 }],
    [ref, { start: 6, end: 6 }],
    [se, { start: 7, end: 7 }],
    [ge, { start: 8, end: 8 }],
    [iea, { start: 9, end: 9 }],
  ]);

  return { ediDocument, segmentLines };
}

function stubFoldingRanges(segmentLines: Map<EdiSegment, { start: number; end: number }>) {
  const getSegmentLine = (segment: EdiSegment) => segmentLines.get(segment)!;

  (EdiUtils as any).getInterchangeRange = (_document: vscode.TextDocument, interchange: EdiInterchange) => {
    const first = getSegmentLine(interchange.getFirstSegment()!);
    const last = getSegmentLine(interchange.getLastSegment()!);
    return new vscode.Range(first.start, 0, last.end, 0);
  };
  (EdiUtils as any).getFunctionalGroupRange = (_document: vscode.TextDocument, functionalGroup: EdiFunctionalGroup) => {
    const first = getSegmentLine(functionalGroup.getFirstSegment()!);
    const last = getSegmentLine(functionalGroup.getLastSegment()!);
    return new vscode.Range(first.start, 0, last.end, 0);
  };
  (EdiUtils as any).getTransactionSetRange = (_document: vscode.TextDocument, transactionSet: EdiTransactionSet) => {
    const first = getSegmentLine(transactionSet.getFirstSegment()!);
    const last = getSegmentLine(transactionSet.getLastSegment()!);
    return new vscode.Range(first.start, 0, last.end, 0);
  };
  (EdiUtils as any).isOnlySegmentInLine = () => true;
  (EdiUtils as any).getSegmentStartPosition = (_document: vscode.TextDocument, segment: EdiSegment) => {
    return new vscode.Position(getSegmentLine(segment).start, 0);
  };
  (EdiUtils as any).getSegmentEndPosition = (_document: vscode.TextDocument, segment: EdiSegment) => {
    return new vscode.Position(getSegmentLine(segment).end, 0);
  };
}
