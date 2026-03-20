import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../constants";
import { activate } from "../../extension";
import { AddCodeToQualifierCommand } from "../../commands/addCodeToQualifierCommand";
import { MinifyDocumentCommand } from "../../commands/minifyDocumentCommand";
import { PreviewDocumentCommand } from "../../commands/previewDocumentCommand";
import { PrettifyDocumentCommand } from "../../commands/prettifyDocumentCommand";
import { SelectTextByPositionCommand } from "../../commands/selectTextByPositionCommand";
import { ToggleElementIndexAnnotationCommand } from "../../commands/toggleElementIndexAnnotationCommand";
import { ToggleIndentSegmentsInLoopCommand } from "../../commands/toggleIndentSegmentsInLoopCommand";
import { ToggleInlayHintsCommand } from "../../commands/toggleInlayHintsCommand";
import { ToggleLineCommentCommand } from "../../commands/toggleLineCommentCommand";
import { ToggleLoopAnnotationsCommand } from "../../commands/toggleLoopAnnotationsCommand";
import { EdiDecorationsMgr } from "../../decorations/ediDecorations";
import { EdiDiagnosticsMgr } from "../../diagnostics/ediDiagnostics";
import { CodelensEdiProvider } from "../../providers/codelensEdiProvider";
import { CodeActionEdiProvider } from "../../providers/codeActionEdiProvider";
import { CompletionItemEdiProvider } from "../../providers/completionItemEdiProvider";
import { DocumentFormattingEditEdiProvider } from "../../providers/documentFormattingEdiProvider";
import { DocumentSymbolsEdiProvider } from "../../providers/documentSymbolsEdiProvider";
import { FoldingRangeEdiProvider } from "../../providers/foldingRangeEdiProvider";
import { HighlightEdiProvider } from "../../providers/highlightEdiProvider";
import { HoverEdifactProvider } from "../../providers/hoverEdifactProvider";
import { HoverVdaProvider } from "../../providers/hoverVdaProvider";
import { HoverX12Provider } from "../../providers/hoverX12Provider";
import { InlayHintsEdiEdifactProvider } from "../../providers/inlayHintsEdiEdifactProvider";
import { InlayHintsEdiVdaProvider } from "../../providers/inlayHintsEdiVdaProvider";
import { InlayHintsEdiX12Provider } from "../../providers/inlayHintsEdiX12Provider";
import { SemanticTokensProvider } from "../../providers/semanticTokensProvider";
import { TreeEdiProvider } from "../../providers/treeEdiProvider";

suite("Extension Activate Test Suite", () => {
  let originalRegisterCommand: typeof vscode.commands.registerCommand;
  const patchedMethods: Array<{ target: any; key: string; value: any }> = [];

  setup(() => {
    originalRegisterCommand = vscode.commands.registerCommand;
  });

  teardown(() => {
    vscode.commands.registerCommand = originalRegisterCommand;
    while (patchedMethods.length > 0) {
      const patch = patchedMethods.pop()!;
      patch.target[patch.key] = patch.value;
    }
  });

  test("Should register all commands, providers, diagnostics and decorations during activation", () => {
    const registeredCommands: string[] = [];
    vscode.commands.registerCommand = (command: string, callback: (...args: any[]) => any): vscode.Disposable => {
      registeredCommands.push(command);
      return { dispose: () => {} };
    };

    const registrations: string[] = [];
    const disposable = { dispose: () => {} };
    const patchMethod = (target: any, key: string, label: string) => {
      patchedMethods.push({ target, key, value: target[key] });
      target[key] = function () {
        registrations.push(label);
        return [disposable];
      };
    };

    patchMethod(HighlightEdiProvider.prototype, "registerFunctions", "HighlightEdiProvider");
    patchMethod(HoverX12Provider.prototype, "registerFunctions", "HoverX12Provider");
    patchMethod(HoverEdifactProvider.prototype, "registerFunctions", "HoverEdifactProvider");
    patchMethod(HoverVdaProvider.prototype, "registerFunctions", "HoverVdaProvider");
    patchMethod(DocumentFormattingEditEdiProvider.prototype, "registerFunctions", "DocumentFormattingEditEdiProvider");
    patchMethod(CodelensEdiProvider.prototype, "registerFunctions", "CodelensEdiProvider");
    patchMethod(InlayHintsEdiX12Provider.prototype, "registerFunctions", "InlayHintsEdiX12Provider");
    patchMethod(InlayHintsEdiEdifactProvider.prototype, "registerFunctions", "InlayHintsEdiEdifactProvider");
    patchMethod(InlayHintsEdiVdaProvider.prototype, "registerFunctions", "InlayHintsEdiVdaProvider");
    patchMethod(CompletionItemEdiProvider.prototype, "registerFunctions", "CompletionItemEdiProvider");
    patchMethod(CodeActionEdiProvider.prototype, "registerFunctions", "CodeActionEdiProvider");
    patchMethod(TreeEdiProvider.prototype, "registerFunctions", "TreeEdiProvider");
    patchMethod(DocumentSymbolsEdiProvider.prototype, "registerFunctions", "DocumentSymbolsEdiProvider");
    patchMethod(SemanticTokensProvider.prototype, "registerFunctions", "SemanticTokensProvider");
    patchMethod(FoldingRangeEdiProvider.prototype, "registerFunctions", "FoldingRangeEdiProvider");
    patchMethod(EdiDiagnosticsMgr.prototype, "registerDiagnostics", "EdiDiagnosticsMgr");
    patchMethod(EdiDecorationsMgr.prototype, "registerDecorations", "EdiDecorationsMgr");

    const context = {
      subscriptions: [] as vscode.Disposable[],
    } as vscode.ExtensionContext;

    activate(context);

    assert.deepStrictEqual(
      registeredCommands,
      [
        new PrettifyDocumentCommand().name,
        new MinifyDocumentCommand().name,
        new PreviewDocumentCommand(context).name,
        new ToggleInlayHintsCommand().name,
        new ToggleLoopAnnotationsCommand().name,
        new ToggleElementIndexAnnotationCommand().name,
        new ToggleIndentSegmentsInLoopCommand().name,
        new SelectTextByPositionCommand().name,
        new AddCodeToQualifierCommand().name,
        new ToggleLineCommentCommand().name,
        constants.explorers.refreshEdiExplorer,
      ],
    );
    assert.deepStrictEqual(
      registrations,
      [
        "HighlightEdiProvider",
        "HoverX12Provider",
        "HoverEdifactProvider",
        "HoverVdaProvider",
        "DocumentFormattingEditEdiProvider",
        "CodelensEdiProvider",
        "InlayHintsEdiX12Provider",
        "InlayHintsEdiEdifactProvider",
        "InlayHintsEdiVdaProvider",
        "CompletionItemEdiProvider",
        "CodeActionEdiProvider",
        "EdiDiagnosticsMgr",
        "EdiDecorationsMgr",
        "TreeEdiProvider",
        "DocumentSymbolsEdiProvider",
        "SemanticTokensProvider",
        "FoldingRangeEdiProvider",
      ],
    );
    assert.strictEqual(context.subscriptions.length, registeredCommands.length + registrations.length);
  });
});
