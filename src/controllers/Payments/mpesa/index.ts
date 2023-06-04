import { NextFunction, Response } from "express";
import { CustomRequest } from "../../../Types/Auth";
import axios from "axios";
import {
  AccessTokenType,
  StkPushRequestBodyType,
} from "../../../Types/Payments/Mpesa";
import { getTimeStamp, getTokenPassword } from "../../../utils/payments/mpesa";

export const handleMpesaCheckout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const mpesaEndpoint = process.env.MPESA_TOKEN_ENDPOINT;
    const accessToken = await generateAccessToken(next);
    const Timestamp = await getTimeStamp();

    const requestBody: StkPushRequestBodyType = {
      BusinessShortCode: "174379",
      Password:
        "MTc0Mzc5YmZiMjc5ZjlhYTPVyMExQN2bvLyzuBfqkTSSnYZKG3hkwUVjODkzMDU5YjEwZjc4ZTPVyMExQN2bvLyzuBfqkTSSnYZKG3hkwUV1NjI3",
      Timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: "1",
      PartyA: "254708374149",
      PartyB: "174379",
      PhoneNumber: "254708374149",
      CallBackURL: "https://mydomain.com/pat",
      AccountReference: "Test",
      TransactionDesc: "Test",
    };

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

    const encodedString = await getTokenPassword();

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
