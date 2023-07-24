import * as vscode from "vscode";
import { HoverProviderBase } from "./hoverProviderBase";
import { Disposable } from "vscode";
import { EdiType } from "../parser/entities";
import * as constants from "../constants";

export class HoverX12Provider extends HoverProviderBase {
  public getLanguageName(): string {
    return constants.ediDocument.x12.name;
  }

  public registerFunctions(): Disposable[] {
    return [
      vscode.languages.registerHoverProvider({ language: EdiType.X12 }, this),
    ];
  }
}
