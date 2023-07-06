import { Disposable } from "vscode";

export interface IProvidable {
  registerFunctions(): Disposable[];
}