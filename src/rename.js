import * as path from "node:path";
import * as fsPromises from "node:fs/promises";
import { currentDirectory, setCurrentDirectory } from "./index.js";

const rename = async (args) => {
  try {
    const oldPath = args.slice(0, -1).join(" ");
    const newFileName = args[args.length - 1];
    const folderPath = path.dirname(oldPath);
    const newPath = path.resolve(folderPath, newFileName);

    await fsPromises.rename(oldPath, newPath);
    console.log("File renamed successfully.");
  } catch (error) {
    console.error(`Failed to rename file: ${error.message}`);
  }
};
export default rename;
