import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../../constants";
import { SelectTextByPositionCommand } from "../../../commands/selectTextByPositionCommand";

suite("SelectTextByPositionCommand Test Suite", () => {
  let originalActiveTextEditor: typeof vscode.window.activeTextEditor;
  let originalExecuteCommand: typeof vscode.commands.executeCommand;

  setup(() => {
    originalActiveTextEditor = vscode.window.activeTextEditor;
    originalExecuteCommand = vscode.commands.executeCommand;
  });

  teardown(() => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: originalActiveTextEditor,
      configurable: true,
    });
    vscode.commands.executeCommand = originalExecuteCommand;
  });

  test("Should do nothing when arguments are missing", async () => {
    const editor = createSelectableEditor("ISA*00~");
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });

    const command = new SelectTextByPositionCommand();
    await command.command("1");

    assert.strictEqual(editor.selections.length, 0);
  });

  test("Should do nothing when there is no active editor", async () => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: undefined,
      configurable: true,
    });

    const command = new SelectTextByPositionCommand();
    await command.command("1", "3");
  });

  test("Should select the requested range and focus the first editor group", async () => {
    const editor = createSelectableEditor("ISA*00~");
    let executedCommand: string | undefined;
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });
    (vscode.commands as any).executeCommand = (command: string) => {
      executedCommand = command;
      return Promise.resolve(undefined);
    };

    const command = new SelectTextByPositionCommand();
    await command.command("1", "4");

    assert.strictEqual(editor.selections.length, 1);
    assert.deepStrictEqual(editor.selections[0], new vscode.Selection(new vscode.Position(0, 1), new vscode.Position(0, 4)));
    assert.strictEqual(executedCommand, constants.nativeCommands.focusFirstEditorGroup);
  });
});

function createSelectableEditor(content: string): vscode.TextEditor {
  const document = {
    positionAt: (offset: number) => {
      const safeOffset = Math.max(0, Math.min(offset, content.length));
      const lines = content.slice(0, safeOffset).split("\n");
      return new vscode.Position(lines.length - 1, lines[lines.length - 1].length);
    },
  } as vscode.TextDocument;

  return {
    document,
    selections: [],
  } as unknown as vscode.TextEditor;
}
