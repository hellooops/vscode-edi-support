import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../../constants";
import { EdiSegment, EdiType } from "../../../parser/entities";
import { CodelensEdiProvider } from "../../../providers/codelensEdiProvider";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("CodelensEdiProvider Test Suite", () => {
  let provider: CodelensEdiProvider;
  let originalGetConfiguration: typeof vscode.workspace.getConfiguration;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalIsOnlySegmentInLine: typeof EdiUtils.isOnlySegmentInLine;
  let originalGetSegmentStartPosition: typeof EdiUtils.getSegmentStartPosition;
  let originalGetInterchangeStartPosition: typeof EdiUtils.getInterchangeStartPosition;
  let originalGetFunctionalGroupStartPosition: typeof EdiUtils.getFunctionalGroupStartPosition;
  let originalGetTransactionSetStartPosition: typeof EdiUtils.getTransactionSetStartPosition;
  let originalRegisterCodeLensProvider: typeof vscode.languages.registerCodeLensProvider;

  setup(() => {
    provider = new CodelensEdiProvider();
    originalGetConfiguration = vscode.workspace.getConfiguration;
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalIsOnlySegmentInLine = EdiUtils.isOnlySegmentInLine;
    originalGetSegmentStartPosition = EdiUtils.getSegmentStartPosition;
    originalGetInterchangeStartPosition = EdiUtils.getInterchangeStartPosition;
    originalGetFunctionalGroupStartPosition = EdiUtils.getFunctionalGroupStartPosition;
    originalGetTransactionSetStartPosition = EdiUtils.getTransactionSetStartPosition;
    originalRegisterCodeLensProvider = vscode.languages.registerCodeLensProvider;
  });

  teardown(() => {
    vscode.workspace.getConfiguration = originalGetConfiguration;
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).isOnlySegmentInLine = originalIsOnlySegmentInLine;
    (EdiUtils as any).getSegmentStartPosition = originalGetSegmentStartPosition;
    (EdiUtils as any).getInterchangeStartPosition = originalGetInterchangeStartPosition;
    (EdiUtils as any).getFunctionalGroupStartPosition = originalGetFunctionalGroupStartPosition;
    (EdiUtils as any).getTransactionSetStartPosition = originalGetTransactionSetStartPosition;
    vscode.languages.registerCodeLensProvider = originalRegisterCodeLensProvider;
  });

  test("Should build x12 header code lenses from configuration", () => {
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableCodelens]: true,
      [constants.configuration.inlayHints.segmentNames]: true,
      [constants.configuration.enableLoopAnnotations]: false,
      [constants.configuration.formatting.indentSegmentsInLoop]: true,
    });

    const result = provider.getHeaderCodeLenses(EdiType.X12);

    assert.strictEqual(result.length, 7);
    assert.deepStrictEqual(result.map(item => item.command?.title), [
      constants.commands.minifyDocumentCommand.label,
      constants.commands.prettifyDocumentCommand.label,
      `${constants.commands.toggleInlayHintsCommand.label}(on)`,
      `${constants.commands.toggleLoopAnnotationsCommand.label}(off)`,
      `${constants.commands.toggleIndentSegmentsInLoopCommand.label}(on)`,
      constants.commands.previewDocumentCommand.label,
      constants.common.kasoftware.allRightsReserved,
    ]);
    assert.strictEqual(result[5].command?.command, constants.commands.previewDocumentCommand.name);
    assert.strictEqual(result[6].command?.command, constants.nativeCommands.open);
  });

  test("Should build vda header code lenses with element index toggle", () => {
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableElementIndexAnnotation]: true,
    });

    const result = provider.getHeaderCodeLenses(EdiType.VDA);

    assert.strictEqual(result.length, 5);
    assert.deepStrictEqual(result.map(item => item.command?.title), [
      constants.commands.minifyDocumentCommand.label,
      constants.commands.prettifyDocumentCommand.label,
      `${constants.commands.toggleElementIndexAnnotationCommand.label}(on)`,
      constants.commands.previewDocumentCommand.label,
      constants.common.kasoftware.allRightsReserved,
    ]);
  });

  test("Should provide header and document code lenses when enabled", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableCodelens]: true,
      [constants.configuration.enableLoopAnnotations]: true,
      [constants.configuration.inlayHints.segmentNames]: false,
      [constants.configuration.formatting.indentSegmentsInLoop]: false,
    });

    provider.getDocumentCodeLenses = async () => [
      new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), { title: "Document Lens", command: "", arguments: [] }),
    ];

    const result = await provider.provideCodeLenses(document, EdiMockFactory.createMockCancellationToken());

    assert.ok(result);
    assert.strictEqual(result.length, 8);
    assert.strictEqual(result[result.length - 1].command?.title, "Document Lens");
  });

  test("Should return empty document code lenses when parser is unavailable or parse returns undefined", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");

    (EdiUtils as any).getEdiParser = () => ({ parser: undefined });
    let result = await provider.getDocumentCodeLenses(document);
    assert.deepStrictEqual(result, []);

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => undefined,
      },
    });
    result = await provider.getDocumentCodeLenses(document);
    assert.deepStrictEqual(result, []);
  });

  test("Should return empty code lenses when both codelens toggles are disabled", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
    vscode.workspace.getConfiguration = () => EdiMockFactory.createMockConfiguration({
      [constants.configuration.enableCodelens]: false,
      [constants.configuration.enableLoopAnnotations]: false,
    });

    const result = await provider.provideCodeLenses(document, EdiMockFactory.createMockCancellationToken());

    assert.deepStrictEqual(result, []);
  });

  test("Should create interchange, functional group and transaction set code lenses when headers are on dedicated lines", () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~\nGS*PO*~\nST*850*~", "x12");
    const firstTransactionSegment = new EdiSegment("ST", 18, 25, 7, "~");
    const transactionSet = {
      getId: () => "850",
      getFirstSegment: () => firstTransactionSegment,
      segments: [],
    };
    const secondTransactionSet = {
      getId: () => "860",
      getFirstSegment: () => firstTransactionSegment,
      segments: [],
    };
    const firstGroupSegment = new EdiSegment("GS", 9, 16, 7, "~");
    const functionalGroup = {
      getId: () => "PO",
      getFirstSegment: () => firstGroupSegment,
      transactionSets: [transactionSet, secondTransactionSet],
    };
    const secondFunctionalGroup = {
      getId: () => "IN",
      getFirstSegment: () => firstGroupSegment,
      transactionSets: [],
    };
    const firstInterchangeSegment = new EdiSegment("ISA", 0, 7, 7, "~");
    const interchange = {
      getId: () => "0001",
      getFirstSegment: () => firstInterchangeSegment,
      functionalGroups: [functionalGroup, secondFunctionalGroup],
    };

    (EdiUtils as any).isOnlySegmentInLine = () => true;
    (EdiUtils as any).getInterchangeStartPosition = () => new vscode.Position(0, 0);
    (EdiUtils as any).getFunctionalGroupStartPosition = () => new vscode.Position(1, 0);
    (EdiUtils as any).getTransactionSetStartPosition = () => new vscode.Position(2, 0);

    const result = provider.getInterchangeCodeLenses(document, interchange as any, true);

    assert.strictEqual(result.length, 5);
    assert.deepStrictEqual(result.map(item => item.command?.title), [
      "Interchange [ID=0001]",
      "Functional Group [ID=PO]",
      "Transaction Set [ID=850]",
      "Transaction Set [ID=860]",
      "Functional Group [ID=IN]",
    ]);
  });

  test("Should skip header code lenses when a header segment is not alone on its line", () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~GS*PO*~ST*850*~", "x12");
    const firstTransactionSegment = new EdiSegment("ST", 14, 21, 7, "~");
    const transactionSet = {
      getId: () => "850",
      getFirstSegment: () => firstTransactionSegment,
      segments: [],
    };
    const firstGroupSegment = new EdiSegment("GS", 7, 13, 6, "~");
    const functionalGroup = {
      getId: () => "PO",
      getFirstSegment: () => firstGroupSegment,
      transactionSets: [transactionSet],
    };
    const firstInterchangeSegment = new EdiSegment("ISA", 0, 6, 6, "~");
    const interchange = {
      getId: () => "0001",
      getFirstSegment: () => firstInterchangeSegment,
      functionalGroups: [functionalGroup],
    };

    (EdiUtils as any).isOnlySegmentInLine = () => false;

    const result = provider.getInterchangeCodeLenses(document, interchange as any, true);

    assert.deepStrictEqual(result, []);
  });

  test("Should create loop code lenses recursively", () => {
    const document = EdiMockFactory.createMockDocument("PO1*1~\nPID*F~", "x12");
    const outerLoop = new EdiSegment("PO1Loop1", 0, 5, 6, "~");
    const childSegment = new EdiSegment("PID", 7, 12, 6, "~");
    const innerLoop = new EdiSegment("SLNLoop1", 13, 19, 7, "~");
    const innerChild = new EdiSegment("REF", 20, 25, 6, "~");
    outerLoop.Loop = [childSegment, innerLoop];
    innerLoop.Loop = [innerChild];

    (EdiUtils as any).isOnlySegmentInLine = () => true;
    (EdiUtils as any).getSegmentStartPosition = (_document: vscode.TextDocument, segment: EdiSegment) => new vscode.Position(0, segment.startIndex);

    const result = provider.getSegmentsCodeLenses(document, [outerLoop]);

    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(result.map(item => item.command?.title), ["PO1Loop1", "SLNLoop1"]);
  });

  test("Should register code lens providers for x12, edifact and vda", () => {
    const registeredLanguages: string[] = [];
    vscode.languages.registerCodeLensProvider = (
      selector: vscode.DocumentSelector,
      codeLensProvider: vscode.CodeLensProvider,
    ): vscode.Disposable => {
      const language = (selector as vscode.DocumentFilter).language;
      if (language) {
        registeredLanguages.push(language);
      }
      assert.strictEqual(codeLensProvider, provider);
      return { dispose: () => {} };
    };

    const result = provider.registerFunctions();

    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(registeredLanguages, [EdiType.X12, EdiType.EDIFACT, EdiType.VDA]);
  });
});
