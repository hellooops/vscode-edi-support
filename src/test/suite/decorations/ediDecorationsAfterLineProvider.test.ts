import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../../constants";
import { EdiElement, EdiSegment, ElementType } from "../../../parser/entities";
import { EdiDecorationsAfterLineProvider } from "../../../decorations/ediDecorationsAfterLineProvider";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("EdiDecorationsAfterLineProvider Test Suite", () => {
  let provider: EdiDecorationsAfterLineProvider;
  let originalActiveTextEditor: typeof vscode.window.activeTextEditor;
  let originalGetConfiguration: typeof vscode.workspace.getConfiguration;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalGetSegmentOrElementByPosition: typeof EdiUtils.getSegmentOrElementByPosition;
  let originalIsOnlySegmentInLine: typeof EdiUtils.isOnlySegmentInLine;
  let originalGetSegmentRange: typeof EdiUtils.getSegmentRange;
  let originalOnDidChangeTextEditorSelection: typeof vscode.window.onDidChangeTextEditorSelection;

  setup(() => {
    provider = new EdiDecorationsAfterLineProvider();
    originalActiveTextEditor = vscode.window.activeTextEditor;
    originalGetConfiguration = vscode.workspace.getConfiguration;
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalGetSegmentOrElementByPosition = EdiUtils.getSegmentOrElementByPosition;
    originalIsOnlySegmentInLine = EdiUtils.isOnlySegmentInLine;
    originalGetSegmentRange = EdiUtils.getSegmentRange;
    originalOnDidChangeTextEditorSelection = vscode.window.onDidChangeTextEditorSelection;
  });

  teardown(() => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: originalActiveTextEditor,
      configurable: true,
    });
    vscode.workspace.getConfiguration = originalGetConfiguration;
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).getSegmentOrElementByPosition = originalGetSegmentOrElementByPosition;
    (EdiUtils as any).isOnlySegmentInLine = originalIsOnlySegmentInLine;
    (EdiUtils as any).getSegmentRange = originalGetSegmentRange;
    (vscode.window as any).onDidChangeTextEditorSelection = originalOnDidChangeTextEditorSelection;
  });

  test("Should clear decorations when trailing annotations are disabled", async () => {
    const editor = createMockEditor(EdiMockFactory.createMockDocument("BEG*00~", "x12"));
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableTrailingAnnotations]: false,
    });

    await provider.refreshDecorations(editor.document, 0);

    assert.strictEqual(editor.decorationCalls.length, 1);
    assert.deepStrictEqual(editor.decorationCalls[0].decorations, []);
  });

  test("Should clear decorations when parser or selected segment is unavailable", async () => {
    const editor = createMockEditor(EdiMockFactory.createMockDocument("BEG*00~", "x12"));
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableTrailingAnnotations]: true,
    });

    (EdiUtils as any).getEdiParser = () => ({ parser: undefined });
    await provider.refreshDecorations(editor.document, 0);

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({ getSegments: () => [] }),
      },
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({});
    await provider.refreshDecorations(editor.document, 0);

    assert.strictEqual(editor.decorationCalls.length, 2);
    assert.deepStrictEqual(editor.decorationCalls[0].decorations, []);
    assert.deepStrictEqual(editor.decorationCalls[1].decorations, []);
  });

  test("Should set segment annotation decoration when only a segment is selected", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00~", "x12");
    const editor = createMockEditor(document);
    const segment = new EdiSegment("BEG", 0, 6, 7, "~");
    segment.ediReleaseSchemaSegment = { desc: "Beginning Segment" } as any;
    const expectedRange = new vscode.Range(0, 0, 0, 7);

    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableTrailingAnnotations]: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment });
    (EdiUtils as any).isOnlySegmentInLine = () => true;
    (EdiUtils as any).getSegmentRange = (_document: vscode.TextDocument, currentSegment: EdiSegment, includeEndingDelimiter?: boolean) => {
      assert.strictEqual(currentSegment, segment);
      assert.strictEqual(includeEndingDelimiter, true);
      return expectedRange;
    };

    await provider.refreshDecorations(document, 0);

    assert.strictEqual(editor.decorationCalls.length, 1);
    assert.deepStrictEqual(editor.decorationCalls[0].decorations, [
      {
        renderOptions: {
          after: {
            contentText: "BEG: Beginning Segment",
          },
        },
        range: expectedRange,
      },
    ]);
  });

  test("Should set element annotation decoration for qualifier elements", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00~", "x12");
    const editor = createMockEditor(document);
    const segment = new EdiSegment("BEG", 0, 6, 7, "\n");
    const element = new EdiElement(segment, ElementType.dataElement, 3, 5, "*", "BEG", 0, "01");
    element.value = "00";
    element.ediReleaseSchemaElement = {
      id: "E353",
      desc: "Transaction Set Purpose Code",
      qualifierRef: "Purpose code",
      getCodeByValue: (value: string) => value === "00" ? { desc: "Original" } : undefined,
    } as any;
    const expectedRange = new vscode.Range(0, 0, 0, 7);

    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableTrailingAnnotations]: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment, element });
    (EdiUtils as any).isOnlySegmentInLine = () => true;
    (EdiUtils as any).getSegmentRange = (_document: vscode.TextDocument, currentSegment: EdiSegment, includeEndingDelimiter?: boolean) => {
      assert.strictEqual(currentSegment, segment);
      assert.strictEqual(includeEndingDelimiter, undefined);
      return expectedRange;
    };

    await provider.refreshDecorations(document, 4);

    assert.strictEqual(editor.decorationCalls.length, 1);
    assert.deepStrictEqual(editor.decorationCalls[0].decorations, [
      {
        renderOptions: {
          after: {
            contentText: "BEG01(E353): Transaction Set Purpose Code, 00: Original",
          },
        },
        range: expectedRange,
      },
    ]);
  });

  test("Should register selection listener and refresh using selection offset", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00~", "x12");
    const editor = createMockEditor(document);
    let selectionListener: ((event: vscode.TextEditorSelectionChangeEvent) => Promise<void>) | undefined;
    let capturedOffset: number | undefined;

    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });
    (vscode.window as any).onDidChangeTextEditorSelection = (listener: (event: vscode.TextEditorSelectionChangeEvent) => Promise<void>) => {
      selectionListener = listener;
      return { dispose: () => {} };
    };
    provider.refreshDecorations = async (_document: vscode.TextDocument, startOffset: number) => {
      capturedOffset = startOffset;
    };

    const disposables = provider.registerDecorations();
    assert.strictEqual(disposables.length, 1);
    assert.ok(selectionListener);

    await selectionListener!({
      textEditor: editor,
      selections: [new vscode.Selection(0, 4, 0, 4)],
      kind: undefined,
    } as vscode.TextEditorSelectionChangeEvent);

    assert.strictEqual(capturedOffset, 4);
  });
});

function createMockEditor(document: vscode.TextDocument): vscode.TextEditor & {
  decorationCalls: Array<{ decorationType: vscode.TextEditorDecorationType; decorations: readonly vscode.DecorationOptions[] }>;
} {
  const decorationCalls: Array<{ decorationType: vscode.TextEditorDecorationType; decorations: readonly vscode.DecorationOptions[] }> = [];

  return {
    document,
    selections: [],
    setDecorations: (decorationType: vscode.TextEditorDecorationType, decorations: readonly vscode.DecorationOptions[]) => {
      decorationCalls.push({ decorationType, decorations });
    },
    decorationCalls,
  } as unknown as vscode.TextEditor & {
    decorationCalls: Array<{ decorationType: vscode.TextEditorDecorationType; decorations: readonly vscode.DecorationOptions[] }>;
  };
}
