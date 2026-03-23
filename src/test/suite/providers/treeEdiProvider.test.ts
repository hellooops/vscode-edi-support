import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../../constants";
import { EdiDocument, EdiDocumentSeparators, EdiElement, EdiFunctionalGroup, EdiInterchange, EdiSegment, EdiTransactionSet, EdiType, ElementType } from "../../../parser/entities";
import { TreeEdiProvider } from "../../../providers/treeEdiProvider";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("TreeEdiProvider Test Suite", () => {
  let provider: TreeEdiProvider;
  let originalActiveTextEditor: typeof vscode.window.activeTextEditor;
  let originalCreateTreeView: typeof vscode.window.createTreeView;
  let originalOnDidChangeActiveTextEditor: typeof vscode.window.onDidChangeActiveTextEditor;
  let originalOnDidChangeTextDocument: typeof vscode.workspace.onDidChangeTextDocument;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalIsX12: typeof EdiUtils.isX12;
  let originalIsEdifact: typeof EdiUtils.isEdifact;
  let originalIsVda: typeof EdiUtils.isVda;

  setup(() => {
    provider = new TreeEdiProvider();
    originalActiveTextEditor = vscode.window.activeTextEditor;
    originalCreateTreeView = vscode.window.createTreeView;
    originalOnDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor;
    originalOnDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument;
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalIsX12 = EdiUtils.isX12;
    originalIsEdifact = EdiUtils.isEdifact;
    originalIsVda = EdiUtils.isVda;
  });

  teardown(() => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: originalActiveTextEditor,
      configurable: true,
    });
    vscode.window.createTreeView = originalCreateTreeView;
    (vscode.window as any).onDidChangeActiveTextEditor = originalOnDidChangeActiveTextEditor;
    (vscode.workspace as any).onDidChangeTextDocument = originalOnDidChangeTextDocument;
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).isX12 = originalIsX12;
    (EdiUtils as any).isEdifact = originalIsEdifact;
    (EdiUtils as any).isVda = originalIsVda;
  });

  test("Should return document children for separators segment and interchange", async () => {
    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
    const ediDocument = createTreeDocument();

    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: { document },
      configurable: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ediDocument,
      },
      ediType: EdiType.X12,
    });

    const result = await provider.getChildren();

    assert.ok(result);
    assert.strictEqual(result.length, 2);

    const separatorsItem = await provider.getTreeItem(result[0] as any);
    const interchangeItem = await provider.getTreeItem(result[1] as any);
    assert.strictEqual(separatorsItem.label, "ISA");
    assert.strictEqual(interchangeItem.label, "Interchange");
    assert.strictEqual(interchangeItem.description, "0001");
  });

  test("Should return empty root children when editor or parser context is unavailable", async () => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: undefined,
      configurable: true,
    });

    let result = await provider.getChildren();
    assert.deepStrictEqual(result, []);

    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: { document },
      configurable: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: undefined,
      ediType: EdiType.X12,
    });

    result = await provider.getChildren();
    assert.deepStrictEqual(result, []);

    (EdiUtils as any).getEdiParser = () => ({
      parser: { parse: async () => undefined },
      ediType: EdiType.X12,
    });
    result = await provider.getChildren();
    assert.deepStrictEqual(result, []);

    (EdiUtils as any).getEdiParser = () => ({
      parser: { parse: async () => createTreeDocument() },
      ediType: EdiType.UNKNOWN,
    });
    result = await provider.getChildren();
    assert.deepStrictEqual(result, []);
  });

  test("Should walk from segment to composite element attributes", async () => {
    const ediDocument = createTreeDocument();
    const document = EdiMockFactory.createMockDocument("ISA*00*~", "x12");
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: { document },
      configurable: true,
    });
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ediDocument,
      },
      ediType: EdiType.X12,
    });

    const rootChildren = await provider.getChildren();
    assert.ok(rootChildren && rootChildren.length >= 2);

    const interchangeChildren = await provider.getChildren(rootChildren![1] as any);
    assert.strictEqual(interchangeChildren!.length, 3);

    const functionalGroupChildren = await provider.getChildren(interchangeChildren![1] as any);
    assert.strictEqual(functionalGroupChildren!.length, 3);

    const transactionSetChildren = await provider.getChildren(functionalGroupChildren![1] as any);
    const segmentItem = transactionSetChildren!.find(item => (item as any).segment?.id === "BEG");
    assert.ok(segmentItem);

    const dataElementChildren = await provider.getChildren(segmentItem as any);
    assert.strictEqual(dataElementChildren!.length, 1);

    const componentChildren = await provider.getChildren(dataElementChildren![0] as any);
    assert.strictEqual(componentChildren!.length, 1);

    const attributeChildren = await provider.getChildren(componentChildren![0] as any);
    assert.ok(attributeChildren && attributeChildren.length > 0);

    const componentTreeItem = await provider.getTreeItem(componentChildren![0] as any);
    assert.strictEqual(componentTreeItem.label, "BEG01(C002)");
    assert.strictEqual(componentTreeItem.description, "Qualifier");
  });

  test("Should return loop children and simple element attributes", async () => {
    const loopSegment = new EdiSegment("PO1Loop1", 0, 5, 6, "~");
    const childSegment = new EdiSegment("PID", 6, 12, 7, "~");
    loopSegment.Loop = [childSegment];

    const loopChildren = await provider.getChildren({
      key: loopSegment.key,
      type: 4 as any,
      segment: loopSegment,
    } as any);
    assert.strictEqual(loopChildren!.length, 1);
    assert.strictEqual((loopChildren![0] as any).segment.id, "PID");

    const parentSegment = new EdiSegment("REF", 0, 10, 11, "~");
    const simpleElement = new EdiElement(parentSegment, ElementType.dataElement, 1, 3, "*", "REF", parentSegment.startIndex, "01");
    simpleElement.ediReleaseSchemaElement = {
      id: "128",
      desc: "Reference qualifier",
      dataType: "ID",
      required: true,
      minLength: 2,
      maxLength: 3,
      qualifierRef: "Reference identification qualifier",
      definition: "Code qualifying the reference identification.",
      length: 2,
    } as any;

    const attributeChildren = await provider.getChildren({
      key: simpleElement.key,
      type: 5 as any,
      segment: parentSegment,
      element: simpleElement,
    } as any);

    assert.ok(attributeChildren && attributeChildren.length >= 8);
    const labels = await Promise.all(attributeChildren!.map(async item => (await provider.getTreeItem(item as any)).label));
    assert.ok(labels.includes("Id"));
    assert.ok(labels.includes("Description"));
    assert.ok(labels.includes("Qualifier Ref"));
  });

  test("Should refresh on command and reject unsupported tree item types", async () => {
    let refreshCount = 0;
    provider.refresh = () => {
      refreshCount++;
      return undefined as any;
    };

    provider.command();
    assert.strictEqual(refreshCount, 1);

    await assert.rejects(
      async () => provider.getTreeItem({ key: "x", type: 999 } as any),
      /Unknown tree item type/,
    );
  });

  test("Should throw for getParent because it is not implemented", () => {
    assert.throws(
      () => provider.getParent!({ key: "x", type: 0 } as any),
      new RegExp(constants.errors.methodNotImplemented),
    );
  });

  test("Should refresh only for supported documents", () => {
    let refreshCount = 0;
    provider.refresh = () => {
      refreshCount++;
    };
    (EdiUtils as any).isX12 = (document: vscode.TextDocument) => document.languageId === EdiType.X12;
    (EdiUtils as any).isEdifact = () => false;
    (EdiUtils as any).isVda = () => false;

    provider.onTextChange({ document: EdiMockFactory.createMockDocument("ISA*00*~", "x12") });
    provider.onTextChange({ document: EdiMockFactory.createMockDocument("text", "plaintext") });
    provider.onTextChange(undefined);

    assert.strictEqual(refreshCount, 1);
  });

  test("Should register tree view and listeners", () => {
    let activeEditorListenerRegistered = false;
    let textDocumentListenerRegistered = false;
    let createTreeViewCalled = false;

    (vscode.window as any).onDidChangeActiveTextEditor = () => {
      activeEditorListenerRegistered = true;
      return { dispose: () => {} };
    };
    (vscode.workspace as any).onDidChangeTextDocument = () => {
      textDocumentListenerRegistered = true;
      return { dispose: () => {} };
    };
    vscode.window.createTreeView = (viewId: string, options: vscode.TreeViewOptions<any>) => {
      createTreeViewCalled = true;
      assert.strictEqual(viewId, constants.explorers.treeExplorerId);
      assert.strictEqual(options.treeDataProvider, provider);
      assert.strictEqual(options.showCollapseAll, true);
      return { dispose: () => {} } as vscode.TreeView<any>;
    };

    const result = provider.registerFunctions();

    assert.strictEqual(result.length, 1);
    assert.strictEqual(createTreeViewCalled, true);
    assert.strictEqual(activeEditorListenerRegistered, true);
    assert.strictEqual(textDocumentListenerRegistered, true);
  });
});

