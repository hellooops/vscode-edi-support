import * as vscode from "vscode";
import { EdiType, type DiagnoscticsContext, type DiagnosticError, DiagnosticErrorSeverity } from "../parser/entities";
import { IDiagnosticsable } from "../interfaces/diagnosticsable";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

export class EdiDiagnosticsMgr implements IDiagnosticsable {
  async refreshDiagnostics(document: vscode.TextDocument, ediDiagnostics: vscode.DiagnosticCollection): Promise<void> {
    const { parser, ediType } = EdiUtils.getEdiParser(document);
    if (!parser) {
      return;
    }

    if (ediType === EdiType.UNKNOWN) {
      return;
    }

    const ediDocument = await parser.parse();

    const diagnoscticsContext: DiagnoscticsContext = {
      ediType,
      standardOptions: ediDocument.standardOptions
    };
    const errors = ediDocument.getErrors(diagnoscticsContext);
    const vscodeDiagnostics = errors.map(error => this.ediDiagnosticsToVscodeDiagnostics(document, error));
    ediDiagnostics.set(document.uri, vscodeDiagnostics);
  }

  ediDiagnosticsToVscodeDiagnostics(document: vscode.TextDocument, error: DiagnosticError): vscode.Diagnostic {
    let range: vscode.Range;
    if (error.errorSegment) {
      range = EdiUtils.getSegmentIdRange(document, error.errorSegment);
    } else if (error.errorElement) {
      range = EdiUtils.getElementRange(document, error.errorElement.segment, error.errorElement);
    } else {
      range = new vscode.Range(document.positionAt(0), document.positionAt(0));
    }

    const diagnostic = new vscode.Diagnostic(
      range,
      error.error,
      this.ediDiagnosticErrorSeverityToVscodeDiagnosticSeverity(error.severity)
    );
    diagnostic.code = error.code;
    return diagnostic;
  }

  private ediDiagnosticErrorSeverityToVscodeDiagnosticSeverity(severity: DiagnosticErrorSeverity): vscode.DiagnosticSeverity {
    if (severity === DiagnosticErrorSeverity.ERROR) {
      return vscode.DiagnosticSeverity.Error;
    } else if (severity === DiagnosticErrorSeverity.WARNING) {
      return vscode.DiagnosticSeverity.Warning;
    } else {
      throw new Error("Unsupported DiagnosticErrorSeverity: " + severity);
    }
  }

  registerDiagnostics(): any[] {
    const ediDiagnostics = vscode.languages.createDiagnosticCollection(constants.diagnostic.diagnosticCollectionId);
    if (vscode.window.activeTextEditor) {
      this.refreshDiagnostics(vscode.window.activeTextEditor.document, ediDiagnostics);
    }
    return [
      ediDiagnostics,
      vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
          this.refreshDiagnostics(editor.document, ediDiagnostics);
        }
      }),
      vscode.workspace.onDidChangeTextDocument(editor => this.refreshDiagnostics(editor.document, ediDiagnostics)),
      vscode.workspace.onDidCloseTextDocument(doc => ediDiagnostics.delete(doc.uri))
    ];
  }
}
