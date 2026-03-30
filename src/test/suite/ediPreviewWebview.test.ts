import * as assert from "assert";
import * as vscode from "vscode";
import * as constants from "../../constants";
import { EdiType } from "../../parser/entities";
import { EdiUtils } from "../../utils/ediUtils";
import WebviewProvider from "../../webviews/webviewProvider";
import { createWebview, ensurePreviewEventsRegistered, previewWebviewTestHooks } from "../../webviews/ediPreviewWebview";
import { EdiMockFactory } from "./mocks/ediMockFactory";

suite("EDI Preview Webview Test Suite", () => {
  let originalActiveTextEditor: typeof vscode.window.activeTextEditor;

  setup(() => {
    originalActiveTextEditor = vscode.window.activeTextEditor;
  });

  teardown(() => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: originalActiveTextEditor,
      configurable: true,
    });
    previewWebviewTestHooks.resetRegistrationState();
  });

  test("Preview events should only register once", () => {
    const originalOnDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument;
    const originalOnDidChangeTextEditorSelection = vscode.window.onDidChangeTextEditorSelection;
    let textDocumentListenerRegistrations = 0;
    let selectionListenerRegistrations = 0;

    (vscode.workspace as any).onDidChangeTextDocument = () => {
      textDocumentListenerRegistrations++;
      return new vscode.Disposable(() => {});
    };
    (vscode.window as any).onDidChangeTextEditorSelection = () => {
      selectionListenerRegistrations++;
      return new vscode.Disposable(() => {});
    };

    const context = {
      subscriptions: [] as vscode.Disposable[]
    } as vscode.ExtensionContext;

    try {
      previewWebviewTestHooks.resetRegistrationState();

      ensurePreviewEventsRegistered(context);
      ensurePreviewEventsRegistered(context);

      assert.strictEqual(textDocumentListenerRegistrations, 1);
      assert.strictEqual(selectionListenerRegistrations, 1);
      assert.strictEqual(context.subscriptions.length, 2);
    } finally {
      (vscode.workspace as any).onDidChangeTextDocument = originalOnDidChangeTextDocument;
      (vscode.window as any).onDidChangeTextEditorSelection = originalOnDidChangeTextEditorSelection;
      previewWebviewTestHooks.resetRegistrationState();
    }
  });

  test("createWebview should do nothing when there is no active editor", () => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: undefined,
      configurable: true,
    });

    const context = {
      subscriptions: [] as vscode.Disposable[],
    } as vscode.ExtensionContext;

    createWebview(context);
  });

  test("createWebview should reuse provider for the same file and forward preview events", async () => {
    const originalOnDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument;
    const originalOnDidChangeTextEditorSelection = vscode.window.onDidChangeTextEditorSelection;
    const originalCreate = WebviewProvider.prototype.create;
    const originalOnDidDispose = WebviewProvider.prototype.onDidDispose;
    const originalUpdate = WebviewProvider.prototype.update;
    const originalOnSelectionChange = WebviewProvider.prototype.onSelectionChange;
    let textDocumentListener: ((event: vscode.TextDocumentChangeEvent) => unknown) | undefined;
    let selectionListener: ((event: vscode.TextEditorSelectionChangeEvent) => unknown) | undefined;
    const createdProviders: WebviewProvider[] = [];
    let createCount = 0;
    let updateCount = 0;
    let selectionCount = 0;

    (vscode.workspace as any).onDidChangeTextDocument = (listener: (event: vscode.TextDocumentChangeEvent) => unknown) => {
      textDocumentListener = listener;
      return new vscode.Disposable(() => {});
    };
    (vscode.window as any).onDidChangeTextEditorSelection = (listener: (event: vscode.TextEditorSelectionChangeEvent) => unknown) => {
      selectionListener = listener;
      return new vscode.Disposable(() => {});
    };
    WebviewProvider.prototype.create = function(document: vscode.TextDocument) {
      createCount++;
      createdProviders.push(this);
      this.panel = {
        webview: {
          postMessage: async () => true,
        },
      } as any;
      return {} as vscode.WebviewPanel;
    };
    WebviewProvider.prototype.onDidDispose = function(callback: () => any) {
      this.disposeCallback = callback;
    };
    WebviewProvider.prototype.update = async function() {
      updateCount++;
      return [];
    };
    WebviewProvider.prototype.onSelectionChange = async function() {
      selectionCount++;
    };

    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
    const context = {
      subscriptions: [] as vscode.Disposable[],
    } as vscode.ExtensionContext;

    try {
      previewWebviewTestHooks.resetRegistrationState();
      Object.defineProperty(vscode.window, "activeTextEditor", {
        value: { document },
        configurable: true,
      });

      createWebview(context);
      createWebview(context);

      assert.strictEqual(createCount, 1);
      assert.ok(textDocumentListener);
      assert.ok(selectionListener);

      await textDocumentListener!({ document } as vscode.TextDocumentChangeEvent);
      await selectionListener!({
        textEditor: {
          document,
        },
        selections: [new vscode.Selection(0, 0, 0, 0)],
        kind: vscode.TextEditorSelectionChangeKind.Command,
      } as unknown as vscode.TextEditorSelectionChangeEvent);

      assert.strictEqual(updateCount, 1);
      assert.strictEqual(selectionCount, 1);

      createdProviders[0].disposeCallback?.();

      createWebview(context);
      assert.strictEqual(createCount, 2);
    } finally {
      (vscode.workspace as any).onDidChangeTextDocument = originalOnDidChangeTextDocument;
      (vscode.window as any).onDidChangeTextEditorSelection = originalOnDidChangeTextEditorSelection;
      WebviewProvider.prototype.create = originalCreate;
      WebviewProvider.prototype.onDidDispose = originalOnDidDispose;
      WebviewProvider.prototype.update = originalUpdate;
      WebviewProvider.prototype.onSelectionChange = originalOnSelectionChange;
      createdProviders.forEach(provider => provider.disposeCallback?.());
      previewWebviewTestHooks.resetRegistrationState();
    }
  });

  test("WebviewProvider should create panel, update content and react to selection changes", async () => {
    const originalCreateWebviewPanel = vscode.window.createWebviewPanel;
    const originalShowInformationMessage = vscode.window.showInformationMessage;
    const originalGetEdiParser = EdiUtils.getEdiParser;
    const originalGetSegmentOrElementByPosition = EdiUtils.getSegmentOrElementByPosition;
    const postedMessages: unknown[] = [];
    const shownMessages: string[] = [];
    let webviewMessageListener: ((message: any) => unknown) | undefined;
    let receivedMessageListener: ((message: any) => unknown) | undefined;
    const panelDisposeListeners: Array<() => unknown> = [];
    let disposed = false;

    vscode.window.createWebviewPanel = (
      viewType: string,
      title: string,
      showOptions: vscode.ViewColumn | { readonly viewColumn: vscode.ViewColumn; readonly preserveFocus?: boolean },
      options?: vscode.WebviewOptions & vscode.WebviewPanelOptions,
    ) => {
      assert.strictEqual(viewType, constants.webviews.previewViewType);
      assert.strictEqual(title, "Preview test.x12");
      const viewColumn = typeof showOptions === "number" ? showOptions : showOptions.viewColumn;
      assert.strictEqual(viewColumn, vscode.ViewColumn.Two);
      assert.ok(options);
      assert.strictEqual(options!.enableScripts, true);
      assert.strictEqual(options!.retainContextWhenHidden, true);

      return {
        webview: {
          html: "",
          asWebviewUri: (uri: vscode.Uri) => uri,
          postMessage: async (message: unknown) => {
            postedMessages.push(message);
            return true;
          },
          onDidReceiveMessage: (listener: (message: any) => unknown) => {
            if (!webviewMessageListener) {
              webviewMessageListener = listener;
            } else {
              receivedMessageListener = listener;
            }
            return new vscode.Disposable(() => {
              disposed = true;
            });
          },
        },
        onDidDispose: (listener: () => unknown) => {
          panelDisposeListeners.push(listener);
          return new vscode.Disposable(() => {});
        },
      } as unknown as vscode.WebviewPanel;
    };
    (vscode.window as any).showInformationMessage = async (message: string) => {
      shownMessages.push(message);
      return undefined;
    };

    const provider = new WebviewProvider("test.x12", {
      extensionPath: "D:\\Dev\\vscode-edi-support",
      subscriptions: [],
    } as unknown as vscode.ExtensionContext);
    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
    const ediDocument = {
      getIResult: () => ({ key: "doc-key" }),
      getSegments: () => [],
    };
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ediDocument,
      },
      ediType: EdiType.X12,
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({
      segment: {
        getIResult: () => ({ key: "segment-key" }),
      },
      element: {
        getIResult: () => ({ key: "element-key" }),
      },
    });

    try {
      provider.onDidDispose(() => {
        shownMessages.push("disposed");
      });

      const panel = provider.create(document);
      assert.ok(panel);
      assert.ok(provider.panel?.webview.html.includes("EDI Preview"));
      assert.ok(provider.panel?.webview.html.includes("index.js"));
      assert.ok(provider.panel?.webview.html.includes("index.css"));
      await new Promise(resolve => setTimeout(resolve, 0));
      assert.strictEqual(postedMessages.length, 0);

      await receivedMessageListener!({ name: "ready" });

      assert.strictEqual(postedMessages.length, 1);
      assert.deepStrictEqual(postedMessages[0], {
        name: "fileChange",
        data: {
          key: "doc-key",
          ediType: EdiType.X12,
        },
      });

      await provider.onSelectionChange(0);
      assert.deepStrictEqual(postedMessages[1], {
        name: "active",
        data: {
          segmentKey: "segment-key",
          elementKey: "element-key",
        },
      });

      await webviewMessageListener!({ message: "hello" });
      await receivedMessageListener!({ name: "log", data: "debug" });
      assert.deepStrictEqual(shownMessages, ["hello", "debug"]);

      panelDisposeListeners.forEach(listener => listener());
      assert.deepStrictEqual(shownMessages, ["hello", "debug", "disposed"]);
      assert.strictEqual(disposed, true);
    } finally {
      vscode.window.createWebviewPanel = originalCreateWebviewPanel;
      vscode.window.showInformationMessage = originalShowInformationMessage;
      (EdiUtils as any).getEdiParser = originalGetEdiParser;
      (EdiUtils as any).getSegmentOrElementByPosition = originalGetSegmentOrElementByPosition;
    }
  });

  test("WebviewProvider update should return empty array when parser is unavailable", async () => {
    const originalGetEdiParser = EdiUtils.getEdiParser;
    const provider = new WebviewProvider("test.x12", {
      subscriptions: [],
    } as unknown as vscode.ExtensionContext);
    provider.panel = {
      webview: {
        postMessage: async () => true,
      },
    } as any;
    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");

    try {
      (EdiUtils as any).getEdiParser = () => ({
        parser: undefined,
        ediType: EdiType.X12,
      });

      const result = await provider.update(document);
      assert.deepStrictEqual(result, []);
    } finally {
      (EdiUtils as any).getEdiParser = originalGetEdiParser;
    }
  });
});
