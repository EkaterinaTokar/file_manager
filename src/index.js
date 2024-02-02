// import process from "node:process";
import * as url from "node:url";
import os from "node:os";
import * as path from "node:path";
import readline from "node:readline";
import fs from "fs";
import * as fsPromises from "node:fs/promises";
import crypto from "node:crypto";
import zlib from "node:zlib";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

const args = process.argv.slice(2);
const username = args[0].split("=")[1];
const promptCommand = () => {
  rl.prompt();
  rl.on("line", async (line) => {
    const [command, ...args] = line.trim().split(" ");
    if (line === "up") {
      try {
        await fsPromises.access(path.resolve(process.cwd(), ".."));
        process.chdir("..");
        console.log(`You are currently in ${process.cwd()}`);
      } catch (error) {
        console.error("Failed to go up:", error.message);
      }
    } else if (command === "cd") {
      const targetDirectory = path.resolve(process.cwd(), args.join(" "));
      try {
        await fsPromises.access(targetDirectory, fs.F_OK);
        process.chdir(targetDirectory);
        console.log(`You are currently in ${process.cwd()}`);
      } catch (error) {
        console.error("Failed to change directory:", error.message);
      }
    } else if (line === "ls") {
      try {
        const files = await fsPromises.readdir(".");
        const allItems = [];

        for (const file of files) {
          const fullPath = path.join(process.cwd(), file);
          const stats = await fsPromises.stat(fullPath);
          const itemType = stats.isDirectory() ? "directory" : "file";
          allItems.push({ name: file, type: itemType });
        }

        allItems.sort((a, b) => a.type.localeCompare(b.type));

        console.log("All files and folders in current directory:");
        console.table(allItems);
        console.log(`You are currently in ${process.cwd()}`);
      } catch (err) {
        console.error("Error reading directory:", err);
      }
    } else if (command === "cat") {
      const filePath = path.resolve(process.cwd(), args.join(" "));
      try {
        const readStream = await fsPromises.readFile(filePath, "utf-8");
        console.log(readStream);
        console.log("File reading complete.");
        console.log(`You are currently in ${process.cwd()}`);
      } catch (error) {
        console.error("Error reading file:", error.message);
      }
    } else if (command === "add") {
      const filePath = path.resolve(process.cwd(), args.join(" "));
      await fsPromises.writeFile(filePath, "", { flag: "wx" }, (err) => {
        if (err) {
          console.error(`Failed to create file "${args.join(" ")}":`, err);
        } else {
          console.log(`File "${args.join(" ")}" created successfully.`);
        }
        console.log(`You are currently in ${process.cwd()}`);
      });
    } else if (command === "rn") {
      const oldPath = args.slice(0, -1).join(" ");
      console.log(oldPath);
      const newFileName = args[args.length - 1];
      const folderPath = path.dirname(oldPath);
      console.log(folderPath);
      const newPath = path.resolve(folderPath, newFileName);
      console.log(newPath);
      try {
        await fsPromises.rename(oldPath, newPath);
        console.log("File renamed successfully.");
        console.log(`You are currently in ${process.cwd()}`);
      } catch (error) {
        console.error(`Failed to rename file: ${error.message}`);
      }
    } else if (command === "cp") {
      const [file, directory] = args;

      try {
        const pathToFile = path.resolve(file);
        const pathToNewDirectory = path.resolve(directory);

        const stats = await fsPromises.stat(pathToNewDirectory);
        const isDirectory = stats.isDirectory();

        const fileName = isDirectory
          ? path.basename(pathToFile)
          : path.basename(pathToNewDirectory);

        const destinationFile = path.join(pathToNewDirectory, fileName);

        const readStream = fs.createReadStream(pathToFile);
        const writeStream = fs.createWriteStream(pathToNewDirectory);

        readStream.on("error", (err) => {
          console.error(`Failed to copy file: ${err}`);
        });

        writeStream.on("error", (err) => {
          console.error(`Failed to copy file: ${err}`);
        });

        writeStream.on("finish", () => {
          console.log("File copied successfully.");
          console.log(`You are currently in ${process.cwd()}`);
        });

        readStream.pipe(writeStream);
      } catch (error) {
        console.error(`Failed to copy file: ${error.message}`);
      }
    } else if (command === "mv") {
      const [file, directory] = args;
      try {
        const pathToFile = path.resolve(file);
        const pathToNewDirectory = path.resolve(directory);

        const stats = await fs.promises.stat(pathToNewDirectory);
        const isDirectory = stats.isDirectory();

        const fileName = isDirectory
          ? path.basename(pathToFile)
          : path.basename(pathToNewDirectory);

        const destinationFile = path.join(pathToNewDirectory, fileName);

        const readStream = fs.createReadStream(pathToFile);
        const writeStream = fs.createWriteStream(pathToNewDirectory);

        readStream.on("error", (err) => {
          console.error(`Failed to move file: ${err}`);
        });

        writeStream.on("error", (err) => {
          console.error(`Failed to move file: ${err}`);
        });

        writeStream.on("finish", async () => {
          console.log("File moved successfully.");
          console.log(`You are currently in ${process.cwd()}`);

          try {
            await fsPromises.unlink(sourcePath);
            console.log("File deleted successfully.");
            console.log(`You are currently in ${process.cwd()}`);
          } catch (error) {
            console.error(`Failed to delete original file: ${error.message}`);
          }
        });

        readStream.pipe(writeStream);
      } catch (error) {
        console.error(`Failed to move file: ${error.message}`);
      }
    } else if (command === "rm") {
      const [filePath] = args;
      try {
        const resolvedPath = path.resolve(filePath);
        await fsPromises.unlink(resolvedPath);
        console.log(`File ${resolvedPath} deleted successfully.`);
        console.log(`You are currently in ${process.cwd()}`);
      } catch (error) {
        console.error(`Failed to delete file: ${error.message}`);
      }
    } else if (command === "os") {
      console.log(`Default End-Of-Line (EOL): ${os.EOL}`);
      const cpus = os.cpus();
      console.log("Host machine CPUs info:");
      cpus.forEach((cpu, index) => {
        console.log(`CPU ${index + 1}:`);
        console.log(`  Model: ${cpu.model}`);
        console.log(`  Clock rate: ${cpu.speed} GHz`);
      });
      console.log(`Overall amount of CPUs: ${cpus.length}`);
      console.log(`Home directory: ${os.homedir()}`);
      console.log(`Current system user name: ${os.userInfo().username}`);
      console.log(
        `CPU architecture for which Node.js binary has compiled: ${os.arch()}`
      );
      console.log(`You are currently in ${process.cwd()}`);
    } else if (command === "hash") {
      const [command, filename] = line.trim().split(" ");

      const hash = crypto.createHash("sha256");

      const input = fs.createReadStream(filename);
      input.on("readable", () => {
        const data = input.read();
        if (data) hash.update(data);
        else {
          console.log(`${hash.digest("hex")} ${filename}`);
        }
      });
      console.log(`You are currently in ${process.cwd()}`);
    }
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
  promptCommand();
};
startProgram();
