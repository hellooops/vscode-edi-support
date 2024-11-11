import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiType } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";

export class DocumentSymbolsEdiProvider implements vscode.DocumentSymbolProvider, IProvidable {
  async provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[] | vscode.SymbolInformation[]> {
    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) return [];
    // TODO(Deric): Add interchange / functionalGroup / transactionSet
    // const { segments } = await parser.parse();
    // if (!segments || segments.length <= 0) {
    //   return [];
    // }

    // return segments.map(segment => {
    //   const segmentRange = EdiUtils.getSegmentRange(document, segment);
    //   const segmentSymbol = new vscode.DocumentSymbol(
    //     segment.id,
    //     segment?.ediReleaseSchemaSegment?.desc || segment.id,
    //     vscode.SymbolKind.Class,
    //     segmentRange,
    //     segmentRange, 
    //   );

    //   const elementSymbols = segment?.elements?.map(element => {
    //     const elementRange = EdiUtils.getElementRange(document, segment, element);
    //     const elementSymbol = new vscode.DocumentSymbol(
    //       element.getDesignatorWithId(),
    //       element?.ediReleaseSchemaElement?.desc || element.getDesignatorWithId(),
    //       vscode.SymbolKind.Field,
    //       elementRange,
    //       elementRange, 
    //     );

    //     const componentSymbols = element?.components?.map(componentElement => {
    //       const componentElementRange = EdiUtils.getElementRange(document, segment, componentElement);
    //       const componentSymbol = new vscode.DocumentSymbol(
    //         componentElement.getDesignatorWithId(),
    //         componentElement?.ediReleaseSchemaElement?.desc || componentElement.getDesignatorWithId(),
    //         vscode.SymbolKind.Property,
    //         componentElementRange,
    //         componentElementRange, 
    //       );

    //       return componentSymbol;
    //     });

    //     elementSymbol.children = componentSymbols || [];
    //     return elementSymbol;
    //   });

    //   segmentSymbol.children = elementSymbols;
    //   return segmentSymbol;
    // });
  }
  
  registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerDocumentSymbolProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerDocumentSymbolProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
