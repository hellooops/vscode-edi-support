import * as vscode from "vscode";
import { EdiType, type DiagnoscticsContext, type DiagnosticError, DiagnosticErrorSeverity } from "../parser/entities";
import { IDiagnosticsable } from "../interfaces/diagnosticsable";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";
import { type Conf_CustomSchema } from "../interfaces/configurations";

export class DiagnosticsWithContext extends vscode.Diagnostic {
  others: any;
}

export class EdiDiagnosticsMgr implements IDiagnosticsable {
  async refreshDiagnostics(document: vscode.TextDocument, ediDiagnostics: vscode.DiagnosticCollection): Promise<void> {
    if (![constants.ediDocument.x12.name, constants.ediDocument.edifact.name, constants.ediDocument.vda.name].includes(document.languageId)) {
      return;
    }

    const { parser, ediType } = EdiUtils.getEdiParser(document);
    if (!parser) {
      return;
    }

    if (ediType === EdiType.UNKNOWN) {
      return;
    }

    const ediDocument = await parser.parse();
    const customSchemas: Conf_CustomSchema = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.customSchemas) ?? {};

    const diagnoscticsContext: DiagnoscticsContext = {
      ediType,
      customSchemas,
      standardOptions: ediDocument.standardOptions,
      ignoreRequired: ediType === EdiType.VDA
    };
    const errors = ediDocument.getErrors(diagnoscticsContext);
    const vscodeDiagnostics = errors.map(error => this.ediDiagnosticsToVscodeDiagnostics(document, error));
    ediDiagnostics.set(document.uri, vscodeDiagnostics);
  }

  ediDiagnosticsToVscodeDiagnostics(document: vscode.TextDocument, error: DiagnosticError): DiagnosticsWithContext {
    let range: vscode.Range;
    if (error.errorSegment) {
      range = EdiUtils.getSegmentIdRange(document, error.errorSegment);
    } else if (error.errorElement) {
      range = EdiUtils.getElementRange(document, error.errorElement.segment, error.errorElement);
    } else {
      range = new vscode.Range(document.positionAt(0), document.positionAt(0));
    }

    const diagnostic = new DiagnosticsWithContext(
      range,
      error.error,
      this.ediDiagnosticErrorSeverityToVscodeDiagnosticSeverity(error.severity),
    );
    diagnostic.code = error.code;
    diagnostic.source = constants.diagnostic.source;
    diagnostic.others = error.others;
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

  registerDiagnostics(): vscode.Disposable[] {
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
      vscode.workspace.onDidCloseTextDocument(doc => {
        if (doc.isClosed) {
          return ediDiagnostics.delete(doc.uri);
        }
      }),
      vscode.workspace.onDidChangeConfiguration(async (e) => {
        EdiUtils.clearCache();
        if (vscode.window.activeTextEditor) {
          this.refreshDiagnostics(vscode.window.activeTextEditor.document, ediDiagnostics);
        }
      }),
    ];
  }
}
