const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { stdin, stdout } = process;

const filePath = path.join(__dirname, "text.txt");
const writeFileStream = fs.createWriteStream(filePath);
const rl = readline.createInterface(stdin, stdout);

stdout.write("Please enter the text:\n");

rl.on("line", (input) => {
  if (input === "exit") process.exit();
  writeFileStream.write(`${input}\n`);
});
rl.on("SIGINT", () => process.exit());
process.on("exit", () => stdout.write("Good bye!\n"));

writeFileStream.on("error", (error) => stdout.write("Error", error.message));
