import { NextFunction, Response } from "express";
import { CustomRequest } from "../../../Types/Auth";
import axios from "axios";
import { AccessTokenType } from "../../../Types/Payments/Mpesa";
import { getTokenPassword } from "../../../utils/payments/mpesa";

export const handleMpesaCheckout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = await generateAccessToken(next);
    res.status(200).json({ message: "Handling checkout", token: accessToken });
  } catch (error) {
    next(error);
  }
};

export const generateAccessToken = async (
  next: NextFunction
): Promise<string | null> => {
  try {
    const mpesaEndpoint = process.env.MPESA_TOKEN_ENDPOINT;

    const encodedString: string | boolean = await getTokenPassword();

    if (!encodedString) {
      next(new Error("Failed to generate token password"));
    }

    const response = await axios({
      method: "get",
      url: mpesaEndpoint,
      headers: {
        Authorization: `Basic ${encodedString}`,
      },
    });

    const { access_token, expires_in }: AccessTokenType = response.data;
    return access_token;
  } catch (error) {
    next(error);
    return null;
  }
};
