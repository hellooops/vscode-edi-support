import * as vscode from "vscode";
import { ICommandable } from "./interfaces/commandable";
import { PrettifyEdifactCommand } from "./commands/prettifyEdifactCommand";
import { MinifyEdifactCommand } from "./commands/minifyEdifactCommand";
import { IProvidable } from "./interfaces/providable";
import { HighlightEdifactProvider } from "./providers/highlightEdifactProvider";
import { HoverX12Provider } from "./providers/hoverX12Provider";
import { HoverEdifactProvider } from "./providers/hoverEdifactProvider";
import { DocumentFormattingEditEdifactProvider } from "./providers/documentFormattingEdifactProvider";
import { CodelensEdifactProvider } from "./providers/codelensEdifactProvider";

export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, new PrettifyEdifactCommand());
  registerCommand(context, new MinifyEdifactCommand());
  registerProvider(context, new HighlightEdifactProvider());
  registerProvider(context, new HoverX12Provider());
  registerProvider(context, new HoverEdifactProvider());
  registerProvider(context, new DocumentFormattingEditEdifactProvider());
  registerProvider(context, new CodelensEdifactProvider());
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