function createTreeDocument(): EdiDocument {
  const separators = new EdiDocumentSeparators();
  separators.segmentSeparator = "~";
  separators.dataElementSeparator = "*";
  const ediDocument = new EdiDocument(separators, {
    interchangeStartSegmentName: "ISA",
    interchangeEndSegmentName: "IEA",
    functionalGroupStartSegmentName: "GS",
    functionalGroupEndSegmentName: "GE",
    transactionSetStartSegmentName: "ST",
    transactionSetEndSegmentName: "SE",
  });

  const separatorsSegment = new EdiSegment("ISA", 0, 8, 9, "~");
  const interchange = new EdiInterchange({ id: "0001" }, ediDocument);
  const functionalGroup = new EdiFunctionalGroup({ id: "1" }, interchange);
  const transactionSet = new EdiTransactionSet({ id: "0001" }, functionalGroup);

  const gs = new EdiSegment("GS", 9, 14, 6, "~");
  const beg = new EdiSegment("BEG", 15, 25, 11, "~");
  beg.ediReleaseSchemaSegment = { desc: "Beginning Segment" } as any;
  const composite = new EdiElement(beg, ElementType.dataElement, 3, 9, "*", "BEG", beg.startIndex, "01");
  composite.value = "AA";
  composite.ediReleaseSchemaElement = {
    id: "C002",
    desc: "Qualifier",
    dataType: "AN",
    required: true,
    minLength: 2,
  } as any;
  const component = new EdiElement(beg, ElementType.componentElement, 3, 5, "*", "BEG", beg.startIndex, "01");
  component.ediReleaseSchemaElement = composite.ediReleaseSchemaElement;
  component.value = "AA";
  composite.components = [component];
  beg.elements = [composite];

  const se = new EdiSegment("SE", 26, 31, 6, "~");
  const ge = new EdiSegment("GE", 32, 37, 6, "~");
  const iea = new EdiSegment("IEA", 38, 44, 7, "~");

  ediDocument.separatorsSegment = separatorsSegment;
  interchange.startSegment = separatorsSegment;
  interchange.endSegment = iea;
  interchange.functionalGroups.push(functionalGroup);
  functionalGroup.startSegment = gs;
  functionalGroup.endSegment = ge;
  functionalGroup.transactionSets.push(transactionSet);
  transactionSet.startSegment = new EdiSegment("ST", 45, 50, 6, "~");
  transactionSet.segments.push(beg);
  transactionSet.endSegment = se;
  ediDocument.interchanges.push(interchange);

  return ediDocument;
}
