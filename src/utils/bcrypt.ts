import { compareHashType, hashType } from "../Types/Utils";
import bcrypt from "bcrypt";

const saltRounds: number = Number(process.env.HASH_SALT_ROUNDS)!;
export const hashText = async ({ rawText }: hashType): Promise<string> => {
  try {
    const hash = bcrypt.hash(rawText, saltRounds);
    return hash;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to hash.");
  }
};

export const bcryptCompare = async ({
  rawText,
  hashText,
}: compareHashType): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(rawText, hashText);
    return isMatch;
  } catch (error) {
    console.log(error);
    throw new Error("Bycrypt failed to compare.");
  }
};
