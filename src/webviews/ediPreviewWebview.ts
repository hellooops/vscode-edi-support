import * as path from "path";
import * as vscode from "vscode";
import WebviewProvider from './webviewProvider';

// TODO: change to existing webview if already exists
// TODO: only update relative webview if edi file is changed.

const webviewsProvidersMap: Map<string, WebviewProvider> = new Map();

export function createWebview(context: vscode.ExtensionContext) {
  const currentDocument = vscode.window.activeTextEditor?.document;
  if (!currentDocument) return;
  const fileName = currentDocument.fileName;
  let webviewProvider = webviewsProvidersMap.get(fileName);
  if (webviewProvider) {
    return;
  }

  webviewProvider = new WebviewProvider(fileName, context);
  webviewProvider.create(currentDocument);
  webviewProvider.onDidDispose(() => {
    webviewsProvidersMap.delete(fileName);
  });
  webviewsProvidersMap.set(fileName, webviewProvider);
  registerEvents();
}

function registerEvents() {
  vscode.workspace.onDidChangeTextDocument(async editor => {
    if (!editor?.document) return;
    const webviewProvider = webviewsProvidersMap.get(editor.document.fileName);
    if (!webviewProvider) return;
    webviewProvider.update(editor.document);
  });

  vscode.window.onDidChangeTextEditorSelection(async (event) => {
    if (!event.textEditor.document) return;
    const webviewProvider = webviewsProvidersMap.get(event.textEditor.document.fileName);
    if (!webviewProvider) return;
    webviewProvider.onSelectionChange(event.selections[0].active.line);
  });
}
