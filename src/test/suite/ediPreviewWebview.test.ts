import * as assert from "assert";
import * as vscode from "vscode";
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
});
