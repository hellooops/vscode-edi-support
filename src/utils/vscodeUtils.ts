import * as vscode from "vscode";

export default class VscodeUtils {
  static async refreshEditor(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const document = editor.document;
    const documentContent = document.getText();
    await editor.edit((builder) => {
      builder.replace(
        new vscode.Range(
          document.positionAt(0), 
          document.positionAt(documentContent.length)
        ),
        documentContent
      );
    });
  }
}
