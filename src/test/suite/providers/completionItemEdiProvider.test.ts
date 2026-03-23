import * as assert from "assert";
import * as vscode from "vscode";

import { EdiElement, EdiSegment, EdiType, ElementType } from "../../../parser/entities";
import { CompletionItemEdiProvider } from "../../../providers/completionItemEdiProvider";
import { EdiUtils } from "../../../utils/ediUtils";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("CompletionItemEdiProvider Test Suite", () => {
  let provider: CompletionItemEdiProvider;
  let originalGetEdiParser: typeof EdiUtils.getEdiParser;
  let originalGetSegmentOrElementByPosition: typeof EdiUtils.getSegmentOrElementByPosition;
  let originalRegisterCompletionItemProvider: typeof vscode.languages.registerCompletionItemProvider;

  setup(() => {
    provider = new CompletionItemEdiProvider();
    originalGetEdiParser = EdiUtils.getEdiParser;
    originalGetSegmentOrElementByPosition = EdiUtils.getSegmentOrElementByPosition;
    originalRegisterCompletionItemProvider = vscode.languages.registerCompletionItemProvider;
  });

  teardown(() => {
    (EdiUtils as any).getEdiParser = originalGetEdiParser;
    (EdiUtils as any).getSegmentOrElementByPosition = originalGetSegmentOrElementByPosition;
    vscode.languages.registerCompletionItemProvider = originalRegisterCompletionItemProvider;
  });

  test("Should return empty array when parser is unavailable", async () => {
    (EdiUtils as any).getEdiParser = () => ({ parser: undefined });

    const result = await provider.provideCompletionItems(
      EdiMockFactory.createMockDocument("BEG*00~", "x12"),
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
      { triggerKind: vscode.CompletionTriggerKind.Invoke } as vscode.CompletionContext,
    );

    assert.deepStrictEqual(result, []);
  });

  test("Should return empty array when parse result is empty or no segment is resolved", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00~", "x12");

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => undefined,
      },
    });

    let result = await provider.provideCompletionItems(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
      { triggerKind: vscode.CompletionTriggerKind.Invoke } as vscode.CompletionContext,
    );

    assert.deepStrictEqual(result, []);

    const segment = new EdiSegment("BEG", 0, 5, 6, "~");
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        schema: {
          ediReleaseSchema: {
            segments: {
              BEG: { desc: "Beginning Segment", purpose: "Starts a transaction" },
            },
          },
        },
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment: undefined, element: undefined });

    result = await provider.provideCompletionItems(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
      { triggerKind: vscode.CompletionTriggerKind.Invoke } as vscode.CompletionContext,
    );

    assert.deepStrictEqual(result, []);
  });

  test("Should return segment completion items when cursor is on a segment", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00~", "x12");
    const segment = new EdiSegment("BEG", 0, 5, 6, "~");
    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        schema: {
          ediReleaseSchema: {
            segments: {
              BEG: { desc: "Beginning Segment", purpose: "Starts a transaction" },
              REF: { desc: "Reference Segment", purpose: "Carries references" },
            },
          },
        },
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment });

    const result = await provider.provideCompletionItems(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
      { triggerKind: vscode.CompletionTriggerKind.Invoke } as vscode.CompletionContext,
    ) as vscode.CompletionItem[];

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].label, "BEG");
    assert.strictEqual(result[0].detail, "Beginning Segment");
    assert.strictEqual(result[0].documentation, "Starts a transaction");
    assert.strictEqual(result[0].keepWhitespace, true);
  });

  test("Should return empty segment completion items when schema is missing or has no segments", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00~", "x12");
    const segment = new EdiSegment("BEG", 0, 5, 6, "~");

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        schema: undefined,
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment });

    let result = await provider.provideCompletionItems(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
      { triggerKind: vscode.CompletionTriggerKind.Invoke } as vscode.CompletionContext,
    );

    assert.deepStrictEqual(result, []);

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        schema: {
          ediReleaseSchema: {},
        },
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
    });

    result = await provider.provideCompletionItems(
      document,
      new vscode.Position(0, 0),
      EdiMockFactory.createMockCancellationToken(),
      { triggerKind: vscode.CompletionTriggerKind.Invoke } as vscode.CompletionContext,
    );

    assert.deepStrictEqual(result, []);
  });

  test("Should return element completion items when cursor is on a qualifier element", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00~", "x12");
    const segment = new EdiSegment("BEG", 0, 5, 6, "~");
    const element = new EdiElement(segment, ElementType.dataElement, 3, 5, "*", "BEG", 0, "01");
    element.ediReleaseSchemaElement = {
      getCodes: () => [
        { value: "00", desc: "Original" },
        { value: "05", desc: "Replace" },
      ],
    } as any;

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment, element });

    const result = await provider.provideCompletionItems(
      document,
      new vscode.Position(0, 4),
      EdiMockFactory.createMockCancellationToken(),
      { triggerKind: vscode.CompletionTriggerKind.TriggerCharacter, triggerCharacter: "*" } as vscode.CompletionContext,
    ) as vscode.CompletionItem[];

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].label, "00");
    assert.strictEqual(result[0].detail, "Original");
    assert.strictEqual(result[0].documentation, "Original");
    assert.strictEqual(result[0].keepWhitespace, true);
  });

  test("Should return empty element completion items when qualifier codes are unavailable", async () => {
    const document = EdiMockFactory.createMockDocument("BEG*00~", "x12");
    const segment = new EdiSegment("BEG", 0, 5, 6, "~");
    const element = new EdiElement(segment, ElementType.dataElement, 3, 5, "*", "BEG", 0, "01");
    element.ediReleaseSchemaElement = {
      getCodes: () => undefined,
    } as any;

    (EdiUtils as any).getEdiParser = () => ({
      parser: {
        parse: async () => ({
          getSegments: () => [segment],
        }),
      },
    });
    (EdiUtils as any).getSegmentOrElementByPosition = () => ({ segment, element });

    const result = await provider.provideCompletionItems(
      document,
      new vscode.Position(0, 4),
      EdiMockFactory.createMockCancellationToken(),
      { triggerKind: vscode.CompletionTriggerKind.Invoke } as vscode.CompletionContext,
    );

    assert.deepStrictEqual(result, []);
  });

  test("Should resolve completion item by returning the same instance", () => {
    const item = new vscode.CompletionItem("BEG", vscode.CompletionItemKind.Value);
    assert.strictEqual(provider.resolveCompletionItem!(item, EdiMockFactory.createMockCancellationToken()), item);
  });

  test("Should register completion providers for x12 and edifact", () => {
    const registrations: Array<{ language?: string; triggers: string[] }> = [];
    vscode.languages.registerCompletionItemProvider = (
      selector: vscode.DocumentSelector,
      completionItemProvider: vscode.CompletionItemProvider,
      ...triggerCharacters: string[]
    ): vscode.Disposable => {
      registrations.push({
        language: (selector as vscode.DocumentFilter).language,
        triggers: triggerCharacters,
      });
      assert.strictEqual(completionItemProvider, provider);
      return { dispose: () => {} };
    };

    const result = provider.registerFunctions();

    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(registrations, [
      { language: EdiType.X12, triggers: ["*", "+", ":"] },
      { language: EdiType.EDIFACT, triggers: ["*", "+", ":"] },
    ]);
  });
});
