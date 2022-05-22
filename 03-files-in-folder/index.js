const fs = require("fs");
const path = require("path");
const { stdout } = process;

const filesDir = path.join(__dirname, "secret-folder");

fs.readdir(filesDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  for (let file of files) {
    if (!file.isFile()) continue;

    const filePath = path.join(filesDir, file.name);
    const fileExtension = path.extname(file.name).replace(/^./, "");
    const fileName = file.name.replace(`.${fileExtension}`, "");

    fs.stat(filePath, (error, stats) => {
      if (error) throw error;
      const fileSize = (stats.size / 1024).toFixed(3);
      stdout.write(`${fileName} - ${fileExtension} - ${fileSize}Kb\n`);
    });
  }
});
