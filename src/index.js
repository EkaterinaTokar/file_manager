// import process from "node:process";
import * as url from "node:url";
import os from "node:os";
import * as path from "node:path";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

const args = process.argv.slice(2);
const username = args[0].split("=")[1];
const promptCommand = () => {
  rl.prompt();
  rl.on("line", (line) => {
    const [command, argument] = line.trim().split(" ");
    console.log(command);
    console.log(argument);
    if (line === "up") {
      process.chdir(`../`);
      console.log("working directory after " + "changing: " + process.cwd());
    } else if (command === "cd") {
      const absolutePath = path.resolve(process.cwd(), argument);
      console.log(`absolutePath: ${absolutePath}`);
      try {
        process.chdir(absolutePath);
        console.log("Working directory after changing: " + process.cwd());
      } catch (error) {
        console.error("Failed to change directory:", error.message);
      }
      // process.chdir(absolutePath);
      // console.log("Working directory after changing: " + process.cwd());
    }

    //process.chdir(`../${line}`);
    // console.log("working directory after " + "changing: " + process.cwd());
    process.on("exit", (code) => {
      console.log(`Thank you for using File Manager, ${username}, goodbye!`);
      process.exit();
    });
    process.on("SIGINT", () => {
      console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    });
    rl.prompt();
  });
};
const startProgram = () => {
  console.log(`Welcome to the File Manager, ${username}!`);
  const cwd = process.cwd();
  console.log(`You are currently in ${cwd}`);
  //console.log(url.fileURLToPath(new URL(import.meta.url)));
  //console.log(`Starting working directory is ${os.homedir()}`);
  promptCommand();
};
startProgram();
