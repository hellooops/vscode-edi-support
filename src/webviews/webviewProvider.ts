import * as vscode from "vscode";
import * as constants from "../constants";
import * as path from "path";
import * as fs from "fs/promises";
import { EdiUtils } from "../utils/ediUtils";
import { EdiDocument } from "edi-parser";
import { buildPreviewDocument, IPreviewEdiDocument } from "./previewDocument";
import { getElementNodeKey, getSegmentNodeKey } from "./previewNodeKeys";

export function buildExportHtml(previewDocument: IPreviewEdiDocument, stylesheet: string, script: string) {
  const previewData = JSON.stringify(previewDocument).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EDI Preview</title>
  <style>${stylesheet}</style>
</head>
<body>
  <div id="app"></div>
  <script>window.__EDI_PREVIEW_DATA__=${previewData};</script>
  <script type="module">${script}</script>
</body>
</html>
`;
}

export default class WebviewProvider {
  fileName: string;
  extensionContext: vscode.ExtensionContext;
  panel?: vscode.WebviewPanel;
  disposeCallback?: () => any;
  ediDocument?: EdiDocument;
  private previewDocument?: IPreviewEdiDocument;
  private webviewReady: boolean = false;
  private pendingDocumentMessage?: VcmDocument;
  private pendingActiveMessage?: VcmActiveContext;

  constructor(fileName: string, extensionContext: vscode.ExtensionContext) {
    this.fileName = fileName;
    this.extensionContext = extensionContext;
  }

  create(document: vscode.TextDocument) {
    const panel = vscode.window.createWebviewPanel(
      constants.webviews.previewViewType,
      `Preview ${this.fileName}`,
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(
            path.join(this.extensionContext.extensionPath, "edi-preview-dist", "assets")
          )
        ],
        retainContextWhenHidden: true
      }
    );
    

    const dependencyNameList: string[] = ["index.js", "index.css"];
    const dependencyList: vscode.Uri[] = dependencyNameList.map(item =>
      panel!.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(this.extensionContext.extensionPath, "edi-preview-dist", "assets", item)
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
    <link rel="stylesheet" href="${dependencyList[1]}">
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>
  `;
    panel.webview.html = html;

    panel.webview.onDidReceiveMessage(
      async ({ message }) => {
        if (typeof message === "string") {
          await vscode.window.showInformationMessage(message);
        }
      },
      undefined,
      this.extensionContext.subscriptions
    );

    panel.onDidDispose(() => {
      this.disposeCallback && this.disposeCallback();
    });

    this.panel = panel;

    this.receiveMessages();

    this.update(document);
    return panel;
  }

  receiveMessages() {
    const e = this.panel!.webview.onDidReceiveMessage(async (message) => {
      if (message.name === "ready") {
        this.webviewReady = true;
        await this.flushPendingMessages();
      } else if (message.name === "log") {
        console.log(message.data);
        await vscode.window.showInformationMessage(message.data);
      }
    });
    this.panel!.onDidDispose(() => {
      e.dispose();
    });
  }

  async update(document: vscode.TextDocument) {
    const { parser, ediType } = EdiUtils.getEdiParser(document)!;
    if (!parser) {
      return [];
    }
  
    const ediDocument = await EdiUtils.getParsedEdiDocument(document);
    if (!ediDocument) {
      return [];
    }
    this.ediDocument = ediDocument;
    this.previewDocument = buildPreviewDocument(ediDocument, ediType as EdiTypeValue);
    const vcm: VcmDocument = {
      name: "fileChange",
      data: this.previewDocument
    };
    await this.postMessageWhenReady(vcm);
  }

  async onSelectionChange(startOffset: number) {
    const { element, segment } = EdiUtils.getSegmentOrElementByPosition(startOffset, this.ediDocument?.getSegments()!);
    const vcm: VcmActiveContext = {
      name: "active",
      data: {
        segmentNodeKey: segment ? getSegmentNodeKey(segment) : undefined,
        elementNodeKey: segment && element ? getElementNodeKey(segment, element) : undefined
      }
    };
    await this.postMessageWhenReady(vcm);
  }

  onDidDispose(callback: () => any) {
    this.disposeCallback = callback;
  }

  private async postMessageWhenReady(message: VcmDocument | VcmActiveContext) {
    if (!this.webviewReady) {
      if (message.name === "fileChange") {
        this.pendingDocumentMessage = message as VcmDocument;
      } else if (message.name === "active") {
        this.pendingActiveMessage = message as VcmActiveContext;
      }
      return;
    }

    await this.panel!.webview.postMessage(message);
  }

  private async flushPendingMessages() {
    if (!this.panel || !this.webviewReady) {
      return;
    }

    if (this.pendingDocumentMessage) {
      await this.panel.webview.postMessage(this.pendingDocumentMessage);
      this.pendingDocumentMessage = undefined;
    }

    if (this.pendingActiveMessage) {
      await this.panel.webview.postMessage(this.pendingActiveMessage);
      this.pendingActiveMessage = undefined;
    }
  }

  async exportHtml() {
    if (!this.previewDocument) {
      return;
    }

    const outputUri = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(`${this.fileName}.html`),
      filters: { HTML: ["html"] },
    });
    if (!outputUri) {
      return;
    }

    const assetsPath = path.join(this.extensionContext.extensionPath, "edi-preview-dist", "assets");
    const [stylesheet, script] = await Promise.all([
      fs.readFile(path.join(assetsPath, "index.css"), "utf8"),
      fs.readFile(path.join(assetsPath, "index.js"), "utf8")
    ]);
    const html = buildExportHtml(this.previewDocument, stylesheet, script);
    await fs.writeFile(outputUri.fsPath, html, "utf8");
    await vscode.window.showInformationMessage(`Preview exported to ${outputUri.fsPath}`);
  }
}
