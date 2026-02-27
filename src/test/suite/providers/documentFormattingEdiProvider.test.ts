import * as assert from "assert";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { DocumentFormattingEditEdiProvider } from "../../../providers/documentFormattingEdiProvider";
import { EdiMockFactory } from "../mocks/ediMockFactory";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiType } from "../../../parser/entities";

suite("DocumentFormattingEditEdiProvider Test Suite", () => {
  let provider: DocumentFormattingEditEdiProvider;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalRegisterDocumentFormattingEditProvider: typeof vscode.languages.registerDocumentFormattingEditProvider;
  const getFormattingFileContent = (fileName: string): string => {
    const filePath = path.resolve(__dirname, "../../../../src/test/suite/test-files/formatting", fileName);
    return fs.readFileSync(filePath, "utf8");
  };
  const normalizeLineEndings = (value: string): string => value.replace(/\r\n/g, "\n");

  setup(() => {
    provider = new DocumentFormattingEditEdiProvider();
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalRegisterDocumentFormattingEditProvider = vscode.languages.registerDocumentFormattingEditProvider;
  });

  teardown(() => {
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    vscode.languages.registerDocumentFormattingEditProvider = originalRegisterDocumentFormattingEditProvider;
  });

  suite("provideDocumentFormattingEdits", () => {
    test("Should return undefined when parser does not exist", async () => {
      (EdiUtils as any).getEdiParser = () => ({
        parser: undefined,
        ediType: EdiType.UNKNOWN,
      });

      const documentContent = "ISA*00*~";
      const document = EdiMockFactory.createMockDocument(documentContent, "x12");
      const token = EdiMockFactory.createMockCancellationToken();
      const options: vscode.FormattingOptions = { tabSize: 2, insertSpaces: true };

      const result = await provider.provideDocumentFormattingEdits(document, options, token);

      assert.strictEqual(result, undefined);
    });

    test("Should return undefined when parser parse result is empty", async () => {
      (EdiUtils as any).getEdiParser = () => ({
        parser: {
          parse: async () => undefined,
        },
        ediType: EdiType.X12,
      });

      const documentContent = "ISA*00*~";
      const document = EdiMockFactory.createMockDocument(documentContent, "x12");
      const token = EdiMockFactory.createMockCancellationToken();
      const options: vscode.FormattingOptions = { tabSize: 2, insertSpaces: true };

      const result = await provider.provideDocumentFormattingEdits(document, options, token);

      assert.strictEqual(result, undefined);
    });

    test("Should return a full document formatting text edit", async () => {
      const formattedContent = "ISA*00*~\nGS*PO*~";
      (EdiUtils as any).getEdiParser = () => ({
        parser: {
          parse: async () => ({
            getFormatString: () => formattedContent,
          }),
        },
        ediType: EdiType.X12,
      });

      const documentContent = "ISA*00*~GS*PO*~";
      const document = EdiMockFactory.createMockDocument(documentContent, "x12");
      const token = EdiMockFactory.createMockCancellationToken();
      const options: vscode.FormattingOptions = { tabSize: 2, insertSpaces: true };

      const result = await provider.provideDocumentFormattingEdits(document, options, token);

      assert.ok(result);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].newText, formattedContent);
      assert.strictEqual(result[0].range.start.line, 0);
      assert.strictEqual(result[0].range.start.character, 0);
      assert.strictEqual(result[0].range.end.line, 0);
      assert.strictEqual(result[0].range.end.character, documentContent.length);
    });

    test("Should return empty array when formatted content is unchanged", async () => {
      const documentContent = "ISA*00*~\nGS*PO*~";
      (EdiUtils as any).getEdiParser = () => ({
        parser: {
          parse: async () => ({
            getFormatString: () => documentContent,
          }),
        },
        ediType: EdiType.X12,
      });

      const document = EdiMockFactory.createMockDocument(documentContent, "x12");
      const token = EdiMockFactory.createMockCancellationToken();
      const options: vscode.FormattingOptions = { tabSize: 2, insertSpaces: true };

      const result = await provider.provideDocumentFormattingEdits(document, options, token);

      assert.ok(result);
      assert.strictEqual(result.length, 0);
    });

    test("Should format complete X12 document with loop from docs", async () => {
      (EdiUtils as any).getEdiParser = originalGetEdiParser;

      const documentContent = getFormattingFileContent("x12.minify.edi");
      const expectedContent = getFormattingFileContent("x12.prettify.edi");
      const document = EdiMockFactory.createMockDocument(documentContent, "x12");
      const token = EdiMockFactory.createMockCancellationToken();
      const options: vscode.FormattingOptions = { tabSize: 2, insertSpaces: true };

      const result = await provider.provideDocumentFormattingEdits(document, options, token);

      assert.notStrictEqual(result, undefined);
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 1);
      assert.strictEqual(normalizeLineEndings(result[0].newText), normalizeLineEndings(expectedContent));
    });

    test("Should format complete EDIFACT document from docs", async () => {
      (EdiUtils as any).getEdiParser = originalGetEdiParser;

      const documentContent = getFormattingFileContent("edifact.minify.edi");
      const expectedContent = getFormattingFileContent("edifact.prettify.edi");
      const document = EdiMockFactory.createMockDocument(documentContent, "edifact");
      const token = EdiMockFactory.createMockCancellationToken();
      const options: vscode.FormattingOptions = { tabSize: 2, insertSpaces: true };

      const result = await provider.provideDocumentFormattingEdits(document, options, token);

      assert.notStrictEqual(result, undefined);
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 1);
      assert.strictEqual(normalizeLineEndings(result[0].newText), normalizeLineEndings(expectedContent));
    });

    test("Should format complete VDA document from docs", async () => {
      (EdiUtils as any).getEdiParser = originalGetEdiParser;

      const documentContent = getFormattingFileContent("vda.minify.edi");
      const expectedContent = getFormattingFileContent("vda.prettify.edi");
      const document = EdiMockFactory.createMockDocument(documentContent, "vda");
      const token = EdiMockFactory.createMockCancellationToken();
      const options: vscode.FormattingOptions = { tabSize: 2, insertSpaces: true };

      const result = await provider.provideDocumentFormattingEdits(document, options, token);

      assert.notStrictEqual(result, undefined);
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 1);
      assert.strictEqual(normalizeLineEndings(result[0].newText), normalizeLineEndings(expectedContent));
    });
  });

  suite("registerFunctions", () => {
    test("Should register formatting providers for x12, edifact and vda", () => {
      const registeredLanguages: string[] = [];
      vscode.languages.registerDocumentFormattingEditProvider = (selector: vscode.DocumentSelector, formattingProvider: vscode.DocumentFormattingEditProvider): vscode.Disposable => {
        const language = (selector as vscode.DocumentFilter).language;
        if (language) {
          registeredLanguages.push(language);
        }
        assert.strictEqual(formattingProvider, provider);
        return { dispose: () => {} };
      };

      const result = provider.registerFunctions();

      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(registeredLanguages, [EdiType.X12, EdiType.EDIFACT, EdiType.VDA]);
    });
  });
});
