import * as path from "node:path";
import * as fsPromises from "node:fs/promises";

const rm = async (args) => {
  const filePath = args.join(" ");
  console.log(filePath);
  try {
    const resolvedPath = path.resolve(filePath);
    await fsPromises.unlink(resolvedPath);
    console.log(`File ${resolvedPath} deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete file: ${error.message}`);
  }
};
export default rm;
