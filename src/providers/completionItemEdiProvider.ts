import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiElement, EdiType } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";
import { EdiSchema } from "../schemas/schemas";

export class CompletionItemEdiProvider implements vscode.CompletionItemProvider, IProvidable {
  async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) {
      return [];
    }

    return [];

    // let ediVersion = parser.parseReleaseAndVersion();
    // if (!ediVersion) return [];
    // const { segments } = await parser.parse();
    // let realPosition = document.offsetAt(
    //   new vscode.Position(position.line, position.character)
    // );
    // const { element, segment } = EdiUtils.getSegmentOrElementByPosition(realPosition, segments);
    // if (!segment) return [];

    // if (element) {
    //   return this.getElementCompletionItems(element);
    // } else {
    //   return this.getSegmentCompletionItems(parser.schema);
    // }
  }
  resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
    throw new Error("Method not implemented.");
  }

  private getSegmentCompletionItems(schema: EdiSchema | undefined): vscode.CompletionItem[] {
    if (!schema) return [];
    const segments = schema.ediReleaseSchema.segments;
    if (!segments) return [];
    return Object.entries(segments).map(([segmentName, seg]) => {
      const completionItem = new vscode.CompletionItem(segmentName, vscode.CompletionItemKind.Value);
      completionItem.detail = seg.desc;
      completionItem.documentation = seg.purpose;
      completionItem.keepWhitespace = true;
      return completionItem;
    });
  }

  private getElementCompletionItems(element: EdiElement): vscode.CompletionItem[] {
    const codes = element.ediReleaseSchemaElement?.getCodes();
    if (!codes) return [];
    return codes.map(code => {
      const completionItem = new vscode.CompletionItem(code.value, vscode.CompletionItemKind.Value);
      completionItem.detail = code.desc;
      completionItem.documentation = code.desc;
      completionItem.keepWhitespace = true;
      return completionItem;
    });
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerCompletionItemProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerCompletionItemProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
