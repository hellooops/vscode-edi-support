import * as assert from "assert";
import * as vscode from "vscode";

import { PreviewDocumentCommand } from "../../../commands/previewDocumentCommand";

suite("PreviewDocumentCommand Test Suite", () => {
  let originalActiveTextEditor: typeof vscode.window.activeTextEditor;

  setup(() => {
    originalActiveTextEditor = vscode.window.activeTextEditor;
  });

  teardown(() => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: originalActiveTextEditor,
      configurable: true,
    });
  });

  test("Should store extension context and safely return when there is no active editor", async () => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: undefined,
      configurable: true,
    });

    const context = {
      subscriptions: [],
    } as unknown as vscode.ExtensionContext;

    const command = new PreviewDocumentCommand(context);
    await command.command();

    assert.strictEqual(PreviewDocumentCommand.context, context);
  });
});
