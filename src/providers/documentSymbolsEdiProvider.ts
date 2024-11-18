import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiFunctionalGroup, EdiInterchange, EdiSegment, EdiTransactionSet, EdiType } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";

export class DocumentSymbolsEdiProvider implements vscode.DocumentSymbolProvider, IProvidable {
  async provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[] | vscode.SymbolInformation[]> {
    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) return [];

    const ediDocument = await parser.parse();
    if (!ediDocument) {
      return [];
    }

    const symbols: vscode.DocumentSymbol[] = [];
    if (ediDocument.separatorsSegment) {
      symbols.push(this.getSegmentSymbols(document, ediDocument.separatorsSegment));
    }

    const interchangesSymbols = ediDocument.interchanges.map(interchange => this.getInterchangeSymbols(document, interchange));
    symbols.push(...interchangesSymbols);
    return symbols;
  }

  getInterchangeSymbols(document: vscode.TextDocument, interchange: EdiInterchange): vscode.DocumentSymbol {
    const interchangeSegmentRange = EdiUtils.getInterchangeRange(document, interchange);
    const interchangeSymbol = new vscode.DocumentSymbol(
      interchange.getId() ?? "Unknown",
      "Interchange",
      vscode.SymbolKind.Module,
      interchangeSegmentRange,
      interchangeSegmentRange, 
    );

    const startSegmentSymbols = this.getSegmentSymbols(document, interchange.startSegment!);
    const endSegmentSymbols = this.getSegmentSymbols(document, interchange.endSegment!);
    let functionalGroupSymbols: vscode.DocumentSymbol[];
    if (interchange.functionalGroups.length === 1 && interchange.functionalGroups[0].isFake()) {
      // EDIFACT
      functionalGroupSymbols = interchange.functionalGroups[0].transactionSets.map(transactionSet => this.getTransactionSetSymbols(document, transactionSet));
    } else {
      functionalGroupSymbols = interchange.functionalGroups.map(functionalGroup => this.getFunctionalGroupSymbols(document, functionalGroup));
    }

    interchangeSymbol.children = [
      startSegmentSymbols,
      ...functionalGroupSymbols,
      endSegmentSymbols,
    ];

    return interchangeSymbol;
  }

  getFunctionalGroupSymbols(document: vscode.TextDocument, functionalGroup: EdiFunctionalGroup): vscode.DocumentSymbol {
    const functionalGroupSegmentRange = EdiUtils.getFunctionalGroupRange(document, functionalGroup);
    const functionalGroupSymbol = new vscode.DocumentSymbol(
      functionalGroup.getId() ?? "Unknown",
      "FunctionalGroup",
      vscode.SymbolKind.Namespace,
      functionalGroupSegmentRange,
      functionalGroupSegmentRange, 
    );

    const transactionSetSymbols = functionalGroup.transactionSets.map(transactionSet => this.getTransactionSetSymbols(document, transactionSet));

    functionalGroupSymbol.children = transactionSetSymbols || [];
    return functionalGroupSymbol;
  }

  getTransactionSetSymbols(document: vscode.TextDocument, transactionSet: EdiTransactionSet): vscode.DocumentSymbol {
    const transactionSetSegmentRange = EdiUtils.getTransactionSetRange(document, transactionSet);
    const transactionSetSymbol = new vscode.DocumentSymbol(
      `${transactionSet.getFormattedReleaseAndSchemaString()}[ID=${transactionSet.getId() ?? "Unknown"}]`,
      "FunctionalGroup",
      vscode.SymbolKind.Package,
      transactionSetSegmentRange,
      transactionSetSegmentRange, 
    );

    const segments = transactionSet.getSegments();

    const segmentSymbols = segments.map(segment => this.getSegmentSymbols(document, segment));

    transactionSetSymbol.children = segmentSymbols || [];
    return transactionSetSymbol;
  }

  getSegmentSymbols(document: vscode.TextDocument, segment: EdiSegment): vscode.DocumentSymbol {
    const segmentRange = EdiUtils.getSegmentRange(document, segment);
    const segmentSymbol = new vscode.DocumentSymbol(
      segment.id,
      segment?.ediReleaseSchemaSegment?.desc || segment.id,
      vscode.SymbolKind.Class,
      segmentRange,
      segmentRange, 
    );

    const elementSymbols = segment?.elements?.map(element => {
      const elementRange = EdiUtils.getElementRange(document, segment, element);
      const elementSymbol = new vscode.DocumentSymbol(
        element.getDesignatorWithId(),
        element?.ediReleaseSchemaElement?.desc || element.getDesignatorWithId(),
        vscode.SymbolKind.Field,
        elementRange,
        elementRange, 
      );

      const componentSymbols = element?.components?.map(componentElement => {
        const componentElementRange = EdiUtils.getElementRange(document, segment, componentElement);
        const componentSymbol = new vscode.DocumentSymbol(
          componentElement.getDesignatorWithId(),
          componentElement?.ediReleaseSchemaElement?.desc || componentElement.getDesignatorWithId(),
          vscode.SymbolKind.Property,
          componentElementRange,
          componentElementRange, 
        );

        return componentSymbol;
      });

      elementSymbol.children = componentSymbols || [];
      return elementSymbol;
    });

    segmentSymbol.children = elementSymbols;
    return segmentSymbol;
  }
  
  registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerDocumentSymbolProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerDocumentSymbolProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
