import { Disposable } from "vscode";

export interface IProvidable {
  registerFunction(): Disposable;
}