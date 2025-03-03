import * as vscode from "vscode";
import { IDecorationable } from "../interfaces/decorationable";
import { EdiDecorationsAfterLineProvider } from "./ediDecorationsAfterLineProvider";
import { EdiDecorationsBeforeLineProvider } from "./ediDecorationsBeforeLineProvider";

export class EdiDecorationsMgr implements IDecorationable {

  decorationsProviders: IDecorationable[] = [];

  constructor() {
    this.decorationsProviders.push(new EdiDecorationsAfterLineProvider());
    this.decorationsProviders.push(new EdiDecorationsBeforeLineProvider());
  }

  registerDecorations(): vscode.Disposable[] {
    return this.decorationsProviders.flatMap(i => i.registerDecorations());
  }
}
