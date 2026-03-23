import * as assert from "assert";
import * as vscode from "vscode";
import { EdiDiagnosticsMgr } from "../../../diagnostics/ediDiagnostics";
import { EdiMockFactory } from "../mocks/ediMockFactory";
import { DiagnosticErrorSeverity, DiagnosticErrors, EdiElement, EdiSegment, ElementType, EdiType, type DiagnoscticsContext, type DiagnosticError } from "../../../parser/entities";
import { EdiUtils } from "../../../utils/ediUtils";
import * as constants from "../../../constants";

suite("EdiDiagnosticsMgr Test Suite", () => {
  let diagnosticsMgr: EdiDiagnosticsMgr;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalGetConfiguration: typeof vscode.workspace.getConfiguration;
  let originalActiveTextEditor: typeof vscode.window.activeTextEditor;
  let originalCreateDiagnosticCollection: typeof vscode.languages.createDiagnosticCollection;
  let originalOnDidChangeActiveTextEditor: typeof vscode.window.onDidChangeActiveTextEditor;
  let originalOnDidChangeTextDocument: typeof vscode.workspace.onDidChangeTextDocument;
  let originalOnDidCloseTextDocument: typeof vscode.workspace.onDidCloseTextDocument;
  let originalOnDidChangeConfiguration: typeof vscode.workspace.onDidChangeConfiguration;
  let originalClearCache: typeof EdiUtils.clearCache;

  setup(() => {
    diagnosticsMgr = new EdiDiagnosticsMgr();
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalGetConfiguration = vscode.workspace.getConfiguration;
    originalActiveTextEditor = vscode.window.activeTextEditor;
    originalCreateDiagnosticCollection = vscode.languages.createDiagnosticCollection;
    originalOnDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor;
    originalOnDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument;
    originalOnDidCloseTextDocument = vscode.workspace.onDidCloseTextDocument;
    originalOnDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration;
    originalClearCache = EdiUtils.clearCache;
  });

  teardown(() => {
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    vscode.workspace.getConfiguration = originalGetConfiguration;
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: originalActiveTextEditor,
      configurable: true,
    });
    vscode.languages.createDiagnosticCollection = originalCreateDiagnosticCollection;
    (vscode.window as any).onDidChangeActiveTextEditor = originalOnDidChangeActiveTextEditor;
    (vscode.workspace as any).onDidChangeTextDocument = originalOnDidChangeTextDocument;
    (vscode.workspace as any).onDidCloseTextDocument = originalOnDidCloseTextDocument;
    (vscode.workspace as any).onDidChangeConfiguration = originalOnDidChangeConfiguration;
    EdiUtils.clearCache = originalClearCache;
    EdiUtils.clearCache();
  });

  suite("ediDiagnosticsToVscodeDiagnostics", () => {
    test("Should map ERROR severity and default range when no segment/element provided", () => {
      const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
      const error: DiagnosticError = {
        error: "mock error",
        code: "TEST_ERROR",
        severity: DiagnosticErrorSeverity.ERROR,
        others: { reason: "for-test" },
      };

      const result = diagnosticsMgr.ediDiagnosticsToVscodeDiagnostics(document, error);

      assert.strictEqual(result.message, "mock error");
      assert.strictEqual(result.code, "TEST_ERROR");
      assert.strictEqual(result.source, "edi-support-source");
      assert.strictEqual(result.severity, vscode.DiagnosticSeverity.Error);
      assert.strictEqual(result.range.start.line, 0);
      assert.strictEqual(result.range.start.character, 0);
      assert.strictEqual(result.range.end.line, 0);
      assert.strictEqual(result.range.end.character, 0);
      assert.deepStrictEqual(result.others, { reason: "for-test" });
    });

    test("Should use segment id range when errorSegment is provided", () => {
      const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
      const segment = new EdiSegment("ISA", 0, 6, 7, "~");
      const error: DiagnosticError = {
        error: "segment error",
        code: "SEGMENT_ERROR",
        severity: DiagnosticErrorSeverity.WARNING,
        errorSegment: segment,
      };

      const result = diagnosticsMgr.ediDiagnosticsToVscodeDiagnostics(document, error);

      assert.strictEqual(result.severity, vscode.DiagnosticSeverity.Warning);
      assert.strictEqual(result.range.start.line, 0);
      assert.strictEqual(result.range.start.character, 0);
      assert.strictEqual(result.range.end.line, 0);
      assert.strictEqual(result.range.end.character, 3);
    });

    test("Should use element range when errorElement is provided", () => {
      const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
      const segment = new EdiSegment("ISA", 0, 6, 7, "~");
      const element = new EdiElement(segment, ElementType.dataElement, 3, 5, "*", "ISA", 0, "01");
      const error: DiagnosticError = {
        error: "element error",
        code: "ELEMENT_ERROR",
        severity: DiagnosticErrorSeverity.ERROR,
        errorElement: element,
      };

      const result = diagnosticsMgr.ediDiagnosticsToVscodeDiagnostics(document, error);

      assert.strictEqual(result.range.start.line, 0);
      assert.strictEqual(result.range.start.character, 3);
      assert.strictEqual(result.range.end.line, 0);
      assert.strictEqual(result.range.end.character, 6);
    });

    test("Should throw when severity is unsupported", () => {
      const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
      const error: DiagnosticError = {
        error: "invalid severity",
        code: "INVALID_SEVERITY",
        severity: 99 as DiagnosticErrorSeverity,
      };

      assert.throws(
        () => diagnosticsMgr.ediDiagnosticsToVscodeDiagnostics(document, error),
        /Unsupported DiagnosticErrorSeverity/,
      );
    });
  });

  suite("refreshDiagnostics", () => {
    test("Should return immediately for unsupported language", async () => {
      let getParserCalled = false;
      (EdiUtils as any).getEdiParser = () => {
        getParserCalled = true;
        return {
          parser: undefined,
          ediType: EdiType.UNKNOWN,
        };
      };

      let setCalled = false;
      const diagnosticsCollection = {
        set: () => {
          setCalled = true;
        },
      } as unknown as vscode.DiagnosticCollection;

      const document = EdiMockFactory.createMockDocument("plain text", "plaintext");
      await diagnosticsMgr.refreshDiagnostics(document, diagnosticsCollection);

      assert.strictEqual(getParserCalled, false);
      assert.strictEqual(setCalled, false);
    });

    test("Should return when parser is undefined", async () => {
      (EdiUtils as any).getEdiParser = () => ({
        parser: undefined,
        ediType: EdiType.X12,
      });

      let setCalled = false;
      const diagnosticsCollection = {
        set: () => {
          setCalled = true;
        },
      } as unknown as vscode.DiagnosticCollection;

      const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
      await diagnosticsMgr.refreshDiagnostics(document, diagnosticsCollection);

      assert.strictEqual(setCalled, false);
    });

    test("Should return when ediType is UNKNOWN", async () => {
      (EdiUtils as any).getEdiParser = () => ({
        parser: {
          parse: async () => ({
            standardOptions: {},
            getErrors: () => [],
          }),
        },
        ediType: EdiType.UNKNOWN,
      });

      let setCalled = false;
      const diagnosticsCollection = {
        set: () => {
          setCalled = true;
        },
      } as unknown as vscode.DiagnosticCollection;

      const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
      await diagnosticsMgr.refreshDiagnostics(document, diagnosticsCollection);

      assert.strictEqual(setCalled, false);
    });

    test("Should parse document, map diagnostics and set collection", async () => {
      const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
      const diagnosticErrors: DiagnosticError[] = [
        {
          error: "first error",
          code: "E1",
          severity: DiagnosticErrorSeverity.ERROR,
        },
        {
          error: "second warning",
          code: "W1",
          severity: DiagnosticErrorSeverity.WARNING,
        },
      ];

      let capturedContext: DiagnoscticsContext | undefined;
      (EdiUtils as any).getEdiParser = () => ({
        parser: {
          parse: async () => ({
            standardOptions: {},
            getErrors: (context: DiagnoscticsContext) => {
              capturedContext = context;
              return diagnosticErrors;
            },
          }),
        },
        ediType: EdiType.X12,
      });

      let setUri: vscode.Uri | undefined;
      let setDiagnostics: readonly vscode.Diagnostic[] | undefined;
      const diagnosticsCollection = {
        set: (uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]) => {
          setUri = uri;
          setDiagnostics = diagnostics;
        },
      } as unknown as vscode.DiagnosticCollection;

      await diagnosticsMgr.refreshDiagnostics(document, diagnosticsCollection);

      assert.strictEqual(setUri?.toString(), document.uri.toString());
      assert.ok(setDiagnostics);
      assert.strictEqual(setDiagnostics!.length, 2);
      assert.strictEqual(setDiagnostics![0].severity, vscode.DiagnosticSeverity.Error);
      assert.strictEqual(setDiagnostics![1].severity, vscode.DiagnosticSeverity.Warning);
      assert.strictEqual(setDiagnostics![0].message, "first error");
      assert.strictEqual(setDiagnostics![1].message, "second warning");

      assert.ok(capturedContext);
      assert.strictEqual(capturedContext!.ediType, EdiType.X12);
      assert.strictEqual(capturedContext!.ignoreRequired, false);
    });

    test("Should pass ignoreRequired=true for VDA diagnostics context", async () => {
      const document = EdiMockFactory.createMockDocument("51102 ", "vda");

      let capturedContext: DiagnoscticsContext | undefined;
      (EdiUtils as any).getEdiParser = () => ({
        parser: {
          parse: async () => ({
            standardOptions: {},
            getErrors: (context: DiagnoscticsContext) => {
              capturedContext = context;
              return [];
            },
          }),
        },
        ediType: EdiType.VDA,
      });

      const diagnosticsCollection = {
        set: () => {},
      } as unknown as vscode.DiagnosticCollection;

      await diagnosticsMgr.refreshDiagnostics(document, diagnosticsCollection);

      assert.ok(capturedContext);
      assert.strictEqual(capturedContext!.ediType, EdiType.VDA);
      assert.strictEqual(capturedContext!.ignoreRequired, true);
    });

    test("Should resolve EDIFACT control-segment qualifier diagnostics to the service scope", async () => {
      vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({});
      const document = EdiMockFactory.createMockDocument(
        "UNB+UNOA:2+JLR:ZZ+TEST:ZZ+030325:0725+242++DELFOR'\nUNH+1+DELFOR:D:97A:UN'\nBGM+241+20020102084517+5'\nDTM+51:230101:101'\nUNT+4+1'\nUNZ+1+242'",
        constants.ediDocument.edifact.name,
      );

      let capturedDiagnostics: readonly vscode.Diagnostic[] = [];
      const diagnosticsCollection = {
        set: (_uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]) => {
          capturedDiagnostics = diagnostics;
        },
      } as unknown as vscode.DiagnosticCollection;

      await diagnosticsMgr.refreshDiagnostics(document, diagnosticsCollection);

      const qualifierDiagnostics = capturedDiagnostics
        .filter(diagnostic => diagnostic.code === DiagnosticErrors.QUALIFIER_INVALID_CODE)
        .map(diagnostic => diagnostic as any);

      assert.strictEqual(qualifierDiagnostics.length, 2);
      qualifierDiagnostics.forEach(diagnostic => {
        assert.strictEqual(diagnostic.others.release, "_service");
        assert.strictEqual(diagnostic.others.qualifier, "Identification code qualifier");
        assert.strictEqual(diagnostic.others.code, "ZZ");
      });
    });

    test("Should honor custom EDIFACT qualifier overrides for control segments", async () => {
      vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
        [constants.configuration.customSchemas]: {
          edifact: {
            _service: {
              qualifiers: {
                "Identification code qualifier": {
                  ZZ: "<Custom code>",
                },
              },
            },
          },
        },
      });
      const document = EdiMockFactory.createMockDocument(
        "UNB+UNOA:2+JLR:ZZ+TEST:ZZ+030325:0725+242++DELFOR'\nUNH+1+DELFOR:D:97A:UN'\nBGM+241+20020102084517+5'\nDTM+51:230101:101'\nUNT+4+1'\nUNZ+1+242'",
        constants.ediDocument.edifact.name,
      );

      let capturedDiagnostics: readonly vscode.Diagnostic[] = [];
      const diagnosticsCollection = {
        set: (_uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]) => {
          capturedDiagnostics = diagnostics;
        },
      } as unknown as vscode.DiagnosticCollection;

      await diagnosticsMgr.refreshDiagnostics(document, diagnosticsCollection);

      const qualifierDiagnostics = capturedDiagnostics.filter(diagnostic => diagnostic.code === DiagnosticErrors.QUALIFIER_INVALID_CODE);
      assert.deepStrictEqual(qualifierDiagnostics, []);
    });

    test("Should keep supporting legacy EDIFACT message-release qualifier overrides for control segments", async () => {
      vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
        [constants.configuration.customSchemas]: {
          edifact: {
            D97A: {
              qualifiers: {
                "Identification code qualifier": {
                  ZZ: "<Custom code>",
                },
              },
            },
          },
        },
      });
      const document = EdiMockFactory.createMockDocument(
        "UNB+UNOA:2+JLR:ZZ+TEST:ZZ+030325:0725+242++DELFOR'\nUNH+1+DELFOR:D:97A:UN'\nBGM+241+20020102084517+5'\nDTM+51:230101:101'\nUNT+4+1'\nUNZ+1+242'",
        constants.ediDocument.edifact.name,
      );

      let capturedDiagnostics: readonly vscode.Diagnostic[] = [];
      const diagnosticsCollection = {
        set: (_uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]) => {
          capturedDiagnostics = diagnostics;
        },
      } as unknown as vscode.DiagnosticCollection;

      await diagnosticsMgr.refreshDiagnostics(document, diagnosticsCollection);

      const qualifierDiagnostics = capturedDiagnostics.filter(diagnostic => diagnostic.code === DiagnosticErrors.QUALIFIER_INVALID_CODE);
      assert.deepStrictEqual(qualifierDiagnostics, []);
    });
  });

  suite("registerDiagnostics", () => {
    test("Should create diagnostic collection, refresh active editor and wire listeners", async () => {
      const activeDocument = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
      const changedDocument = EdiMockFactory.createMockDocument("GS*PO*1~", "x12");
      const closedDocument = EdiMockFactory.createMockDocument("ST*850*1~", "x12");
      const diagnosticCollection = {
        delete: (uri: vscode.Uri) => {
          deletedUris.push(uri.toString());
        },
      } as unknown as vscode.DiagnosticCollection;
      const deletedUris: string[] = [];
      const refreshedDocuments: string[] = [];
      let activeEditorListener: ((editor: vscode.TextEditor | undefined) => unknown) | undefined;
      let textDocumentListener: ((event: vscode.TextDocumentChangeEvent) => unknown) | undefined;
      let closeDocumentListener: ((document: vscode.TextDocument) => unknown) | undefined;
      let configListener: ((event: vscode.ConfigurationChangeEvent) => unknown) | undefined;
      let collectionName: string | undefined;
      let clearCacheCount = 0;

      Object.defineProperty(vscode.window, "activeTextEditor", {
        value: { document: activeDocument },
        configurable: true,
      });
      vscode.languages.createDiagnosticCollection = (name?: string) => {
        collectionName = name;
        return diagnosticCollection;
      };
      (vscode.window as any).onDidChangeActiveTextEditor = (listener: (editor: vscode.TextEditor | undefined) => unknown) => {
        activeEditorListener = listener;
        return new vscode.Disposable(() => {});
      };
      (vscode.workspace as any).onDidChangeTextDocument = (listener: (event: vscode.TextDocumentChangeEvent) => unknown) => {
        textDocumentListener = listener;
        return new vscode.Disposable(() => {});
      };
      (vscode.workspace as any).onDidCloseTextDocument = (listener: (document: vscode.TextDocument) => unknown) => {
        closeDocumentListener = listener;
        return new vscode.Disposable(() => {});
      };
      (vscode.workspace as any).onDidChangeConfiguration = (listener: (event: vscode.ConfigurationChangeEvent) => unknown) => {
        configListener = listener;
        return new vscode.Disposable(() => {});
      };
      diagnosticsMgr.refreshDiagnostics = async (document: vscode.TextDocument) => {
        refreshedDocuments.push(document.uri.toString());
      };
      EdiUtils.clearCache = () => {
        clearCacheCount++;
      };

      const disposables = diagnosticsMgr.registerDiagnostics();

      assert.strictEqual(collectionName, constants.diagnostic.diagnosticCollectionId);
      assert.strictEqual(disposables.length, 5);
      assert.deepStrictEqual(refreshedDocuments, [activeDocument.uri.toString()]);
      assert.ok(activeEditorListener);
      assert.ok(textDocumentListener);
      assert.ok(closeDocumentListener);
      assert.ok(configListener);

      await activeEditorListener!({ document: changedDocument } as vscode.TextEditor);
      await activeEditorListener!(undefined);
      await textDocumentListener!({ document: changedDocument } as vscode.TextDocumentChangeEvent);
      closeDocumentListener!({
        ...closedDocument,
        isClosed: false,
      } as vscode.TextDocument);
      closeDocumentListener!({
        ...closedDocument,
        isClosed: true,
      } as vscode.TextDocument);
      await configListener!({} as vscode.ConfigurationChangeEvent);

      assert.deepStrictEqual(refreshedDocuments, [
        activeDocument.uri.toString(),
        changedDocument.uri.toString(),
        changedDocument.uri.toString(),
        activeDocument.uri.toString(),
      ]);
      assert.deepStrictEqual(deletedUris, [closedDocument.uri.toString()]);
      assert.strictEqual(clearCacheCount, 1);
    });

    test("Should skip initial and configuration refresh when there is no active editor", async () => {
      let configListener: ((event: vscode.ConfigurationChangeEvent) => unknown) | undefined;
      Object.defineProperty(vscode.window, "activeTextEditor", {
        value: undefined,
        configurable: true,
      });
      vscode.languages.createDiagnosticCollection = () => ({
        delete: () => {},
      }) as unknown as vscode.DiagnosticCollection;
      (vscode.window as any).onDidChangeActiveTextEditor = () => new vscode.Disposable(() => {});
      (vscode.workspace as any).onDidChangeTextDocument = () => new vscode.Disposable(() => {});
      (vscode.workspace as any).onDidCloseTextDocument = () => new vscode.Disposable(() => {});
      (vscode.workspace as any).onDidChangeConfiguration = (listener: (event: vscode.ConfigurationChangeEvent) => unknown) => {
        configListener = listener;
        return new vscode.Disposable(() => {});
      };

      let refreshCount = 0;
      let clearCacheCount = 0;
      diagnosticsMgr.refreshDiagnostics = async () => {
        refreshCount++;
      };
      EdiUtils.clearCache = () => {
        clearCacheCount++;
      };

      diagnosticsMgr.registerDiagnostics();
      await configListener!({} as vscode.ConfigurationChangeEvent);

      assert.strictEqual(refreshCount, 0);
      assert.strictEqual(clearCacheCount, 1);
    });
  });
});
