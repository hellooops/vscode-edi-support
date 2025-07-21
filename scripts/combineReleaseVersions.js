const fs = require("fs");
const path = require("path");


function copyStandard(standardPath, destinationDir) {
  standardName = path.basename(standardPath);
  const standardDestPath = path.join(destinationDir, standardName);
  const dirs = fs.readdirSync(standardPath);
  const releaseNames = dirs.filter(releaseName => {
    const releasePath = path.join(standardPath, releaseName);
    return fs.statSync(releasePath).isDirectory() && !releaseName.startsWith(".");
  });

  for (const releaseName of releaseNames) {
    const releasePath = path.join(standardPath, releaseName);
    const releaseDestPath = path.join(standardDestPath, releaseName);
    if (!fs.existsSync(releaseDestPath)) {
      fs.mkdirSync(releaseDestPath, { recursive: true });
    }

    const releaseFilePath = path.join(releasePath, `${releaseName}.json`);
    fs.copyFileSync(releaseFilePath, path.join(releaseDestPath, `${releaseName}.json`));

    // 00401_versions.json
    // {
    //   "Release": "00401",
    //   "DocumentTypes": {
    //     "00401_100": the content of releasePath/releasePath_100.json,
    //     "00401_101": the content of releasePath/releasePath_101.json,
    //   }
    // }

    const jsonFiles = fs.readdirSync(releasePath).filter(file => {
      return file.endsWith(".json") && file !== `${releaseName}.json`;
    });
    const combinedData = {
      Release: releaseName,
      DocumentTypes: {}
    };
    jsonFiles.forEach(file => {
      const filePath = path.join(releasePath, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const fileNameWithoutExt = path.basename(file, ".json");
      combinedData.DocumentTypes[fileNameWithoutExt] = JSON.parse(fileContent);
    });
    const combinedFilePath = path.join(releaseDestPath, `${releaseName}_versions.json`);
    fs.writeFileSync(combinedFilePath, JSON.stringify(combinedData, null, 0));
    console.log(`Copied and combined files for ${releaseName} to ${releaseDestPath}`);
  }
}

function copyTargets(schemaDir, destinationDir) {
  const dirs = fs.readdirSync(schemaDir).filter(dir => {
    const dirPath = path.join(schemaDir, dir);
    return fs.statSync(dirPath).isDirectory() && !dir.startsWith(".");
  });

  for (const dir of dirs) {
    copyStandard(path.join(schemaDir, dir), destinationDir);
  }
}

copyTargets(source, destination);
