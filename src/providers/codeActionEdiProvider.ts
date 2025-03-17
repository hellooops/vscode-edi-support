import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { DiagnosticError_QUALIFIER_INVALID_CODE, DiagnosticErrors, EdiType } from "../parser/entities";
import * as constants from "../constants";
import { DiagnosticsWithContext } from "../diagnostics/ediDiagnostics";

export class CodeActionEdiProvider implements vscode.CodeActionProvider, IProvidable {
  async provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<(vscode.CodeAction | vscode.Command)[] | undefined> {
    const diags = context.diagnostics
      .filter(i => i.source === constants.diagnostic.source)
      .filter(i => i.code === DiagnosticErrors.QUALIFIER_INVALID_CODE);

    return diags.map(diag => {
      const diagContext = (diag as DiagnosticsWithContext).others as DiagnosticError_QUALIFIER_INVALID_CODE["others"];
      const title = `Add code '${diagContext.code}' to qualifier '${diagContext.qualifier}'`;
      const codeAction = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
      codeAction.command = {
        title,
        command: constants.commands.addCodeToQualifierCommand.name,
        arguments: [diagContext.ediType, diagContext.qualifier, diagContext.code]
      };
      return codeAction;
    });
  }
  resolveCodeAction?(codeAction: vscode.CodeAction, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeAction> {
    throw new Error("Method not implemented.");
  }
  registerFunctions(): vscode.Disposable[] {
    const codeActionProviderMetadata: vscode.CodeActionProviderMetadata = {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
    };

    return [
      vscode.languages.registerCodeActionsProvider({ language: EdiType.X12 }, this, codeActionProviderMetadata),
      vscode.languages.registerCodeActionsProvider({ language: EdiType.EDIFACT }, this, codeActionProviderMetadata),
      vscode.languages.registerCodeActionsProvider({ language: EdiType.VDA }, this, codeActionProviderMetadata),
    ];
  }
}
