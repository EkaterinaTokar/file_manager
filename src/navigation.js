import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import fs from "fs";
import { currentDirectory, setCurrentDirectory } from "./index.js";

export const up = async () => {
  const parentDirectory = path.dirname(currentDirectory);
  if (currentDirectory === parentDirectory) {
    console.log("You are already at the root directory.");
    return;
  }

  try {
    process.chdir(parentDirectory);
    await setCurrentDirectory(parentDirectory);
  } catch (error) {
    throw new Error(`Failed to go up: ${error.message}`);
  }
};

export const cd = async (args) => {
  const targetDirectory = path.resolve(currentDirectory, args.join(" "));
  try {
    await fsPromises.access(targetDirectory, fsPromises.constants.F_OK);
    process.chdir(targetDirectory);
    console.log(targetDirectory);
    setCurrentDirectory(targetDirectory);
  } catch (error) {
    console.error("Failed to change directory:", error.message);
  }
};

export const ls = async () => {
  try {
    const files = await fsPromises.readdir(currentDirectory);
    const allItems = [];

    for (const file of files) {
      const fullPath = path.join(currentDirectory, file);
      const stats = await fsPromises.stat(fullPath);
      const itemType = stats.isDirectory() ? "directory" : "file";
      allItems.push({ name: file, type: itemType });
    }

    allItems.sort((a, b) => a.type.localeCompare(b.type));
    console.table(allItems);
  } catch (err) {
    console.error("Error reading directory:", err);
  }
};
