import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiElement, EdiFunctionalGroup, EdiInterchange, EdiSegment, EdiTransactionSet, EdiType } from "../parser/entities";
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

    const interchangesSymbols = ediDocument.interchanges.flatMap(interchange => this.getInterchangeSymbols(document, interchange));
    symbols.push(...interchangesSymbols);
    return symbols;
  }

  getInterchangeSymbols(document: vscode.TextDocument, interchange: EdiInterchange): vscode.DocumentSymbol[] {
    const functionalGroupSymbols = interchange.functionalGroups.flatMap(functionalGroup => this.getFunctionalGroupSymbols(document, functionalGroup));
    if (interchange.isFake()) {
      return functionalGroupSymbols;
    }
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

    interchangeSymbol.children = [
      startSegmentSymbols,
      ...functionalGroupSymbols,
      endSegmentSymbols,
    ];

    return [interchangeSymbol];
  }

  getFunctionalGroupSymbols(document: vscode.TextDocument, functionalGroup: EdiFunctionalGroup): vscode.DocumentSymbol[] {
    const transactionSetSymbols = functionalGroup.transactionSets.map(transactionSet => this.getTransactionSetSymbols(document, transactionSet));
    if (functionalGroup.isFake()) {
      return transactionSetSymbols;
    }

    const functionalGroupSegmentRange = EdiUtils.getFunctionalGroupRange(document, functionalGroup);
    const functionalGroupSymbol = new vscode.DocumentSymbol(
      functionalGroup.getId() ?? "Unknown",
      "FunctionalGroup",
      vscode.SymbolKind.Namespace,
      functionalGroupSegmentRange,
      functionalGroupSegmentRange, 
    );

    functionalGroupSymbol.children = transactionSetSymbols || [];
    return [functionalGroupSymbol];
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
      segment?.getDesc() || segment.id,
      vscode.SymbolKind.Class,
      segmentRange,
      segmentRange, 
    );

    if (segment.isLoop()) {
      const loopSegmentsSymbols = segment.Loop!.map(s => this.getSegmentSymbols(document, s));
      segmentSymbol.children = loopSegmentsSymbols;
    } else {
      const elementSymbols = segment?.elements?.map(element => this.getElementSymbols(document, element));
      segmentSymbol.children = elementSymbols;
    }

    return segmentSymbol;
  }

  getElementSymbols(document: vscode.TextDocument, element: EdiElement): vscode.DocumentSymbol {
    const elementRange = EdiUtils.getElementRange(document, element.segment, element);
    const elementSymbol = new vscode.DocumentSymbol(
      element.getDesignatorWithId(),
      element?.ediReleaseSchemaElement?.desc || element.getDesignatorWithId(),
      vscode.SymbolKind.Field,
      elementRange,
      elementRange, 
    );

    const componentSymbols = element?.components?.map(componentElement => {
      const componentElementRange = EdiUtils.getElementRange(document, element.segment, componentElement);
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
  }
  
  registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerDocumentSymbolProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerDocumentSymbolProvider({ language: EdiType.EDIFACT }, this),
      vscode.languages.registerDocumentSymbolProvider({ language: EdiType.VDA }, this),
    ];
  }
}
