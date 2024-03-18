import * as vscode from "vscode";
import { ICommandable } from "./interfaces/commandable";
import { PrettifyDocumentCommand } from "./commands/prettifyDocumentCommand";
import { MinifyDocumentCommand } from "./commands/minifyDocumentCommand";
import { ToggleInlayHintsCommand } from "./commands/toggleInlayHintsCommand";
import { SelectTextByPositionCommand } from "./commands/selectTextByPositionCommand";
import { IProvidable } from "./interfaces/providable";
import { HighlightEdiProvider } from "./providers/highlightEdiProvider";
import { HoverX12Provider } from "./providers/hoverX12Provider";
import { HoverEdifactProvider } from "./providers/hoverEdifactProvider";
import { DocumentFormattingEditEdiProvider } from "./providers/documentFormattingEdiProvider";
import { CodelensEdiProvider } from "./providers/codelensEdiProvider";
import { InlayHintsEdiProvider } from "./providers/inlayHintsEdiProvider";
import { TreeEdiProvider } from "./providers/treeEdiProvider";
import { DocumentSymbolsEdiProvider } from "./providers/documentSymbolsEdiProvider";
import { SemanticTokensProvider } from "./providers/semanticTokensProvider";
import { EdiDiagnosticsMgr } from "./diagnostics/ediDiagnostics";
import { IDiagnosticsable } from "./interfaces/diagnosticsable";

export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, new PrettifyDocumentCommand());
  registerCommand(context, new MinifyDocumentCommand());
  registerCommand(context, new ToggleInlayHintsCommand());
  registerCommand(context, new SelectTextByPositionCommand());
  registerProvider(context, new HighlightEdiProvider());
  registerProvider(context, new HoverX12Provider());
  registerProvider(context, new HoverEdifactProvider());
  registerProvider(context, new DocumentFormattingEditEdiProvider());
  registerProvider(context, new CodelensEdiProvider());
  registerProvider(context, new InlayHintsEdiProvider());
  registerDiagnostics(context, new EdiDiagnosticsMgr());

  const treeEdiProvider = new TreeEdiProvider();
  registerProvider(context, treeEdiProvider);
  registerCommand(context, treeEdiProvider, () => treeEdiProvider.refresh());

  registerProvider(context, new DocumentSymbolsEdiProvider());
  registerProvider(context, new SemanticTokensProvider());

  console.log('Extension "edi-support" is now active!');
}

function registerCommand(context: vscode.ExtensionContext, command: ICommandable, callback?: (...args: any[]) => any) {
  const commandDisposable = vscode.commands.registerCommand(command.name, callback || command.command);
  context.subscriptions.push(commandDisposable);
}

function registerProvider(context: vscode.ExtensionContext, provider: IProvidable) {
  context.subscriptions.push(...provider.registerFunctions());
}

function registerDiagnostics(context: vscode.ExtensionContext, diagnostics: IDiagnosticsable) {
  context.subscriptions.push(...diagnostics.registerDiagnostics());
}

export function deactivate() {}
