import * as path from "node:path";
import * as fsPromises from "node:fs/promises";
import { currentDirectory, setCurrentDirectory } from "./index.js";

const cat = async (args) => {
  const filePath = path.resolve(currentDirectory, args.join(" "));
  try {
    const readStream = await fsPromises.readFile(filePath, "utf-8");
    console.log(readStream);
    console.log("File reading complete.");
  } catch (error) {
    console.error("Error reading file:", error.message);
    throw new Error("Operation failed");
  }
};
export default cat;
