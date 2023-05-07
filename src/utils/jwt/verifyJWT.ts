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
      const { id, email } = isValid.data;
      console.log("Isvalid");
      console.log(isValid);
      console.log("Isvalid data");
      console.log(isValid.data);

      const decodedData: JWTPayloadType = {
        id,
        email,
      };
      return decodedData;
    }

    return null;
  } catch (error: any) {
    return null;
  }
};

export default verifyJWT;
