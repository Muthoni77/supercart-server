import { VerifyTokenType, JWTPayloadType } from "../../Types/Auth/index";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const verifyJWT = async ({
  token,
  secret,
}: VerifyTokenType): Promise<null | JWTPayloadType> => {
  try {
    const isValid: any = jwt.verify(token, secret)!;

    if (isValid) {
      const decodedData: JWTPayloadType = {
        id: isValid.id,
        email: isValid.email,
      };
      return decodedData;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default verifyJWT;
