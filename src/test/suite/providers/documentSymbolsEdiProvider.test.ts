import * as assert from "assert";
import * as vscode from "vscode";

import {
  EdiDocument,
  EdiDocumentSeparators,
  EdiElement,
  EdiFunctionalGroup,
  EdiInterchange,
  EdiSegment,
  EdiTransactionSet,
  EdiType,
  ElementType,
} from "../../../parser/entities";
import { DocumentSymbolsEdiProvider } from "../../../providers/documentSymbolsEdiProvider";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("DocumentSymbolsEdiProvider Test Suite", () => {
  let provider: DocumentSymbolsEdiProvider;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalGetInterchangeRange: typeof EdiUtils.getInterchangeRange;
  let originalGetFunctionalGroupRange: typeof EdiUtils.getFunctionalGroupRange;
  let originalGetTransactionSetRange: typeof EdiUtils.getTransactionSetRange;
  let originalGetSegmentRange: typeof EdiUtils.getSegmentRange;
  let originalGetElementRange: typeof EdiUtils.getElementRange;
  let originalRegisterDocumentSymbolProvider: typeof vscode.languages.registerDocumentSymbolProvider;

  setup(() => {
    provider = new DocumentSymbolsEdiProvider();
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalGetInterchangeRange = EdiUtils.getInterchangeRange;
    originalGetFunctionalGroupRange = EdiUtils.getFunctionalGroupRange;
    originalGetTransactionSetRange = EdiUtils.getTransactionSetRange;
    originalGetSegmentRange = EdiUtils.getSegmentRange;
    originalGetElementRange = EdiUtils.getElementRange;
    originalRegisterDocumentSymbolProvider = vscode.languages.registerDocumentSymbolProvider;
  });

  teardown(() => {
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).getInterchangeRange = originalGetInterchangeRange;
    (EdiUtils as any).getFunctionalGroupRange = originalGetFunctionalGroupRange;
    (EdiUtils as any).getTransactionSetRange = originalGetTransactionSetRange;
    (EdiUtils as any).getSegmentRange = originalGetSegmentRange;
    (EdiUtils as any).getElementRange = originalGetElementRange;
    vscode.languages.registerDocumentSymbolProvider = originalRegisterDocumentSymbolProvider;
  });

  test("Should return empty array when parser is unavailable or parse returns undefined", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00~", "x12");

    (EdiUtils as any).getEdiParser = () => ({ parser: undefined });
    const withoutParser = await provider.provideDocumentSymbols(document, EdiMockFactory.createMockCancellationToken());
    assert.deepStrictEqual(withoutParser, []);

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => undefined,
      },
    });
    const withoutDocument = await provider.provideDocumentSymbols(document, EdiMockFactory.createMockCancellationToken());
    assert.deepStrictEqual(withoutDocument, []);
  });

  test("Should build nested document symbols for separators, interchange, loops and elements", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00~\nGS*IN~\nST*850*0001~\nPO1*1~\nREF*ZZ*123~\nBEG*00~\nSE*4*0001~\nGE*1*1~\nIEA*1*0001~", "x12");
    const ediDocument = createDocumentSymbolFixture();

    stubSymbolRanges(document);
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ediDocument,
      },
      ediType: EdiType.X12,
    });

    const result = await provider.provideDocumentSymbols(document, EdiMockFactory.createMockCancellationToken()) as vscode.DocumentSymbol[];

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].name, "ISA");
    assert.strictEqual(result[0].detail, "ISA Header");

    const interchangeSymbol = result[1];
    assert.strictEqual(interchangeSymbol.name, "0001");
    assert.strictEqual(interchangeSymbol.detail, "Interchange");
    assert.strictEqual(interchangeSymbol.children.length, 3);

    const functionalGroupSymbol = interchangeSymbol.children[1];
    assert.strictEqual(functionalGroupSymbol.name, "1");
    assert.strictEqual(functionalGroupSymbol.detail, "FunctionalGroup");
    assert.strictEqual(functionalGroupSymbol.children.length, 1);

    const transactionSetSymbol = functionalGroupSymbol.children[0];
    assert.strictEqual(transactionSetSymbol.name, "00401 850[ID=0001]");
    assert.strictEqual(transactionSetSymbol.children.length, 4);

    const loopSymbol = transactionSetSymbol.children.find(child => child.name === "PO1Loop1");
    assert.ok(loopSymbol);
    assert.deepStrictEqual(loopSymbol!.children.map(child => child.name), ["REF"]);

    const begSymbol = transactionSetSymbol.children.find(child => child.name === "BEG");
    assert.ok(begSymbol);
    assert.strictEqual(begSymbol!.children.length, 1);
    assert.strictEqual(begSymbol!.children[0].name, "BEG01(E001)");
    assert.strictEqual(begSymbol!.children[0].children[0].name, "BEG01-1(C001)");
  });

  test("Should omit separators symbol when document does not expose a separators segment", async () => {
    const document = EdiMockFactory.createMockDocument("GS*IN~\nST*850*0001~\nSE*2*0001~", "x12");
    const ediDocument = createDocumentSymbolFixture();
    ediDocument.separatorsSegment = undefined;

    stubSymbolRanges(document);
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ediDocument,
      },
      ediType: EdiType.X12,
    });

    const result = await provider.provideDocumentSymbols(document, EdiMockFactory.createMockCancellationToken()) as vscode.DocumentSymbol[];

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].name, "0001");
    assert.strictEqual(result[0].detail, "Interchange");
  });

  test("Should flatten fake interchange and functional group symbols", () => {
    const document = EdiMockFactory.createMockDocument("ST*850*0002~\nSE*2*0002~", "x12");
    const separators = new EdiDocumentSeparators();
    separators.segmentSeparator = "~";
    separators.dataElementSeparator = "*";

    const ediDocument = new EdiDocument(separators, {
      interchangeStartSegmentName: "ISA",
      interchangeEndSegmentName: "IEA",
      functionalGroupStartSegmentName: "GS",
      functionalGroupEndSegmentName: "GE",
      transactionSetStartSegmentName: "ST",
      transactionSetEndSegmentName: "SE",
    });
    const interchange = new EdiInterchange({ id: "fake-interchange" }, ediDocument);
    const functionalGroup = new EdiFunctionalGroup({ id: "fake-group" }, interchange);
    const transactionSet = new EdiTransactionSet({ id: "0002", release: "00501", version: "856" }, functionalGroup);
    const st = new EdiSegment("ST", 0, 11, 12, "~");
    const se = new EdiSegment("SE", 12, 23, 12, "~");

    transactionSet.startSegment = st;
    transactionSet.endSegment = se;
    functionalGroup.transactionSets.push(transactionSet);
    interchange.functionalGroups.push(functionalGroup);

    stubSymbolRanges(document);

    const result = provider.getInterchangeSymbols(document, interchange);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].name, "00501 856[ID=0002]");
    assert.deepStrictEqual(result[0].children.map(child => child.name), ["ST", "SE"]);
  });

  test("Should register document symbol providers for x12, edifact and vda", () => {
    const registeredLanguages: string[] = [];
    vscode.languages.registerDocumentSymbolProvider = (
      selector: vscode.DocumentSelector,
      symbolProvider: vscode.DocumentSymbolProvider,
    ): vscode.Disposable => {
      const language = (selector as vscode.DocumentFilter).language;
      if (language) {
        registeredLanguages.push(language);
      }
      assert.strictEqual(symbolProvider, provider);
      return { dispose: () => {} };
    };

    const result = provider.registerFunctions();

    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(registeredLanguages, [EdiType.X12, EdiType.EDIFACT, EdiType.VDA]);
  });

  test("Should fall back to segment id and keep children empty when segment has no elements", () => {
    const document = EdiMockFactory.createMockDocument("N1~", "x12");
    const segment = new EdiSegment("N1", 0, 2, 3, "~");

    stubSymbolRanges(document);

    const symbol = provider.getSegmentSymbols(document, segment);

    assert.strictEqual(symbol.name, "N1");
    assert.strictEqual(symbol.detail, "N1");
    assert.deepStrictEqual(symbol.children, []);
  });

  test("Should fall back to element and component designators when schema descriptions are unavailable", () => {
    const document = EdiMockFactory.createMockDocument("REF*ZZ:AA~", "x12");
    const segment = new EdiSegment("REF", 0, 8, 9, "~");
    const element = new EdiElement(segment, ElementType.dataElement, 3, 5, "*", "REF", segment.startIndex, "01");
    const component = new EdiElement(segment, ElementType.componentElement, 6, 8, ":", "REF", segment.startIndex, "01-1");
    element.components = [component];

    stubSymbolRanges(document);

    const symbol = provider.getElementSymbols(document, element);

    assert.strictEqual(symbol.name, "REF01");
    assert.strictEqual(symbol.detail, "REF01");
    assert.strictEqual(symbol.children.length, 1);
    assert.strictEqual(symbol.children[0].name, "REF01-1");
    assert.strictEqual(symbol.children[0].detail, "REF01-1");
  });

  test("Should default element children to an empty array when components are unavailable", () => {
    const document = EdiMockFactory.createMockDocument("REF*ZZ~", "x12");
    const segment = new EdiSegment("REF", 0, 5, 6, "~");
    const element = new EdiElement(segment, ElementType.dataElement, 3, 5, "*", "REF", segment.startIndex, "01");

    stubSymbolRanges(document);

    const symbol = provider.getElementSymbols(document, element);

    assert.deepStrictEqual(symbol.children, []);
  });
});

