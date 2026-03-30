const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const rootDir = path.resolve(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");
const tempDir = "C:\\temp";
const originalPackageJsonRaw = fs.readFileSync(packageJsonPath, "utf8");
const packageJson = JSON.parse(originalPackageJsonRaw);
const originalVersion = packageJson.version;

function makeTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function makeDevVersion(version) {
  const timestamp = makeTimestamp(new Date());
  const [versionWithoutBuildMetadata] = version.split("+");

  if (versionWithoutBuildMetadata.includes("-")) {
    return `${versionWithoutBuildMetadata}.dev.${timestamp}`;
  }

  return `${versionWithoutBuildMetadata}-dev.${timestamp}`;
}

function resolveCommand(commandGroups) {
  for (const group of commandGroups) {
    const result = spawnSync(group.command, group.checkArgs, {
      stdio: "ignore",
      shell: process.platform === "win32",
    });

    if (result.status === 0) {
      return group.command;
    }
  }

  return null;
}

function runOrThrow(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

const npxCommand = resolveCommand(
  process.platform === "win32"
    ? [
        { command: "npx.cmd", checkArgs: ["--version"] },
        { command: "npx", checkArgs: ["--version"] },
      ]
    : [{ command: "npx", checkArgs: ["--version"] }],
);

const codeCommand = resolveCommand(
  process.platform === "win32"
    ? [
        { command: "code.cmd", checkArgs: ["--version"] },
        { command: "code-insiders.cmd", checkArgs: ["--version"] },
        { command: "code", checkArgs: ["--version"] },
      ]
    : [
        { command: "code", checkArgs: ["--version"] },
        { command: "code-insiders", checkArgs: ["--version"] },
      ],
);

if (!npxCommand) {
  throw new Error("NPX CLI not found. Please ensure Node.js tooling is in PATH.");
}

if (!codeCommand) {
  throw new Error(
    "VS Code CLI not found. Please install the `code` command in PATH first.",
  );
}

const devVersion = makeDevVersion(originalVersion);
const devPackageJson = {
  ...packageJson,
  version: devVersion,
};
const vsixPath = path.join(tempDir, `${packageJson.name}-${devVersion}.vsix`);

fs.mkdirSync(tempDir, { recursive: true });

try {
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(devPackageJson, null, 2)}\n`);
  console.log(`Temporarily packaging extension as version ${devVersion}`);

  runOrThrow(npxCommand, ["@vscode/vsce", "package", "--out", vsixPath]);
  runOrThrow(codeCommand, ["--install-extension", vsixPath, "--force"]);
} finally {
  fs.writeFileSync(packageJsonPath, originalPackageJsonRaw);
}
