import * as path from "path";

import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");
    console.log("start unit tests");
    const extensionTestsPath = path.resolve(__dirname, "./suite/unitIndex");
    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    console.error("Failed to run unit tests", err);
    process.exit(1);
  }
}

main();
