import * as assert from "assert";
import * as vscode from "vscode";

import { PrettifyDocumentCommand } from "../../../commands/prettifyDocumentCommand";
import { EdiUtils } from "../../../utils/ediUtils";

suite("PrettifyDocumentCommand Test Suite", () => {
  let originalActiveTextEditor: typeof vscode.window.activeTextEditor;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;

  setup(() => {
    originalActiveTextEditor = vscode.window.activeTextEditor;
    originalGetEdiParser = EdiUtils.getEdiParser;
  });

  teardown(() => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: originalActiveTextEditor,
      configurable: true,
    });
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
  });

  test("Should do nothing when there is no active editor", async () => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: undefined,
      configurable: true,
    });

    const command = new PrettifyDocumentCommand();
    await command.command();
  });

  test("Should do nothing when parser is unavailable or parse returns undefined", async () => {
    const editor = createEditableEditor("ISA~GS~");
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor.editor,
      configurable: true,
    });

    const command = new PrettifyDocumentCommand();

    (EdiUtils as any).getEdiParser = () => ({ parser: undefined });
    await command.command();
    assert.strictEqual(editor.getContent(), "ISA~GS~");

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => undefined,
      },
    });
    await command.command();
    assert.strictEqual(editor.getContent(), "ISA~GS~");
  });

  test("Should replace the document with formatted content", async () => {
    const editor = createEditableEditor("ISA~GS~");
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor.editor,
      configurable: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getFormatString: () => "ISA~\nGS~\n",
        }),
      },
    });

    const command = new PrettifyDocumentCommand();
    await command.command();

    assert.strictEqual(editor.getContent(), "ISA~\nGS~\n");
  });
});

function createEditableEditor(content: string) {
  let currentContent = content;

  const document = {
    getText: () => currentContent,
    positionAt: (offset: number) => {
      const safeOffset = Math.max(0, Math.min(offset, currentContent.length));
      const lines = currentContent.slice(0, safeOffset).split("\n");
      return new vscode.Position(lines.length - 1, lines[lines.length - 1].length);
    },
  } as vscode.TextDocument;

  const offsetAt = (position: vscode.Position) => {
    const lines = currentContent.split("\n");
    let offset = 0;
    for (let i = 0; i < position.line; i++) {
      offset += (lines[i] ?? "").length + 1;
    }
    return offset + position.character;
  };

  const editor = {
    document,
    options: {},
    edit: async (callback: (editBuilder: vscode.TextEditorEdit) => void) => {
      const editBuilder = {
        replace: (range: vscode.Range, text: string) => {
          const start = offsetAt(range.start);
          const end = offsetAt(range.end);
          currentContent = `${currentContent.slice(0, start)}${text}${currentContent.slice(end)}`;
          return true;
        },
      } as unknown as vscode.TextEditorEdit;

      callback(editBuilder);
      return true;
    },
  } as unknown as vscode.TextEditor;

  return {
    editor,
    getContent: () => currentContent,
  };
}
