import * as assert from "assert";
import * as vscode from "vscode";

import * as constants from "../../../constants";
import { AddCodeToQualifierCommand } from "../../../commands/addCodeToQualifierCommand";
import { EdiMockFactory } from "../mocks/ediMockFactory";

suite("AddCodeToQualifierCommand Test Suite", () => {
  let originalGetConfiguration: typeof vscode.workspace.getConfiguration;

  setup(() => {
    originalGetConfiguration = vscode.workspace.getConfiguration;
  });

  teardown(() => {
    vscode.workspace.getConfiguration = originalGetConfiguration;
  });

  test("Should do nothing when release is empty", async () => {
    let updateCalled = false;
    vscode.workspace.getConfiguration = () => ({
      ...EdiMockFactory.createMockConfiguration({}),
      update: async () => {
        updateCalled = true;
      },
    }) as vscode.WorkspaceConfiguration;

    const command = new AddCodeToQualifierCommand();
    await command.command("edifact", "" as any, "Identification code qualifier", "ZZ", "<Custom code>");

    assert.strictEqual(updateCalled, false);
  });

  test("Should write EDIFACT service qualifiers under _service", async () => {
    let updatedValue: unknown;
    vscode.workspace.getConfiguration = () => ({
      ...EdiMockFactory.createMockConfiguration({
        [constants.configuration.customSchemas]: {},
      }),
      update: async (_key: string, value: unknown) => {
        updatedValue = value;
      },
    }) as vscode.WorkspaceConfiguration;

    const command = new AddCodeToQualifierCommand();
    await command.command("edifact", "_service" as any, "Identification code qualifier", "ZZ", "<Custom code>");

    assert.deepStrictEqual(updatedValue, {
      edifact: {
        _service: {
          qualifiers: {
            "Identification code qualifier": {
              ZZ: "<Custom code>",
            },
          },
        },
      },
    });
  });
});
