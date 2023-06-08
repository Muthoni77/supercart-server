import fs from "fs";
import path from "path";

export const logData = async () => {
  fs.writeFile(filePath, content, { flag: "a" }, (err) => {
    if (err) {
      console.error("An error occurred while writing to the file:", err);
      return;
    }
    console.log(
      "Content has been written or appended to the file successfully."
    );
  });
};
