import { Disposable } from "vscode";

export interface IDiagnosticsable {
  registerDiagnostics(): Disposable[];
}
