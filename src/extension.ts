import * as vscode from "vscode";
import { ICommandable } from "./interfaces/commandable";
import { PrettifyDocumentCommand } from "./commands/prettifyDocumentCommand";
import { MinifyDocumentCommand } from "./commands/minifyDocumentCommand";
import { IProvidable } from "./interfaces/providable";
import { HighlightEdiProvider } from "./providers/highlightEdiProvider";
import { HoverX12Provider } from "./providers/hoverX12Provider";
import { HoverEdifactProvider } from "./providers/hoverEdifactProvider";
import { DocumentFormattingEditEdifactProvider } from "./providers/documentFormattingEdifactProvider";
import { CodelensEdifactProvider } from "./providers/codelensEdifactProvider";
import { InlayHintsEdiProvider } from "./providers/inlayHintsEdiProvider";

export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, new PrettifyDocumentCommand());
  registerCommand(context, new MinifyDocumentCommand());
  registerProvider(context, new HighlightEdiProvider());
  registerProvider(context, new HoverX12Provider());
  registerProvider(context, new HoverEdifactProvider());
  registerProvider(context, new DocumentFormattingEditEdifactProvider());
  registerProvider(context, new CodelensEdifactProvider());


  registerProvider(context, new InlayHintsEdiProvider());
  console.log('Extension "edi-support" is now active!');
}

function registerCommand(context: vscode.ExtensionContext, command: ICommandable) {
  const commandDisposable = vscode.commands.registerCommand(command.name, command.command);
  context.subscriptions.push(commandDisposable);
}

function registerProvider(context: vscode.ExtensionContext, provider: IProvidable) {
  context.subscriptions.push(...provider.registerFunctions());
}

export function deactivate() {}
