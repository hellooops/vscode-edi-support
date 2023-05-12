import * as vscode from "vscode";
import { ICommandable } from "./interfaces/commandable";
import { PrettifyEdifactCommand } from "./commands/prettifyEdifactCommand";
import { IProvidable } from "./interfaces/providable";
import { HighlightEdifactProvider } from "./providers/highlightEdifactProvider";
import { HoverEdifactProvider } from "./providers/hoverEdifactProvider";

export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, new PrettifyEdifactCommand());
  registerProvider(context, new HighlightEdifactProvider());
  registerProvider(context, new HoverEdifactProvider());
  console.log('Extension "edi-edifact-support" is now active!');
}

function registerCommand(context: vscode.ExtensionContext, command: ICommandable) {
  const commandDisposable = vscode.commands.registerCommand(command.name, command.command);
  context.subscriptions.push(commandDisposable);
}

function registerProvider(context: vscode.ExtensionContext, provider: IProvidable) {
  context.subscriptions.push(provider.registerFunction());
}

export function deactivate() {}
