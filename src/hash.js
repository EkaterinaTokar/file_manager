import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import fs from "fs";
const { createHash } = await import("node:crypto");

const hash = async (args) => {
  const filename = args.join(" ");
  const readStream = fs.createReadStream(filename);
  const hashStream = createHash("sha256");

  readStream.on("error", (error) => {
    console.error("Error reading file:", error);
  });

  readStream.on("data", (chunk) => {
    hashStream.update(chunk);
  });

  readStream.on("end", () => {
    const fileHash = hashStream.digest("hex");
    console.log(`hash: ${fileHash}`);
  });
};
export default hash;
