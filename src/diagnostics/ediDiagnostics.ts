import * as vscode from "vscode";
import { EdiElement, EdiSegment, EdiType } from "../parser/entities";
import { IDiagnosticsable } from "../interfaces/diagnosticsable";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

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
    for (let segment of segments) {
      if (!segment.ediReleaseSchemaSegment || !segment.elements) {
        continue;
      }

      for (let element of segment.elements) {
        const elementDiagnostic = this.getElementDiagnostic(document, segment, element);
        if (elementDiagnostic?.length > 0) {
          diagnostics.push(...elementDiagnostic);
        }
      }
    }
  
    ediDiagnostics.set(document.uri, diagnostics);
  }

  getElementDiagnostic(document: vscode.TextDocument, segment: EdiSegment, element: EdiElement): vscode.Diagnostic[] {
    if (!element?.ediReleaseSchemaElement) {
      return [];
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const elementErrors = element.getErrors();
    for (let elementError of elementErrors) {
      const diagnostic = new vscode.Diagnostic(
        EdiUtils.getElementRange(document, segment, element),
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
