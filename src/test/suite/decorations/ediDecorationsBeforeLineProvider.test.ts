import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../../constants";
import { EdiSegment } from "../../../parser/entities";
import { EdiDecorationsBeforeLineProvider } from "../../../decorations/ediDecorationsBeforeLineProvider";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("EdiDecorationsBeforeLineProvider Test Suite", () => {
  let provider: EdiDecorationsBeforeLineProvider;
  let originalActiveTextEditor: typeof vscode.window.activeTextEditor;
  let originalGetConfiguration: typeof vscode.workspace.getConfiguration;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalIsOnlySegmentInLine: typeof EdiUtils.isOnlySegmentInLine;
  let originalGetSegmentRange: typeof EdiUtils.getSegmentRange;
  let originalIsDocumentSupported: typeof EdiUtils.isDocumentSupported;
  let originalOnDidChangeConfiguration: typeof vscode.workspace.onDidChangeConfiguration;
  let originalOnDidChangeTextEditorSelection: typeof vscode.window.onDidChangeTextEditorSelection;
  let originalOnDidChangeActiveTextEditor: typeof vscode.window.onDidChangeActiveTextEditor;

  setup(() => {
    provider = new EdiDecorationsBeforeLineProvider();
    originalActiveTextEditor = vscode.window.activeTextEditor;
    originalGetConfiguration = vscode.workspace.getConfiguration;
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalIsOnlySegmentInLine = EdiUtils.isOnlySegmentInLine;
    originalGetSegmentRange = EdiUtils.getSegmentRange;
    originalIsDocumentSupported = EdiUtils.isDocumentSupported;
    originalOnDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration;
    originalOnDidChangeTextEditorSelection = vscode.window.onDidChangeTextEditorSelection;
    originalOnDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor;
  });

  teardown(() => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: originalActiveTextEditor,
      configurable: true,
    });
    vscode.workspace.getConfiguration = originalGetConfiguration;
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).isOnlySegmentInLine = originalIsOnlySegmentInLine;
    (EdiUtils as any).getSegmentRange = originalGetSegmentRange;
    (EdiUtils as any).isDocumentSupported = originalIsDocumentSupported;
    (vscode.workspace as any).onDidChangeConfiguration = originalOnDidChangeConfiguration;
    (vscode.window as any).onDidChangeTextEditorSelection = originalOnDidChangeTextEditorSelection;
    (vscode.window as any).onDidChangeActiveTextEditor = originalOnDidChangeActiveTextEditor;
  });

  test("Should clear decorations when indentation in loop is disabled or parse returns undefined", async () => {
    const editor = createMockEditor(EdiMockFactory.createMockDocument("PO1~\nREF~", "x12"));
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.formatting.indentSegmentsInLoop]: false,
    });

    await provider.refreshDecorations(editor.document);
    assert.deepStrictEqual(editor.decorationCalls[0].decorations, []);

    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.formatting.indentSegmentsInLoop]: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => undefined,
      },
    });

    await provider.refreshDecorations(editor.document);
    assert.deepStrictEqual(editor.decorationCalls[1].decorations, []);
  });

  test("Should set before-line decorations only for segments that occupy a whole line", async () => {
    const document = EdiMockFactory.createMockDocument("PO1~\nREF~\nNTE~", "x12");
    const editor = createMockEditor(document);
    const loop = new EdiSegment("PO1Loop1", 0, 3, 4, "~");
    const childA = new EdiSegment("REF", 5, 8, 4, "~");
    const childB = new EdiSegment("NTE", 10, 13, 4, "~");
    childA.parentSegment = loop;
    childB.parentSegment = loop;
    loop.Loop = [childA, childB];
    const expectedRangeA = new vscode.Range(1, 0, 1, 4);

    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.formatting.indentSegmentsInLoop]: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [childA, childB],
        }),
      },
    });
    (EdiUtils as any).isOnlySegmentInLine = (_document: vscode.TextDocument, segment: EdiSegment) => segment === childA;
    (EdiUtils as any).getSegmentRange = (_document: vscode.TextDocument, segment: EdiSegment) => {
      assert.strictEqual(segment, childA);
      return expectedRangeA;
    };

    await provider.refreshDecorations(document);

    assert.strictEqual(editor.decorationCalls.length, 1);
    assert.deepStrictEqual(editor.decorationCalls[0].decorations, [
      {
        renderOptions: {
          before: {
            contentText: "",
            width: "0ch",
          },
        },
        range: expectedRangeA,
      },
    ]);
  });

  test("Should register configuration, selection and active editor listeners", async () => {
    const document = EdiMockFactory.createMockDocument("PO1~", "x12");
    const editor = createMockEditor(document);
    let configurationListener: ((event: vscode.ConfigurationChangeEvent) => Promise<void>) | undefined;
    let selectionListener: ((event: vscode.TextEditorSelectionChangeEvent) => Promise<void>) | undefined;
    let activeEditorListener: ((editor: vscode.TextEditor | undefined) => Promise<void>) | undefined;
    const refreshedDocuments: vscode.TextDocument[] = [];

    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });
    (EdiUtils as any).isDocumentSupported = (currentDocument?: vscode.TextDocument | null) => currentDocument?.languageId === "x12";
    (vscode.workspace as any).onDidChangeConfiguration = (listener: (event: vscode.ConfigurationChangeEvent) => Promise<void>) => {
      configurationListener = listener;
      return { dispose: () => {} };
    };
    (vscode.window as any).onDidChangeTextEditorSelection = (listener: (event: vscode.TextEditorSelectionChangeEvent) => Promise<void>) => {
      selectionListener = listener;
      return { dispose: () => {} };
    };
    (vscode.window as any).onDidChangeActiveTextEditor = (listener: (editor: vscode.TextEditor | undefined) => Promise<void>) => {
      activeEditorListener = listener;
      return { dispose: () => {} };
    };
    provider.refreshDecorations = async (currentDocument: vscode.TextDocument) => {
      refreshedDocuments.push(currentDocument);
    };

    const disposables = provider.registerDecorations();

    assert.strictEqual(disposables.length, 3);
    assert.ok(configurationListener);
    assert.ok(selectionListener);
    assert.ok(activeEditorListener);

    await configurationListener!({ affectsConfiguration: () => true } as vscode.ConfigurationChangeEvent);
    await selectionListener!({
      textEditor: editor,
      selections: [new vscode.Selection(0, 0, 0, 0)],
      kind: undefined,
    } as vscode.TextEditorSelectionChangeEvent);
    await activeEditorListener!(editor);
    await activeEditorListener!({ document: EdiMockFactory.createMockDocument("text", "plaintext") } as vscode.TextEditor);

    assert.deepStrictEqual(refreshedDocuments, [document, document, document]);
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
