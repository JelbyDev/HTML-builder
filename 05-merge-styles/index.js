const fsPromises = require("fs").promises;
const path = require("path");

const cssFilesDir = path.join(__dirname, "styles");
const cssBundlePath = path.join(__dirname, "project-dist", "bundle.css");
mergeCssFiles(cssFilesDir, cssBundlePath);

async function mergeCssFiles(filesDir, bundlePath) {
  if (await checkAccessPath(filesDir)) {
    const files = await fsPromises.readdir(filesDir, { withFileTypes: true });
    let bundleFileContent = "";
    for (let file of files) {
      if (!file.isFile() || path.extname(file.name) !== ".css") continue;
      const filePath = path.join(filesDir, file.name);
      bundleFileContent +=
        (await fsPromises.readFile(filePath, "utf-8")) + "\n";
    }
    await fsPromises.writeFile(bundlePath, bundleFileContent);
  }
}

async function checkAccessPath(path) {
  try {
    await fsPromises.access(path);
    return true;
  } catch (error) {
    return false;
  }
}
