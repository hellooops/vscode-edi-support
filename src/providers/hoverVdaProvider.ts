import * as vscode from "vscode";
import { HoverProviderBase } from "./hoverProviderBase";
import { Disposable } from "vscode";
import { EdiType } from "../parser/entities";
import * as constants from "../constants";

export class HoverVdaProvider extends HoverProviderBase {
  public getLanguageName(): string {
    return constants.ediDocument.vda.name;
  }

  public registerFunctions(): Disposable[] {
    return [
      vscode.languages.registerHoverProvider({ language: EdiType.VDA }, this),
    ];
  }
}
