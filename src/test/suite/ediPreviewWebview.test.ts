import * as assert from "assert";
import * as vscode from "vscode";
import { ensurePreviewEventsRegistered, previewWebviewTestHooks } from "../../webviews/ediPreviewWebview";

suite("EDI Preview Webview Test Suite", () => {
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
});
