import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import zlib from "node:zlib";
import fs from "fs";

const compress = async (args) => {
  const joinedArgs = args.join(" ");
  const splitArgs = joinedArgs.match(/(?:[^\s"]+|"[^"]*")+/g);
  const [pathToFile, pathToDestination] = splitArgs.map((arg) =>
    arg.replace(/"/g, "")
  );
  const extension = path.extname(pathToFile);
  const brotli = zlib.createBrotliCompress();
  const source = fs.createReadStream(pathToFile);
  const writeStream = fs.createWriteStream(
    `${pathToDestination}${extension}.br`
  );
  source.pipe(brotli).pipe(writeStream);
  writeStream.on("finish", () => {
    console.log("File compressed successfully.");
  });
};
// compress "path_to_file.txt" "path_to_destination"

export default compress;
