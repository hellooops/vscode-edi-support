const fs = require("fs");
const path = require("path");

const sourceRoot = path.resolve(__dirname, "../src/schemas");
const targetRoot = path.resolve(__dirname, "../dist/schemas");

function removeDirectory(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function copyDirectory(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) {
    return;
  }

  fs.mkdirSync(targetPath, { recursive: true });

  for (const entry of fs.readdirSync(sourcePath, { withFileTypes: true })) {
    const nextSourcePath = path.join(sourcePath, entry.name);
    const nextTargetPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(nextSourcePath, nextTargetPath);
      continue;
    }

    fs.copyFileSync(nextSourcePath, nextTargetPath);
  }
}

removeDirectory(targetRoot);
copyDirectory(sourceRoot, targetRoot);
