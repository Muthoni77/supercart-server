import jwt from "jsonwebtoken";
import { TokenType } from "../Types/Auth";

const createJWT = async ({
  data,
  secret,
  expiresIn,
}: TokenType): Promise<string> => {
  const token = jwt.sign(data, secret, expiresIn);
  return token;
};

export default createJWT;
