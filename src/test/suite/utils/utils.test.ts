import * as assert from "assert";
import * as vscode from "vscode";
import { EdiType } from "../../../parser/entities";
import { SchemaViewerUtils } from "../../../utils/schemaViewerUtils";
import Utils, { StringBuilder } from "../../../utils/utils";
import VscodeUtils from "../../../utils/vscodeUtils";

suite("Utils Test Suite", () => {
  test("yyMMddFormat should format valid date", () => {
    assert.strictEqual(Utils.yyMMddFormat("140407"), "14-04-07");
  });

  test("yyMMddFormat should return original value when invalid", () => {
    assert.strictEqual(Utils.yyMMddFormat(""), "");
    assert.strictEqual(Utils.yyMMddFormat("1404"), "1404");
  });

  test("HHmmFormat should format HHmm and HHmmss", () => {
    assert.strictEqual(Utils.HHmmFormat("0910"), "09:10");
    assert.strictEqual(Utils.HHmmFormat("091035"), "09:10:35");
  });

  test("HHmmFormat should return original value when too short", () => {
    assert.strictEqual(Utils.HHmmFormat("09"), "09");
  });

  test("toString should keep null and undefined", () => {
    assert.strictEqual(Utils.toString(null), null);
    assert.strictEqual(Utils.toString(undefined), undefined);
  });

  test("toString should stringify primitives", () => {
    assert.strictEqual(Utils.toString(123), "123");
    assert.strictEqual(Utils.toString(true), "true");
  });

  test("formatString should replace placeholders", () => {
    assert.strictEqual(Utils.formatString("Hello {0}, {1}!", "EDI", "World"), "Hello EDI, World!");
  });

  test("formatString should fallback missing placeholders to empty string", () => {
    assert.strictEqual(Utils.formatString("{0}-{1}-{2}", "A", "B"), "A-B-");
  });

  test("getStringAsInt should parse numbers and strings", () => {
    assert.strictEqual(Utils.getStringAsInt(3.9), 3);
    assert.strictEqual(Utils.getStringAsInt("42"), 42);
    assert.strictEqual(Utils.getStringAsInt("42abc"), 42);
  });

  test("getStringAsInt should support default and invalid inputs", () => {
    assert.strictEqual(Utils.getStringAsInt(undefined, 8), 8);
    assert.strictEqual(Utils.getStringAsInt("", 9), 9);
    assert.strictEqual(Utils.getStringAsInt("abc"), undefined);
  });

  test("getValueAsBoolean should parse common string values", () => {
    assert.strictEqual(Utils.getValueAsBoolean("true"), true);
    assert.strictEqual(Utils.getValueAsBoolean("1"), true);
    assert.strictEqual(Utils.getValueAsBoolean("on"), true);
    assert.strictEqual(Utils.getValueAsBoolean("false"), false);
  });

  test("getValueAsBoolean should support default and truthy values", () => {
    assert.strictEqual(Utils.getValueAsBoolean(undefined, true), true);
    assert.strictEqual(Utils.getValueAsBoolean("", false), false);
    assert.strictEqual(Utils.getValueAsBoolean(5), true);
    assert.strictEqual(Utils.getValueAsBoolean(0), false);
  });

  test("randomId should return non-empty ids", () => {
    const id1 = Utils.randomId();
    const id2 = Utils.randomId();

    assert.strictEqual(typeof id1, "string");
    assert.strictEqual(id1.length > 0, true);
    assert.strictEqual(id1 === id2, false);
  });
});

suite("StringBuilder Test Suite", () => {
  test("append should support chaining and toString should join values", () => {
    const sb = new StringBuilder();
    const result = sb.append("EDI").append("-").append("X12").toString();

    assert.strictEqual(result, "EDI-X12");
  });
});

suite("SchemaViewerUtils Test Suite", () => {
  test("Should build segment and element schema URLs when all parts are present", () => {
    assert.strictEqual(
      SchemaViewerUtils.getSegmentUrl(EdiType.X12, "00401", "ISA"),
      "https://www.kasoftware.com/schema/edi/x12/00401/segments/ISA/",
    );
    assert.strictEqual(
      SchemaViewerUtils.getElementUrl(EdiType.EDIFACT, "D97A", "UNB", "S002"),
      "https://www.kasoftware.com/schema/edi/edifact/D97A/elements/UNB/S002/",
    );
  });

  test("Should fall back to index URL when segment or element information is missing", () => {
    const indexUrl = SchemaViewerUtils.getIndexUrl();

    assert.strictEqual(SchemaViewerUtils.getSegmentUrl(EdiType.X12, null, "ISA"), indexUrl);
    assert.strictEqual(SchemaViewerUtils.getSegmentUrl(EdiType.X12, "00401", null), indexUrl);
    assert.strictEqual(SchemaViewerUtils.getElementUrl(EdiType.X12, "00401", "REF", undefined), indexUrl);
  });
});

suite("VscodeUtils Test Suite", () => {
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

  test("refreshEditor should do nothing when there is no active editor", async () => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: undefined,
      configurable: true,
    });

    await VscodeUtils.refreshEditor();
  });

  test("refreshEditor should replace the full document with its current content", async () => {
    const content = "ISA*00*~\nGS*PO*1~";
    let replaceArgs: { range: vscode.Range; text: string } | undefined;
    const document = {
      getText: () => content,
      positionAt: (offset: number) => {
        const safeOffset = Math.max(0, Math.min(offset, content.length));
        const lines = content.slice(0, safeOffset).split("\n");
        return new vscode.Position(lines.length - 1, lines[lines.length - 1].length);
      },
    } as vscode.TextDocument;
    const editor = {
      document,
      edit: async (callback: (builder: vscode.TextEditorEdit) => void) => {
        const builder = {
          replace: (range: vscode.Range, text: string) => {
            replaceArgs = { range, text };
            return true;
          },
        } as unknown as vscode.TextEditorEdit;
        callback(builder);
        return true;
      },
    } as unknown as vscode.TextEditor;

    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: editor,
      configurable: true,
    });

    await VscodeUtils.refreshEditor();

    assert.ok(replaceArgs);
    assert.strictEqual(replaceArgs!.text, content);
    assert.strictEqual(replaceArgs!.range.start.line, 0);
    assert.strictEqual(replaceArgs!.range.start.character, 0);
    assert.strictEqual(replaceArgs!.range.end.line, 1);
    assert.strictEqual(replaceArgs!.range.end.character, 8);
  });
});
