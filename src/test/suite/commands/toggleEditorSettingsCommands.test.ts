import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../../constants";
import { ToggleElementIndexAnnotationCommand } from "../../../commands/toggleElementIndexAnnotationCommand";
import { ToggleIndentSegmentsInLoopCommand } from "../../../commands/toggleIndentSegmentsInLoopCommand";
import { ToggleInlayHintsCommand } from "../../../commands/toggleInlayHintsCommand";
import { ToggleLoopAnnotationsCommand } from "../../../commands/toggleLoopAnnotationsCommand";
import VscodeUtils from "../../../utils/vscodeUtils";

suite("Toggle Editor Settings Commands Test Suite", () => {
  let originalActiveTextEditor: typeof vscode.window.activeTextEditor;
  let originalGetConfiguration: typeof vscode.workspace.getConfiguration;
  let originalRefreshEditor: typeof VscodeUtils.refreshEditor;

  setup(() => {
    originalActiveTextEditor = vscode.window.activeTextEditor;
    originalGetConfiguration = vscode.workspace.getConfiguration;
    originalRefreshEditor = VscodeUtils.refreshEditor;
  });

  teardown(() => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: originalActiveTextEditor,
      configurable: true,
    });
    vscode.workspace.getConfiguration = originalGetConfiguration;
    VscodeUtils.refreshEditor = originalRefreshEditor;
  });

  test("Should do nothing when there is no active editor", async () => {
    Object.defineProperty(vscode.window, "activeTextEditor", {
      value: undefined,
      configurable: true,
    });

    let updateCalled = false;
    let refreshCalled = false;
    vscode.workspace.getConfiguration = () => ({
      get: () => false,
      has: () => true,
      inspect: () => undefined,
      update: async () => {
        updateCalled = true;
      },
    }) as unknown as vscode.WorkspaceConfiguration;
    VscodeUtils.refreshEditor = async () => {
      refreshCalled = true;
    };

    const commands = [
      new ToggleInlayHintsCommand(),
      new ToggleLoopAnnotationsCommand(),
      new ToggleIndentSegmentsInLoopCommand(),
      new ToggleElementIndexAnnotationCommand(),
    ];

    for (const command of commands) {
      await command.command();
    }

    assert.strictEqual(updateCalled, false);
    assert.strictEqual(refreshCalled, false);
  });

  test("Should enable segment-name inlay hints when configuration is unset", async () => {
    await assertToggleBehavior({
      command: new ToggleInlayHintsCommand(),
      configurationKey: constants.configuration.inlayHints.segmentNames,
      initialValue: undefined,
      expectedValue: true,
    });
  });

  test("Should disable loop annotations when configuration is enabled", async () => {
    await assertToggleBehavior({
      command: new ToggleLoopAnnotationsCommand(),
      configurationKey: constants.configuration.enableLoopAnnotations,
      initialValue: true,
      expectedValue: false,
    });
  });

  test("Should enable segment indentation when configuration is unset", async () => {
    await assertToggleBehavior({
      command: new ToggleIndentSegmentsInLoopCommand(),
      configurationKey: constants.configuration.formatting.indentSegmentsInLoop,
      initialValue: undefined,
      expectedValue: true,
    });
  });

  test("Should disable VDA element index annotations when configuration is unset", async () => {
    await assertToggleBehavior({
      command: new ToggleElementIndexAnnotationCommand(),
      configurationKey: constants.configuration.enableElementIndexAnnotation,
      initialValue: undefined,
      expectedValue: false,
    });
  });
});

async function assertToggleBehavior({
  command,
  configurationKey,
  initialValue,
  expectedValue,
}: {
  command: { command: () => Promise<void> };
  configurationKey: string;
  initialValue: boolean | undefined;
  expectedValue: boolean;
}) {
  Object.defineProperty(vscode.window, "activeTextEditor", {
    value: {} as vscode.TextEditor,
    configurable: true,
  });

  const updateCalls: { key: string; value: unknown; target: vscode.ConfigurationTarget }[] = [];
  let refreshCount = 0;

  vscode.workspace.getConfiguration = () => ({
    get: (key: string) => key === configurationKey ? initialValue : undefined,
    has: (key: string) => key === configurationKey,
    inspect: () => undefined,
    update: async (key: string, value: unknown, target?: vscode.ConfigurationTarget) => {
      updateCalls.push({ key, value, target: target ?? vscode.ConfigurationTarget.Global });
    },
  }) as unknown as vscode.WorkspaceConfiguration;

  VscodeUtils.refreshEditor = async () => {
    refreshCount += 1;
  };

  await command.command();

  assert.deepStrictEqual(updateCalls, [{
    key: configurationKey,
    value: expectedValue,
    target: vscode.ConfigurationTarget.Global,
  }]);
  assert.strictEqual(refreshCount, 1);
}
