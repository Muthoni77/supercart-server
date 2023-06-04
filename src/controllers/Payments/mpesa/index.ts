import { NextFunction, Response } from "express";
import { CustomRequest } from "../../../Types/Auth";
import axios from "axios";
import {
  AccessTokenType,
  StkPushRequestBodyType,
  StkPushUserRequestBodyType,
} from "../../../Types/Payments/Mpesa";
import {
  generateSTKPushPassword,
  getTimeStamp,
  getTokenPassword,
} from "../../../utils/payments/mpesa";

const BusinessShortCode = process.env.MPESA_BUSINESS_SHORTCODE!;
const PassKey = process.env.MPESA_PASSKEY!;
const CallBackURL = process.env.MPESA_CALLBACK_URL!;

export const handleMpesaCheckout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Amount, PhoneNumber }: StkPushUserRequestBodyType = req.body;
    const mpesaEndpoint = process.env.MPESA_STKPUSH_ENDPOINT;
    const accessToken = await generateAccessToken(next);
    const Timestamp = await getTimeStamp();
    const Password = await generateSTKPushPassword({
      BusinessShortCode,
      PassKey,
      Timestamp,
    });

    const requestBody: StkPushRequestBodyType = {
      BusinessShortCode,
      Password,
      Timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount,
      PartyA: PhoneNumber,
      PartyB: BusinessShortCode,
      PhoneNumber,
      CallBackURL,
      AccountReference: "SuperCart Checkout",
      TransactionDesc: "SuperCart online store checkout",
    };

    const response = await axios({
      method: "POST",
      url: mpesaEndpoint,
      data: requestBody,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("response");
    console.log(response);

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
