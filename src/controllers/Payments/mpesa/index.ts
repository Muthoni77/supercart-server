import { NextFunction, Response } from "express";
import { CustomRequest } from "../../../Types/Auth";
import axios from "axios";
import { AccessTokenType } from "../../../Types/Payments/Mpesa";

const mpesaEndpoint = process.env.MPESA_ENDPOINT;

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
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    const encodedString = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
      "utf-8"
    ).toString("base64");

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
