const fs = require("node:fs");
const path = require("node:path");

const packageDir = path.resolve(__dirname, "../packages/edi-parser");
const packageJsonPath = path.join(packageDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const sourceDistDir = path.join(packageDir, "dist");
const runtimePackageDir = path.resolve(__dirname, "../out/node_modules/edi-parser");
const runtimeDistDir = path.join(runtimePackageDir, "dist");
const runtimePackageJsonPath = path.join(runtimePackageDir, "package.json");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyDirectory(sourceDir, targetDir) {
  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

if (!fs.existsSync(sourceDistDir)) {
  throw new Error(`edi-parser dist not found: ${sourceDistDir}`);
}

if (fs.existsSync(runtimePackageDir)) {
  fs.rmSync(runtimePackageDir, { recursive: true, force: true });
}

copyDirectory(sourceDistDir, runtimeDistDir);

ensureDir(runtimePackageDir);
fs.writeFileSync(
  runtimePackageJsonPath,
  `${JSON.stringify(
    {
      name: packageJson.name,
      version: packageJson.version,
      main: packageJson.main,
      types: packageJson.types,
    },
    null,
    2,
  )}\n`,
);

console.log(`Copied edi-parser runtime to ${runtimePackageDir}`);
