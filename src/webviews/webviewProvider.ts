import * as vscode from "vscode";
import * as constants from "../constants";
import * as path from "path";
import { EdiUtils } from "../utils/ediUtils";
// import { EdiMessage } from "../parser/entities";

export default class WebviewProvider {
  fileName: string;
  extensionContext: vscode.ExtensionContext;
  panel?: vscode.WebviewPanel;
  disposeCallback?: () => any;
  // parsedResult?: EdiMessage;

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
        vscode.window.showInformationMessage(message);
      },
      undefined,
      this.extensionContext.subscriptions
    );

    panel.onDidDispose(() => {
      this.disposeCallback && this.disposeCallback();
    });

    this.panel = panel;

    this.receiveMessages();

    this.update(document)
    return panel;
  }

  receiveMessages() {
    const e = this.panel!.webview.onDidReceiveMessage(async (message) => {
      if (message.name === "log") {
        console.log(message.data);
        await vscode.window.showInformationMessage(message.data);
      }
    });
    this.panel!.onDidDispose(() => {
      e.dispose();
    });
  }

  async update(document: vscode.TextDocument) {
    // const { parser, ediType } = EdiUtils.getEdiParser(document)!;
    // if (!parser) {
    //   return [];
    // }
  
    // const result = await parser.parse();
    // this.parsedResult = result;
    // const iEdiMessage = result.getIResult();
    // iEdiMessage.ediType = ediType as IEdiType;
    // const vcm: VcmMessage = {
    //   name: "fileChange",
    //   data: iEdiMessage
    // };
    // await this.panel!.webview.postMessage(vcm);
  }

  async onSelectionChange(startOffset: number) {
    // const { element, segment } = EdiUtils.getSegmentOrElementByPosition(startOffset, this.parsedResult!.segments);
    // const vcm: VcmActiveContext = {
    //   name: "active",
    //   data: {
    //     segmentKey: segment?.getIResult()?.key,
    //     elementKey: element?.getIResult()?.key
    //   }
    // };
    // await this.panel!.webview.postMessage(vcm);
  }

  onDidDispose(callback: () => any) {
    this.disposeCallback = callback;
  }
}
