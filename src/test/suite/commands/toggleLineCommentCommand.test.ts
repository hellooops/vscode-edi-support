import * as assert from "assert";
import * as vscode from "vscode";

import { ToggleLineCommentCommand } from "../../../commands/toggleLineCommentCommand";

suite("ToggleLineCommentCommand Test Suite", () => {
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

  test("Should do nothing when there is no active editor", async () => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: undefined,
      configurable: true,
    });

    const command = new ToggleLineCommentCommand();

    await command.command();
  });

  test("Should insert line comments before first non-whitespace character", async () => {
    const editor = createMockEditor("ISA*00*~\n  GS*PO*1~", [new vscode.Selection(0, 0, 1, 0)]);
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor.editor,
      configurable: true,
    });

    const command = new ToggleLineCommentCommand();
    await command.command();

    assert.strictEqual(editor.getContent(), "// ISA*00*~\n  // GS*PO*1~");
  });

  test("Should remove existing comments and preserve indentation", async () => {
    const editor = createMockEditor("// ISA*00*~\n  // GS*PO*1~", [new vscode.Selection(0, 0, 1, 0)]);
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor.editor,
      configurable: true,
    });

    const command = new ToggleLineCommentCommand();
    await command.command();

    assert.strictEqual(editor.getContent(), "ISA*00*~\n  GS*PO*1~");
  });

  test("Should support multiple selections without touching other lines", async () => {
    const editor = createMockEditor(
      "ISA*00*~\nGS*PO*1~\nBEG*00*DS*PO1~",
      [new vscode.Selection(0, 0, 0, 0), new vscode.Selection(2, 0, 2, 0)],
    );
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor.editor,
      configurable: true,
    });

    const command = new ToggleLineCommentCommand();
    await command.command();

    assert.strictEqual(editor.getContent(), "// ISA*00*~\nGS*PO*1~\n// BEG*00*DS*PO1~");
  });
});

function createMockEditor(content: string, selections: vscode.Selection[]) {
  let currentContent = content;

  const positionAt = (offset: number): vscode.Position => {
    const safeOffset = Math.max(0, Math.min(offset, currentContent.length));
    const lines = currentContent.slice(0, safeOffset).split("\n");
    const line = lines.length - 1;
    const character = lines[lines.length - 1].length;
    return new vscode.Position(line, character);
  };

  const offsetAt = (position: vscode.Position): number => {
    const lines = currentContent.split("\n");
    let offset = 0;
    for (let i = 0; i < position.line; i++) {
      offset += (lines[i] ?? "").length + 1;
    }
    return offset + position.character;
  };

  const lineAt = (line: number | vscode.Position) => {
    const lineNumber = typeof line === "number" ? line : line.line;
    const lines = currentContent.split("\n");
    const text = lines[lineNumber] ?? "";
    const startOffset = lines
      .slice(0, lineNumber)
      .reduce((sum, item) => sum + item.length + 1, 0);
    const endOffset = startOffset + text.length;
    return {
      lineNumber,
      text,
      range: new vscode.Range(positionAt(startOffset), positionAt(endOffset)),
      rangeIncludingLineBreak: new vscode.Range(positionAt(startOffset), positionAt(Math.min(endOffset + 1, currentContent.length))),
      firstNonWhitespaceCharacterIndex: text.search(/\S|$/),
      isEmptyOrWhitespace: text.trim().length === 0,
    };
  };

  const document = {
    lineAt,
  } as vscode.TextDocument;

  const editor = {
    document,
    selections,
    edit: async (callback: (editBuilder: vscode.TextEditorEdit) => void) => {
      const operations: { type: "insert" | "delete"; start: number; end?: number; text?: string }[] = [];
      const editBuilder = {
        insert: (position: vscode.Position, text: string) => {
          operations.push({ type: "insert", start: offsetAt(position), text });
          return true;
        },
        delete: (range: vscode.Range) => {
          operations.push({ type: "delete", start: offsetAt(range.start), end: offsetAt(range.end) });
          return true;
        },
      } as unknown as vscode.TextEditorEdit;

      callback(editBuilder);

      operations
        .sort((left, right) => right.start - left.start)
        .forEach(operation => {
          if (operation.type === "insert") {
            currentContent = `${currentContent.slice(0, operation.start)}${operation.text}${currentContent.slice(operation.start)}`;
            return;
          }

          currentContent = `${currentContent.slice(0, operation.start)}${currentContent.slice(operation.end!)}`;
        });

      return true;
    },
  } as unknown as vscode.TextEditor;

  return {
    editor,
    getContent: () => currentContent,
  };
}
