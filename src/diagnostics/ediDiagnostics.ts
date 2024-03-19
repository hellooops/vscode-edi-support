import * as vscode from "vscode";
import { EdiType, type DiagnoscticsContext } from "../parser/entities";
import { IDiagnosticsable } from "../interfaces/diagnosticsable";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

interface VscodeDiagnoscticsContext extends DiagnoscticsContext {
  document: vscode.TextDocument;
}

export class EdiDiagnosticsMgr implements IDiagnosticsable {
  async refreshDiagnostics(document: vscode.TextDocument, ediDiagnostics: vscode.DiagnosticCollection): Promise<void> {
    const diagnostics: vscode.Diagnostic[] = [];
    const { parser, ediType } = EdiUtils.getEdiParser(document);
    if (!parser) {
      return;
    }
    
    if (ediType === EdiType.UNKNOWN) {
      return;
    }

    let segments = await parser.parseSegments();
    let diagnoscticsContext: VscodeDiagnoscticsContext;
    for (let segment of segments) {
      diagnoscticsContext = {
        document,
        segment,
        ediType,
        segments
      };

      const segmentDiagnostic = this.getSegmentDiagnostic(diagnoscticsContext);
      if (segmentDiagnostic?.length > 0) {
        diagnostics.push(...segmentDiagnostic);
      }

      if (!segment.elements) {
        continue;
      }

      for (let element of segment.elements) {
        diagnoscticsContext = {
          document,
          segment,
          element,
          ediType,
          segments
        };
        const elementDiagnostic = this.getElementDiagnostic(diagnoscticsContext);
        if (elementDiagnostic?.length > 0) {
          diagnostics.push(...elementDiagnostic);
        }
      }
    }
  
    ediDiagnostics.set(document.uri, diagnostics);
  }

  getSegmentDiagnostic(context: VscodeDiagnoscticsContext): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const segmentErrors = context.segment.getErrors(context);
    for (let segmentError of segmentErrors) {
      const diagnostic = new vscode.Diagnostic(
        EdiUtils.getSegmentIdRange(context.document, context.segment),
        segmentError.error,
        vscode.DiagnosticSeverity.Error
      );
      diagnostic.code = segmentError.code;
      diagnostics.push(diagnostic);
    }

    return diagnostics;
  }

  getElementDiagnostic(context: VscodeDiagnoscticsContext): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const elementErrors = context.element!.getErrors(context);
    for (let elementError of elementErrors) {
      const diagnostic = new vscode.Diagnostic(
        EdiUtils.getElementRange(context.document, context.segment, context.element!),
        elementError.error,
        vscode.DiagnosticSeverity.Error
      );
      diagnostic.code = elementError.code;
      diagnostics.push(diagnostic);
    }

    return diagnostics;
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
