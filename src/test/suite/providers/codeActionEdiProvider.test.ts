import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../../constants";
import { DiagnosticsWithContext } from "../../../diagnostics/ediDiagnostics";
import { DiagnosticErrors, EdiType } from "../../../parser/entities";
import { CodeActionEdiProvider } from "../../../providers/codeActionEdiProvider";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("CodeActionEdiProvider Test Suite", () => {
  let provider: CodeActionEdiProvider;
  let originalRegisterCodeActionsProvider: typeof vscode.languages.registerCodeActionsProvider;

  setup(() => {
    provider = new CodeActionEdiProvider();
    originalRegisterCodeActionsProvider = vscode.languages.registerCodeActionsProvider;
  });

  teardown(() => {
    vscode.languages.registerCodeActionsProvider = originalRegisterCodeActionsProvider;
  });

  test("Should return quick fix only for qualifier invalid code diagnostics", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
    const range = new vscode.Range(0, 0, 0, 3);
    const matchingDiagnostic = new DiagnosticsWithContext(
      range,
      "invalid code",
      vscode.DiagnosticSeverity.Error,
    );
    matchingDiagnostic.source = constants.diagnostic.source;
    matchingDiagnostic.code = DiagnosticErrors.QUALIFIER_INVALID_CODE;
    matchingDiagnostic.others = {
      ediType: EdiType.X12,
      release: "00401",
      qualifier: "Process type identification",
      code: "ZZ",
    };

    const wrongSourceDiagnostic = new DiagnosticsWithContext(
      range,
      "invalid code",
      vscode.DiagnosticSeverity.Error,
    );
    wrongSourceDiagnostic.source = "other-source";
    wrongSourceDiagnostic.code = DiagnosticErrors.QUALIFIER_INVALID_CODE;

    const wrongCodeDiagnostic = new DiagnosticsWithContext(
      range,
      "other issue",
      vscode.DiagnosticSeverity.Warning,
    );
    wrongCodeDiagnostic.source = constants.diagnostic.source;
    wrongCodeDiagnostic.code = "OTHER_CODE";

    const result = await provider.provideCodeActions(
      document,
      range,
      {
        diagnostics: [matchingDiagnostic, wrongSourceDiagnostic, wrongCodeDiagnostic],
        only: undefined,
        triggerKind: vscode.CodeActionTriggerKind.Invoke,
      },
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.ok(result);
    assert.strictEqual(result.length, 1);
    assert.ok(result[0] instanceof vscode.CodeAction);

    const action = result[0] as vscode.CodeAction;
    assert.strictEqual(action.kind, vscode.CodeActionKind.QuickFix);
    assert.strictEqual(action.title, "Add code 'ZZ' to qualifier 'Process type identification'");
    assert.deepStrictEqual(action.command, {
      title: "Add code 'ZZ' to qualifier 'Process type identification'",
      command: constants.commands.addCodeToQualifierCommand.name,
      arguments: [EdiType.X12, "00401", "Process type identification", "ZZ", "<Custom code>"],
    });
  });

  test("Should return empty array when no diagnostics match", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
    const range = new vscode.Range(0, 0, 0, 3);
    const diagnostic = new DiagnosticsWithContext(
      range,
      "value required",
      vscode.DiagnosticSeverity.Error,
    );
    diagnostic.source = constants.diagnostic.source;
    diagnostic.code = "SOME_OTHER_CODE";

    const result = await provider.provideCodeActions(
      document,
      range,
      {
        diagnostics: [diagnostic],
        only: undefined,
        triggerKind: vscode.CodeActionTriggerKind.Invoke,
      },
      EdiMockFactory.createMockCancellationToken(),
    );

    assert.deepStrictEqual(result, []);
  });

  test("Should register code action providers for x12, edifact and vda", () => {
    const registeredLanguages: string[] = [];
    vscode.languages.registerCodeActionsProvider = (
      selector: vscode.DocumentSelector,
      codeActionProvider: vscode.CodeActionProvider,
      metadata?: vscode.CodeActionProviderMetadata,
    ): vscode.Disposable => {
      const language = (selector as vscode.DocumentFilter).language;
      if (language) {
        registeredLanguages.push(language);
      }
      assert.strictEqual(codeActionProvider, provider);
      assert.deepStrictEqual(metadata?.providedCodeActionKinds, [vscode.CodeActionKind.QuickFix]);
      return { dispose: () => {} };
    };

    const result = provider.registerFunctions();

    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(registeredLanguages, [EdiType.X12, EdiType.EDIFACT, EdiType.VDA]);
  });
});
