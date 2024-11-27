import { Disposable } from "vscode";

export interface IDecorationable {
  registerDecorations(): Disposable[];
}
