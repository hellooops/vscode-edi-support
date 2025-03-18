import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";
import { type Conf_Supported_EdiType, type Conf_CustomSchema, Conf_Utils } from "../interfaces/configurations";

export class AddCodeToQualifierCommand implements ICommandable {
  name: string = constants.commands.addCodeToQualifierCommand.name;

  public async command(ediType: Conf_Supported_EdiType, release: string, qualifier: string, code: string, desc: string) {
    let customSchemas: Conf_CustomSchema = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.customSchemas) ?? {};
    customSchemas = JSON.parse(JSON.stringify(customSchemas));
    Conf_Utils.addQualifier(customSchemas, ediType, release, qualifier, code, desc);
    await vscode.workspace.getConfiguration(constants.configuration.ediSupport).update(constants.configuration.customSchemas, customSchemas, vscode.ConfigurationTarget.Global, true);
  }
}
