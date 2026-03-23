import * as assert from "assert";
import * as vscode from "vscode";

import { EdiElement, EdiSegment, EdiType, ElementType } from "../../../parser/entities";
import { HighlightEdiProvider } from "../../../providers/highlightEdiProvider";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("HighlightEdiProvider Test Suite", () => {
  let provider: HighlightEdiProvider;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalGetElementStartPosition: typeof EdiUtils.getElementStartPosition;
  let originalGetElementEndPosition: typeof EdiUtils.getElementEndPosition;
  let originalGetSegmentStartPosition: typeof EdiUtils.getSegmentStartPosition;
  let originalRegisterDocumentHighlightProvider: typeof vscode.languages.registerDocumentHighlightProvider;

  setup(() => {
    provider = new HighlightEdiProvider();
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalGetElementStartPosition = EdiUtils.getElementStartPosition;
    originalGetElementEndPosition = EdiUtils.getElementEndPosition;
    originalGetSegmentStartPosition = EdiUtils.getSegmentStartPosition;
    originalRegisterDocumentHighlightProvider = vscode.languages.registerDocumentHighlightProvider;
  });

  teardown(() => {
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).getElementStartPosition = originalGetElementStartPosition;
    (EdiUtils as any).getElementEndPosition = originalGetElementEndPosition;
    (EdiUtils as any).getSegmentStartPosition = originalGetSegmentStartPosition;
    vscode.languages.registerDocumentHighlightProvider = originalRegisterDocumentHighlightProvider;
  });

  test("Should return undefined when parser is unavailable", async () => {
    (EdiUtils as any).getEdiParser = () => ({ parser: undefined });

    const result = await provider.provideDocumentHighlights(
      EdiMockFactory.createMockDocument("BEG*00~", "x12"),
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.strictEqual(result, undefined);
  });

  test("Should return empty array when selected segment has no elements", async () => {
    const segment = new EdiSegment("BEG", 0, 6, 7, "~");
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
      ediType: EdiType.X12,
    });

    const result = await provider.provideDocumentHighlights(
      EdiMockFactory.createMockDocument("BEG*00~", "x12"),
      new vscode.Position(0, 1),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.deepStrictEqual(result, []);
  });

  test("Should highlight the selected element range", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00*12~", "x12");
    const segment = new EdiSegment("BEG", 0, 9, 10, "~");
    const element = new EdiElement(segment, ElementType.dataElement, 3, 5, "*", "BEG", 0, "01");
    segment.elements = [element];

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
      ediType: EdiType.X12,
    });
    (EdiUtils as any).getElementStartPosition = () => new vscode.Position(0, 3);
    (EdiUtils as any).getElementEndPosition = () => new vscode.Position(0, 5);

    const result = await provider.provideDocumentHighlights(
      document,
      new vscode.Position(0, 4),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.ok(result);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0].range, new vscode.Range(new vscode.Position(0, 3), new vscode.Position(0, 5)));
    assert.strictEqual(result[0].kind, vscode.DocumentHighlightKind.Read);
  });

  test("Should highlight segment id when the cursor is before the first element", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00*12~", "x12");
    const segment = new EdiSegment("BEG", 0, 9, 10, "~");
    const firstElement = new EdiElement(segment, ElementType.dataElement, 3, 5, "*", "BEG", 0, "01");
    const secondElement = new EdiElement(segment, ElementType.dataElement, 6, 8, "*", "BEG", 0, "02");
    segment.elements = [firstElement, secondElement];

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
      ediType: EdiType.X12,
    });
    (EdiUtils as any).getSegmentStartPosition = () => new vscode.Position(0, 0);
    (EdiUtils as any).getElementStartPosition = () => new vscode.Position(0, 3);

    const result = await provider.provideDocumentHighlights(
      document,
      new vscode.Position(0, 1),
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.ok(result);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0].range, new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 3)));
  });

  test("Should register highlight providers for x12, edifact and vda", () => {
    const registeredLanguages: string[] = [];
    vscode.languages.registerDocumentHighlightProvider = (
      selector: vscode.DocumentSelector,
      highlightProvider: vscode.DocumentHighlightProvider,
    ): vscode.Disposable => {
      const language = (selector as vscode.DocumentFilter).language;
      if (language) {
        registeredLanguages.push(language);
      }
      assert.strictEqual(highlightProvider, provider);
      return { dispose: () => {} };
    };

    const result = provider.registerFunctions();

    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(registeredLanguages, [EdiType.X12, EdiType.EDIFACT, EdiType.VDA]);
  });
});
