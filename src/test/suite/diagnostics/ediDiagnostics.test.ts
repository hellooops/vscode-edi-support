import * as assert from "assert";
import * as vscode from "vscode";
import { EdiDiagnosticsMgr } from "../../../diagnostics/ediDiagnostics";
import { EdiMockFactory } from "../mocks/ediMockFactory";
import { DiagnosticErrorSeverity, EdiElement, EdiSegment, ElementType, EdiType, type DiagnoscticsContext, type DiagnosticError } from "../../../parser/entities";
import { EdiUtils } from "../../../utils/ediUtils";

suite("EdiDiagnosticsMgr Test Suite", () => {
  let diagnosticsMgr: EdiDiagnosticsMgr;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;

  setup(() => {
    diagnosticsMgr = new EdiDiagnosticsMgr();
    originalGetEdiParser = EdiUtils.getEdiParser;
  });

  teardown(() => {
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
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
  });
});
