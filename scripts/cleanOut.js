const fs = require("fs");
const path = require("path");

const outDir = path.resolve(__dirname, "../out");

if (!fs.existsSync(outDir)) {
  console.log(`Directory ${outDir} does not exist, skipping.`);
  process.exit(0);
}

console.log(`Directory ${outDir} exists, deleting...`);
fs.rmSync(outDir, { recursive: true, force: true });
console.log(`Directory ${outDir} deleted.`);
