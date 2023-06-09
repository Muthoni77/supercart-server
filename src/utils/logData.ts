import fs from "fs";
import { LogDataBodyType } from "../Types/Utils";

export const logData = async ({ filePath, content }: LogDataBodyType) => {
  fs.writeFile(filePath, content, { flag: "a" }, (err: any) => {
    if (err) {
      console.error("An error occurred while writing to the file:", err);
      return;
    }
    console.log(
      "Content has been written or appended to the file successfully."
    );
  });
};
