const fsPromises = require("fs").promises;
const path = require("path");

runBundlingProject();

async function runBundlingProject() {
  const bundleFolder = path.join(__dirname, "project-dist");
  const bundleAssetsFolder = path.join(bundleFolder, "assets");
  const bundleCssPath = path.join(bundleFolder, "style.css");
  const bundleHtmlPath = path.join(bundleFolder, "index.html");

  const fromAssets = path.join(__dirname, "assets");
  const fromCssFolder = path.join(__dirname, "styles");
  const fromHtmlTemplatePath = path.join(__dirname, "template.html");
  const fromHtmlComponentsFolder = path.join(__dirname, "components");

  await createFolder(bundleFolder, true); //Create project-dist folder
  await copyFolder(bundleAssetsFolder, fromAssets); //Copy assets folder
  await mergeCssFiles(fromCssFolder, bundleCssPath);
  await createIndexHtml(
    bundleHtmlPath,
    fromHtmlTemplatePath,
    fromHtmlComponentsFolder
  );
}

async function createIndexHtml(indexPath, templatePath, componentsFolder) {
  const templateFileContent = await fsPromises.readFile(templatePath, "utf-8");
  const indexFileContent = await replacePatternTag(
    templateFileContent,
    componentsFolder
  );
  await fsPromises.writeFile(indexPath, indexFileContent);
}

async function replacePatternTag(fileContent, componentsFolder) {
  const patternTags = fileContent.match(/\{{(.*?)\}}/g);
  if (!patternTags.length) return fileContent;

  for (let patternTag of patternTags) {
    const componentName = patternTag.slice(2, -2);
    const componentPath = path.join(componentsFolder, `${componentName}.html`);

    if (!(await checkAccessPath(componentPath))) continue;
    const componentContent = await fsPromises.readFile(componentPath, "utf-8");
    fileContent = fileContent.replace(patternTag, componentContent);
  }
  return fileContent;
}

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

async function copyFolder(toFolder, fromFolder) {
  await createFolder(toFolder);
  const files = await fsPromises.readdir(fromFolder, { withFileTypes: true });
  for (const file of files) {
    if (!file.isFile()) {
      const childToFolder = path.join(toFolder, file.name);
      const childFromFolder = path.join(fromFolder, file.name);
      await copyFolder(childToFolder, childFromFolder);
      continue;
    }
    const fileToPath = path.join(toFolder, file.name);
    const fileFromPath = path.join(fromFolder, file.name);
    await fsPromises.copyFile(fileFromPath, fileToPath);
  }
}

async function createFolder(folderPath, clearDir = false) {
  if ((await checkAccessPath(folderPath)) && clearDir) {
    await fsPromises.rm(folderPath, { recursive: true });
  }
  await fsPromises.mkdir(folderPath, { recursive: true });
}

async function checkAccessPath(path) {
  try {
    await fsPromises.access(path);
    return true;
  } catch (error) {
    return false;
  }
}