function createDocumentSymbolFixture(): EdiDocument {
  const separators = new EdiDocumentSeparators();
  separators.segmentSeparator = "~";
  separators.dataElementSeparator = "*";

  const ediDocument = new EdiDocument(separators, {
    interchangeStartSegmentName: "ISA",
    interchangeEndSegmentName: "IEA",
    functionalGroupStartSegmentName: "GS",
    functionalGroupEndSegmentName: "GE",
    transactionSetStartSegmentName: "ST",
    transactionSetEndSegmentName: "SE",
  });

  const isa = new EdiSegment("ISA", 0, 6, 7, "~");
  isa.ediReleaseSchemaSegment = { desc: "ISA Header" } as any;
  const interchange = new EdiInterchange({ id: "0001" }, ediDocument);
  const functionalGroup = new EdiFunctionalGroup({ id: "1" }, interchange);
  const transactionSet = new EdiTransactionSet({ id: "0001", release: "00401", version: "850" }, functionalGroup);

  const gs = new EdiSegment("GS", 7, 13, 7, "~");
  const st = new EdiSegment("ST", 14, 25, 12, "~");
  const loop = new EdiSegment("PO1Loop1", 26, 31, 6, "~");
  const ref = new EdiSegment("REF", 32, 42, 11, "~");
  ref.ediReleaseSchemaSegment = { desc: "Reference" } as any;
  loop.Loop = [ref];

  const beg = new EdiSegment("BEG", 43, 50, 8, "~");
  beg.ediReleaseSchemaSegment = { desc: "Beginning Segment" } as any;
  const element = new EdiElement(beg, ElementType.dataElement, 3, 5, "*", "BEG", beg.startIndex, "01");
  element.ediReleaseSchemaElement = { id: "E001", desc: "Purpose" } as any;
  const component = new EdiElement(beg, ElementType.componentElement, 3, 5, ":", "BEG", beg.startIndex, "01-1");
  component.ediReleaseSchemaElement = { id: "C001", desc: "Purpose Code" } as any;
  element.components = [component];
  beg.elements = [element];

  const se = new EdiSegment("SE", 51, 62, 12, "~");
  const ge = new EdiSegment("GE", 63, 70, 8, "~");
  const iea = new EdiSegment("IEA", 71, 81, 11, "~");

  ediDocument.separatorsSegment = isa;
  interchange.startSegment = isa;
  interchange.endSegment = iea;
  interchange.functionalGroups.push(functionalGroup);

  functionalGroup.startSegment = gs;
  functionalGroup.endSegment = ge;
  functionalGroup.transactionSets.push(transactionSet);

  transactionSet.startSegment = st;
  transactionSet.segments.push(loop, beg);
  transactionSet.endSegment = se;

  ediDocument.interchanges.push(interchange);
  return ediDocument;
}

