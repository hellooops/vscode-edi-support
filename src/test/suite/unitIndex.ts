import * as path from "path";
import * as Mocha from "mocha";
import * as glob from "glob";

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "..");
  const patterns = [
    "suite/parser/**/*.test.js",
    "suite/utils/utils.test.js",
    "suite/edi-comments.test.js",
    "suite/edifact.test.js",
    "suite/extension.test.js",
    "suite/vda.test.js",
    "suite/x12.test.js",
  ];

  return new Promise((c, e) => {
    try {
      const files = patterns.flatMap(pattern => glob.sync(pattern, { cwd: testsRoot }));
      files.forEach(file => mocha.addFile(path.resolve(testsRoot, file)));

      mocha.run(failures => {
        if (failures > 0) {
          e(new Error(`${failures} tests failed.`));
        } else {
          c();
        }
      });
    } catch (err) {
      console.error(err);
      e(err);
    }
  });
}
