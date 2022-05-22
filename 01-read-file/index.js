const fs = require("fs");
const path = require("path");
const { stdout } = process;

const filePath = path.join(__dirname, "text.txt");
const readFileStream = fs.createReadStream(filePath, "utf-8");
let data = "";
readFileStream.on("data", (chunk) => (data += chunk));
readFileStream.on("end", () => stdout.write(data));
readFileStream.on("error", (error) => stdout.write("Error", error.message));
