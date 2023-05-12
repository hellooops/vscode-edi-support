import * as vscode from "vscode";
import { ICommandable } from "./interfaces/commandable";
import { PrettifyEdifactCommand } from "./commands/prettifyEdifactCommand";

export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, new PrettifyEdifactCommand());
  console.log('Extension "edi-edifact-support" is now active!');
}

function registerCommand(context: vscode.ExtensionContext, command: ICommandable) {
  const commandDisposable = vscode.commands.registerCommand(command.name, command.command);
  context.subscriptions.push(commandDisposable);
}

export function deactivate() {}
