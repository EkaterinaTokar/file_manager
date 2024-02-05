import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import fs from "fs";
import zlib from "node:zlib";

const decompress = async (args) => {
  const joinedArgs = args.join(" ");
  const splitArgs = joinedArgs.match(/(?:[^\s"]+|"[^"]*")+/g);
  const [pathToFile, pathToDestination] = splitArgs.map((arg) =>
    arg.replace(/"/g, "")
  );

  const readStream = fs.createReadStream(`${pathToFile}`);
  const writeStream = fs.createWriteStream(
    `${pathToDestination.replace(/\.$/, "")}`
  );

  const brotli = zlib.createBrotliDecompress();
  readStream.pipe(brotli).pipe(writeStream);
  writeStream.on("finish", () => {
    console.log("File decompressed successfully.");
  });
};
// decompress "path_to_file.txt.br" "path_to_destination.txt"

export default decompress;
