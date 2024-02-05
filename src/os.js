import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import fs from "fs";
import os from "node:os";

const osInfo = async (args) => {
  const option = args[0];
  if (option === "--EOL") {
    console.log(`Default End-Of-Line (EOL): ${JSON.stringify(os.EOL)}`);
  } else if (option === "--cpus") {
    const cpus = os.cpus();
    cpus.forEach((cpu, index) => {
      console.log(`CPU ${index + 1}:`);
      console.log(`Model: ${cpu.model}`);
      console.log(`Clock rate: ${cpu.speed / 1000} GHz`);
    });
    console.log(`Overall amount of CPUs: ${cpus.length}`);
  } else if (option === "--homedir") {
    console.log(`Home directory: ${os.homedir()}`);
  } else if (option === "--username") {
    console.log(`Current system user name: ${os.userInfo().username}`);
  } else if (option === "--architecture") {
    console.log(
      `CPU architecture for which Node.js binary has compiled: ${os.arch()}`
    );
  }
};
export default osInfo;
