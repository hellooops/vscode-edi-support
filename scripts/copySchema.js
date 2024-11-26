const fs = require("fs");
const path = require("path");

const source = path.resolve(__dirname, "../src/schemas");
const destination = path.resolve(__dirname, "../out/schemas");

const outDir = path.resolve(__dirname, "../out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (fs.existsSync(destination)) {
  console.log(`Directory ${destination} exists, deleting...`);
  fs.rmSync(destination, { recursive: true, force: true });
  console.log(`Directory ${destination} deleted.`);
}

function copyDirectory(src, dest) {
  const items = fs.readdirSync(src);

  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyDirectory(source, destination);

console.log("Schema copied successfully!");
