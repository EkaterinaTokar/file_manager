import * as path from "node:path";
import * as fsPromises from "node:fs/promises";
import fs from "fs";
import { currentDirectory, setCurrentDirectory } from "./index.js";

const copy = async (args) => {
  const file = args[0];
  const directory = args.slice(1).join(" ");

  try {
    const pathToFile = path.resolve(file);
    const pathToNewDirectory = path.resolve(directory);

    const stats = await fsPromises.stat(pathToNewDirectory);
    const isDirectory = stats.isDirectory();

    const fileName = isDirectory
      ? path.basename(pathToFile)
      : path.basename(pathToNewDirectory);

    const newPath = path.join(pathToNewDirectory, fileName);

    const readStream = fs.createReadStream(pathToFile);
    const writeStream = fs.createWriteStream(newPath);

    readStream.on("error", (err) => {
      console.error(`Failed to copy file: ${err}`);
    });

    writeStream.on("error", (err) => {
      console.error(`Failed to copy file: ${err}`);
    });

    writeStream.on("finish", () => {
      console.log("File copied successfully.");
    });

    readStream.pipe(writeStream);
  } catch (error) {
    console.error(`Failed to copy file: ${error.message}`);
  }
};
export default copy;
