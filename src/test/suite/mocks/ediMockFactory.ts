import * as vscode from "vscode";

export class EdiMockFactory {
  static createMockDocument(content: string, languageId: string = "x12"): vscode.TextDocument {
    const lineOffsets: number[] = [0];
    for (let i = 0; i < content.length; i++) {
      if (content[i] === "\n") {
        lineOffsets.push(i + 1);
      }
    }

    const positionAt = (offset: number): vscode.Position => {
      const safeOffset = Math.max(0, Math.min(offset, content.length));
      let line = 0;
      for (let i = 0; i < lineOffsets.length; i++) {
        if (i + 1 >= lineOffsets.length || lineOffsets[i + 1] > safeOffset) {
          line = i;
          break;
        }
      }

      return new vscode.Position(line, safeOffset - lineOffsets[line]);
    };

    const offsetAt = (position: vscode.Position): number => {
      const lineOffset = lineOffsets[position.line] ?? content.length;
      return Math.max(0, Math.min(lineOffset + position.character, content.length));
    };

    return {
      uri: vscode.Uri.file(`test.${languageId}`),
      fileName: `test.${languageId}`,
      isUntitled: false,
      languageId,
      version: 1,
      isDirty: false,
      isClosed: false,
      eol: vscode.EndOfLine.LF,
      lineCount: lineOffsets.length,
      getText: () => content,
      getWordRangeAtPosition: () => undefined,
      offsetAt,
      positionAt,
      validateRange: (r: vscode.Range) => r,
      validatePosition: (p: vscode.Position) => p,
      lineAt: (line: number | vscode.Position) => {
        const lineNumber = typeof line === "number" ? line : line.line;
        const start = lineOffsets[lineNumber] ?? content.length;
        const end = lineNumber + 1 < lineOffsets.length ? lineOffsets[lineNumber + 1] - 1 : content.length;
        const text = content.substring(start, end);
        return {
          lineNumber,
          text,
          range: new vscode.Range(positionAt(start), positionAt(end)),
          rangeIncludingLineBreak: new vscode.Range(positionAt(start), positionAt(Math.min(end + 1, content.length))),
          firstNonWhitespaceCharacterIndex: text.search(/\S|$/),
          isEmptyOrWhitespace: text.trim().length === 0,
        };
      },
      save: async () => true,
    } as vscode.TextDocument;
  }

  static createMockCancellationToken(): vscode.CancellationToken {
    return {
      isCancellationRequested: false,
      onCancellationRequested: {
        event: () => {},
      },
    } as unknown as vscode.CancellationToken;
  }

  static createMockConfiguration(config: Record<string, any>): vscode.WorkspaceConfiguration {
    return {
      get: (key: string) => config[key],
      has: (key: string) => key in config,
      inspect: (key: string) => undefined,
      update: async () => {},
    } as vscode.WorkspaceConfiguration;
  }

  static createMockRange(content: string): vscode.Range {
    const lines = content.split("\n");
    const lineCount = lines.length;
    const lastLineLength = lines[lineCount - 1].length;
    return new vscode.Range(0, 0, lineCount - 1, lastLineLength);
  }
}
