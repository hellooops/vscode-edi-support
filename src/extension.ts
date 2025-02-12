import * as vscode from "vscode";
import { ICommandable } from "./interfaces/commandable";
import { PrettifyDocumentCommand } from "./commands/prettifyDocumentCommand";
import { MinifyDocumentCommand } from "./commands/minifyDocumentCommand";
import { PreviewDocumentCommand } from "./commands/previewDocumentCommand";
import { ToggleInlayHintsCommand } from "./commands/toggleInlayHintsCommand";
import { ToggleLoopAnnotationsCommand } from "./commands/toggleLoopAnnotationsCommand";
import { ToggleElementIndexAnnotationCommand } from "./commands/toggleElementIndexAnnotationCommand";
import { ToggleIndentSegmentsInLoopCommand } from "./commands/toggleIndentSegmentsInLoopCommand";
import { SelectTextByPositionCommand } from "./commands/selectTextByPositionCommand";
import { IProvidable } from "./interfaces/providable";
import { HighlightEdiProvider } from "./providers/highlightEdiProvider";
import { HoverX12Provider } from "./providers/hoverX12Provider";
import { HoverEdifactProvider } from "./providers/hoverEdifactProvider";
import { HoverVdaProvider } from "./providers/hoverVdaProvider";
import { DocumentFormattingEditEdiProvider } from "./providers/documentFormattingEdiProvider";
import { CodelensEdiProvider } from "./providers/codelensEdiProvider";
import { InlayHintsEdiX12Provider } from "./providers/inlayHintsEdiX12Provider";
import { InlayHintsEdiEdifactProvider } from "./providers/inlayHintsEdiEdifactProvider";
import { InlayHintsEdiVdaProvider } from "./providers/inlayHintsEdiVdaProvider";
import { CompletionItemEdiProvider } from "./providers/completionItemEdiProvider";
import { TreeEdiProvider } from "./providers/treeEdiProvider";
import { DocumentSymbolsEdiProvider } from "./providers/documentSymbolsEdiProvider";
import { SemanticTokensProvider } from "./providers/semanticTokensProvider";
import { FoldingRangeEdiProvider } from "./providers/foldingRangeEdiProvider";
import { EdiDiagnosticsMgr } from "./diagnostics/ediDiagnostics";
import { IDiagnosticsable } from "./interfaces/diagnosticsable";
import { EdiDecorationsMgr } from "./decorations/ediDecorations";
import { IDecorationable } from "./interfaces/decorationable";

export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, new PrettifyDocumentCommand());
  registerCommand(context, new MinifyDocumentCommand());
  registerCommand(context, new PreviewDocumentCommand(context));
  registerCommand(context, new ToggleInlayHintsCommand());
  registerCommand(context, new ToggleLoopAnnotationsCommand());
  registerCommand(context, new ToggleElementIndexAnnotationCommand());
  registerCommand(context, new ToggleIndentSegmentsInLoopCommand());
  registerCommand(context, new SelectTextByPositionCommand());
  registerProvider(context, new HighlightEdiProvider());
  registerProvider(context, new HoverX12Provider());
  registerProvider(context, new HoverEdifactProvider());
  registerProvider(context, new HoverVdaProvider());
  registerProvider(context, new DocumentFormattingEditEdiProvider());
  registerProvider(context, new CodelensEdiProvider());
  registerProvider(context, new InlayHintsEdiX12Provider());
  registerProvider(context, new InlayHintsEdiEdifactProvider());
  registerProvider(context, new InlayHintsEdiVdaProvider());
  registerProvider(context, new CompletionItemEdiProvider());
  registerDiagnostics(context, new EdiDiagnosticsMgr());
  registerDecorations(context, new EdiDecorationsMgr());

  const treeEdiProvider = new TreeEdiProvider();
  registerProvider(context, treeEdiProvider);
  registerCommand(context, treeEdiProvider, () => treeEdiProvider.refresh());

  registerProvider(context, new DocumentSymbolsEdiProvider());
  registerProvider(context, new SemanticTokensProvider());
  registerProvider(context, new FoldingRangeEdiProvider());

  console.log("Extension \"edi-support\" is now active!");
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

function registerDecorations(context: vscode.ExtensionContext, diagnostics: IDecorationable) {
  context.subscriptions.push(...diagnostics.registerDecorations());
}

export function deactivate() {}
