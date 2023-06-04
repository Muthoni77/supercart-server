import { NextFunction, Response } from "express";
import { CustomRequest } from "../../../Types/Auth";
import axios from "axios";
import {
  AccessTokenType,
  StkPushRequestBodyType,
} from "../../../Types/Payments/Mpesa";
import {
  generateSTKPushPassword,
  getTimeStamp,
  getTokenPassword,
} from "../../../utils/payments/mpesa";

const BusinessShortCode = process.env.MPESA_BUSINESS_SHORTCODE;
const PassKey = process.env.MPESA_PASSKEY;

export const handleMpesaCheckout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const mpesaEndpoint = process.env.MPESA_TOKEN_ENDPOINT;
    const accessToken = await generateAccessToken(next);
    const Timestamp = await getTimeStamp();
    const Password = await generateSTKPushPassword({
      BusinessShortCode: BusinessShortCode!,
      PassKey: PassKey!,
      Timestamp,
    });

    // const requestBody: StkPushRequestBodyType = {
    //   BusinessShortCode: "174379",
    //   Password: "",
    //   Timestamp,
    //   TransactionType: "CustomerPayBillOnline",
    //   Amount: "1",
    //   PartyA: "254708374149",
    //   PartyB: "174379",
    //   PhoneNumber: "254708374149",
    //   CallBackURL: "https://mydomain.com/pat",
    //   AccountReference: "Test",
    //   TransactionDesc: "Test",
    // };

    res
      .status(200)
      .json({ message: "Handling checkout", token: accessToken, Password });
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
