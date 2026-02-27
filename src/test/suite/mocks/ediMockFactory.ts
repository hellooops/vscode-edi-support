import * as vscode from "vscode";

export class EdiMockFactory {
  static createMockDocument(content: string, languageId: string = "x12"): vscode.TextDocument {
    const fileName = `test.${languageId}`;
    return {
      uri: vscode.Uri.file(fileName),
      fileName,
      isUntitled: false,
      languageId,
      version: 1,
      isDirty: false,
      isClosed: false,
      eol: vscode.EndOfLine.LF,
      lineCount: content.split("\n").length,
      getText: () => content,
      getWordRangeAtPosition: () => undefined,
      offsetAt: (pos: vscode.Position) => 0,
      positionAt: (offset: number) => new vscode.Position(0, offset),
      validateRange: (r: vscode.Range) => r,
      validatePosition: (p: vscode.Position) => p,
      lineAt: () => ({
        text: content,
        range: new vscode.Range(0, 0, 0, content.length),
        isEmptyOrWhitespace: false,
        firstNonWhitespaceCharacterIndex: 0,
        rangeIncludingLineBreak: new vscode.Range(0, 0, 0, content.length),
        lineNumber: 0,
      }),
      getLineCount: () => content.split("\n").length,
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
