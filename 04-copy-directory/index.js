const fsPromises = require("fs").promises;
const path = require("path");

const fromDir = path.join(__dirname, "files");
const toDir = path.join(__dirname, "files-copy");

copyDir(toDir, fromDir, true);

async function copyDir(toDir, fromDir, clearDir = false) {
  await createFolder(toDir, clearDir);
  const files = await fsPromises.readdir(fromDir, { withFileTypes: true });
  for (const file of files) {
    if (!file.isFile()) {
      const childToDir = path.join(toDir, file.name);
      const childFromDir = path.join(fromDir, file.name);
      await copyDir(childToDir, childFromDir);
      continue;
    }
    const fileToPath = path.join(toDir, file.name);
    const fileFromPath = path.join(fromDir, file.name);
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
