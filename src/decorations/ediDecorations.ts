import * as vscode from "vscode";
import { IDecorationable } from "../interfaces/decorationable";
import { EdiDecorationsAfterLineProvider } from "./ediDecorationsAfterLineProvider";
import { EdiDecorationsBeforePositionProvider } from "./ediDecorationsBeforePositionProvider";

export class EdiDecorationsMgr implements IDecorationable {

  decorationsProviders: IDecorationable[] = [];

  constructor() {
    this.decorationsProviders.push(new EdiDecorationsAfterLineProvider());
    this.decorationsProviders.push(new EdiDecorationsBeforePositionProvider());
  }

  registerDecorations(): vscode.Disposable[] {
    return this.decorationsProviders.flatMap(i => i.registerDecorations());
  }
}
