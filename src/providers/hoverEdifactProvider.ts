import * as vscode from "vscode";
import { HoverProviderBase } from "./hoverProviderBase";
import { Disposable } from "vscode";
import { EdiType } from "../parser/entities";

export class HoverEdifactProvider extends HoverProviderBase {
  public getLanguageName(): string {
    return "edifact";
  }

  public registerFunctions(): Disposable[] {
    return [
      vscode.languages.registerHoverProvider({ language: EdiType.EDIFACT, scheme: "file" }, this),
    ];
  }
}
