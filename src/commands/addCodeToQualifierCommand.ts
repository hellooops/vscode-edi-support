import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";
import { Configuration_CustomQualifiers } from "../interfaces/configurations";

export class AddCodeToQualifierCommand implements ICommandable {
  name: string = constants.commands.addCodeToQualifierCommand.name;

  public async command(ediType: string, qualifier: string, code: string) {
    let customQualifiers: Configuration_CustomQualifiers = vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.customQualifiers) ?? {};
    customQualifiers = JSON.parse(JSON.stringify(customQualifiers));
    if (!customQualifiers[ediType]) {
      customQualifiers[ediType] = {};
    }

    if (!customQualifiers[ediType][qualifier]) {
      customQualifiers[ediType][qualifier] = [];
    }

    if (!customQualifiers[ediType][qualifier].includes(code)) {
      customQualifiers[ediType][qualifier].push(code);
      await vscode.workspace.getConfiguration(constants.configuration.ediSupport).update(constants.configuration.customQualifiers, customQualifiers, vscode.ConfigurationTarget.Global, true);
    }
  }
}
