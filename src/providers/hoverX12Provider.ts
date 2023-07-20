import * as vscode from "vscode";
import { HoverProviderBase } from "./hoverProviderBase";
import { Disposable } from "vscode";
import { EdiType } from "../parser/entities";

export class HoverX12Provider extends HoverProviderBase {
  public getLanguageName(): string {
    return "x12";
  }

  public registerFunctions(): Disposable[] {
    return [
      vscode.languages.registerHoverProvider({ language: EdiType.X12 }, this),
    ];
  }
}
