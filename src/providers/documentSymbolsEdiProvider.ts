import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiType } from "../parser/entities";
import { VscodeUtils } from "../utils/utils";

export class DocumentSymbolsEdiProvider implements vscode.DocumentSymbolProvider, IProvidable {
  async provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[] | vscode.SymbolInformation[]> {
    const { parser } = VscodeUtils.getEdiParser(document);
    let segments = await parser.parseSegments();
    if (!segments || segments.length <= 0) {
      return [];
    }

    return segments.map(segment => {
      const segmentRange = VscodeUtils.getSegmentRange(document, segment);
      const segmentSymbol = new vscode.DocumentSymbol(
        segment.id,
        segment?.ediReleaseSchemaSegment?.desc || segment.id,
        vscode.SymbolKind.Class,
        segmentRange,
        segmentRange, 
      );

      const elementSymbols = segment?.elements?.map(element => {
        const elementRange = VscodeUtils.getElementRange(document, segment, element);
        const elementSymbol = new vscode.DocumentSymbol(
          element.getDesignator(),
          element?.ediReleaseSchemaElement?.desc || element.getDesignator(),
          vscode.SymbolKind.Field,
          elementRange,
          elementRange, 
        );

        const componentSymbols = element?.components?.map(componentElement => {
          const componentElementRange = VscodeUtils.getElementRange(document, segment, componentElement);
          const componentSymbol = new vscode.DocumentSymbol(
            componentElement.getDesignator(),
            componentElement?.ediReleaseSchemaElement?.desc || componentElement.getDesignator(),
            vscode.SymbolKind.Property,
            componentElementRange,
            componentElementRange, 
          );

          return componentSymbol;
        });

        elementSymbol.children = componentSymbols;
        return elementSymbol;
      });

      segmentSymbol.children = elementSymbols;
      return segmentSymbol;
    });
  }
  
  registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerDocumentSymbolProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerDocumentSymbolProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
