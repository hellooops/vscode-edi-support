import * as path from "path";
import * as vscode from "vscode";
import * as constants from "../constants";
import { EdiUtils } from "../utils/ediUtils";

export function createWebview(context: vscode.ExtensionContext) {
  const currentDocument = vscode.window.activeTextEditor?.document;
  const panel = prepareWebView(context);
  sendAndReceiveMessages(panel.webview);

  handleFileChange(panel.webview, currentDocument);
}

function prepareWebView(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    constants.webviews.previewViewType,
    "Preview",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(
          path.join(context.extensionPath, "edi-preview-dist", "assets")
        )
      ]
    }
  );

  const dependencyNameList: string[] = ["index.js"];
  const dependencyList: vscode.Uri[] = dependencyNameList.map(item =>
    panel.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(context.extensionPath, "edi-preview-dist", "assets", item)
      )
    )
  );
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EDI Preview</title>
  <script>
    const vscode = acquireVsCodeApi();
  </script>
  <script type="module" crossorigin src="${dependencyList[0]}"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>
`;
  panel.webview.html = html;

  panel.webview.onDidReceiveMessage(
    async ({ message }) => {
      vscode.window.showInformationMessage(message);
    },
    undefined,
    context.subscriptions
  );
  return panel;
}

function sendAndReceiveMessages(webview: vscode.Webview) {
  receiveMessages(webview);
  sendMessages(webview);
}

function receiveMessages(webview: vscode.Webview) {
  webview.onDidReceiveMessage(async (message) => {
    if (message.name === "log") {
      console.log(message.data);
      await vscode.window.showInformationMessage(message.data);
    }
  });
}

async function handleFileChange(webview: vscode.Webview, document: vscode.TextDocument | undefined) {
  if (!document) return;

  const fileName = document.fileName;
  const text = document.getText();
    
  const { parser } = EdiUtils.getEdiParser(document)!;
  if (!parser) {
    return [];
  }

  const result = await parser.parse();
  let a: VSCodeMessage;

  await webview.postMessage({
    name: "fileChange",
    data: {
      fileName,
      text,
      parsedResult: 123
    }
  });
}

function sendMessages(webview: vscode.Webview) {
  vscode.workspace.onDidChangeTextDocument(async editor => {
    if (!editor) return;
    await handleFileChange(webview, editor.document);
  });
}