function stubSymbolRanges(document: vscode.TextDocument) {
  (EdiUtils as any).getInterchangeRange = (_document: vscode.TextDocument, interchange: EdiInterchange) => {
    return new vscode.Range(
      document.positionAt(interchange.getFirstSegment()!.startIndex),
      document.positionAt(interchange.getLastSegment()!.endIndex + 1),
    );
  };
  (EdiUtils as any).getFunctionalGroupRange = (_document: vscode.TextDocument, functionalGroup: EdiFunctionalGroup) => {
    return new vscode.Range(
      document.positionAt(functionalGroup.getFirstSegment()!.startIndex),
      document.positionAt(functionalGroup.getLastSegment()!.endIndex + 1),
    );
  };
  (EdiUtils as any).getTransactionSetRange = (_document: vscode.TextDocument, transactionSet: EdiTransactionSet) => {
    return new vscode.Range(
      document.positionAt(transactionSet.getFirstSegment()!.startIndex),
      document.positionAt(transactionSet.getLastSegment()!.endIndex + 1),
    );
  };
  (EdiUtils as any).getSegmentRange = (_document: vscode.TextDocument, segment: EdiSegment) => {
    return new vscode.Range(
      document.positionAt(segment.startIndex),
      document.positionAt(segment.endIndex + 1),
    );
  };
  (EdiUtils as any).getElementRange = (_document: vscode.TextDocument, segment: EdiSegment, element: EdiElement) => {
    return new vscode.Range(
      document.positionAt(segment.startIndex + element.startIndex),
      document.positionAt(segment.startIndex + element.endIndex),
    );
  };
}
