import * as url from "node:url";
import os from "node:os";
import * as path from "node:path";
import readline from "node:readline";
import fs from "fs";
import * as fsPromises from "node:fs/promises";
import crypto from "node:crypto";
import zlib from "node:zlib";
import * as navigation from "./navigation.js";
import add from "./add.js";
import cat from "./cat.js";
import rename from "./rename.js";
import copy from "./copy.js";
import move from "./move.js";
import rm from "./remove.js";
import osInfo from "./os.js";
import hash from "./hash.js";
import compress from "./compress.js";
import decompress from "./decompress.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

const args = process.argv.slice(2);
const username = args[0].split("=")[1];
const homeDir = os.homedir();
export let currentDirectory = homeDir;
export const setCurrentDirectory = async (pathDirectory) => {
  currentDirectory = pathDirectory;
};

const promptCommand = () => {
  rl.prompt();
  rl.on("line", async (line) => {
    const [command, ...args] = line.trim().split(" ");
    try {
      switch (command) {
        case "up":
          await navigation.up();
          break;
        case "cd":
          await navigation.cd(args);
          break;
        case "ls":
          await navigation.ls();
          break;
        case "cat":
          await cat(args);
          break;
        case "add":
          await add(args);
          break;
        case "rn":
          await rename(args);
          break;
        case "cp":
          await copy(args);
          break;
        case "mv":
          await move(args);
          break;
        case "rm":
          await rm(args);
          break;
        case "os":
          await osInfo(args);
          break;
        case "hash":
          await hash(args);
          if (args.length === 1) {
            await hash(args[0]);
          } else {
            console.error("Invalid input. Please provide a filename.");
          }
          break;
        case "compress":
          await compress(args);
          break;
        case "decompress":
          await decompress(args);
          break;
        case ".exit":
          console.log(
            `Thank you for using File Manager, ${username}, goodbye!`
          );
          process.exit(0);
        default:
          console.error("Invalid input");
      }
    } catch (error) {
      console.error("Operation failed:", error.message);
    }
    process.on("SIGINT", () => {
      console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    });
    console.log(`You are currently in ${currentDirectory}`);
    rl.prompt();
  });
};
const startProgram = () => {
  console.log(`Welcome to the File Manager, ${username}!`);
  console.log(`You are currently in ${os.homedir()}`);
  promptCommand();
};
startProgram();
