import * as path from "node:path";
import * as fsPromises from "node:fs/promises";
import { currentDirectory, setCurrentDirectory } from "./index.js";

const add = async (args) => {
  const filePath = path.resolve(currentDirectory, args.join(" "));
  try {
    await fsPromises.writeFile(filePath, "", { flag: "wx" });
    console.log(`File "${args.join(" ")}" created successfully.`);
  } catch (err) {
    console.error(`Failed to create file "${args.join(" ")}":`, err);
    throw new Error("Operation failed");
  }
};
export default add;
