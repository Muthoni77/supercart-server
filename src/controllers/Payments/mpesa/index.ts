import { NextFunction, Response, Request } from "express";
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
import { logData } from "../../../utils/logData";
import path from "path";
import Mpesa from "../../../Models/Payments/Mpesa";
import User from "../../../Models/Auth/User";
import { io } from "../../..";

//Environment Variables
const BusinessShortCode = process.env.MPESA_BUSINESS_SHORTCODE!;
const PassKey = process.env.MPESA_PASSKEY!;
const CallBackURL = process.env.MPESA_CALLBACK_URL!;

//Generating the authorization token
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

//sending the STK push
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
      AccountReference: "SuperCart online store payment",
      TransactionDesc: "SuperCart online store checkout",
    };

    const response: any = await axios({
      method: "POST",
      url: mpesaEndpoint,
      data: requestBody,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    io.emit(
      "mpesaStatus",
      "Waiting for your response, kindly check your phone..."
    );
    res.status(200).json({
      responseCode: response?.data?.ResponseCode,
      MerchantRequestID: response?.data?.MerchantRequestID,
      CheckoutRequestID: response?.data?.CheckoutRequestID,
      message: response?.data?.ResponseDescription,
    });
  } catch (error: any) {
    console.log("error");
    console.log(error?.message);
    next(error);
  }
};

//handling callback response from Mpesa
export const handleMpesaCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const CheckoutRequestID = req.body?.Body?.stkCallback?.CheckoutRequestID;
    const MerchantRequestID = req.body?.Body?.stkCallback?.MerchantRequestID;
    const ResultDesc = req.body?.Body?.stkCallback?.ResultDesc;
    const ResultCode = req.body?.Body?.stkCallback?.ResultCode;
    let content: any = null;

    const filePath: string = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "logs",
      "payments",
      "file.txt"
    );

    if (ResultCode === 0) {
      const CallbackMetadata =
        req.body?.Body?.stkCallback?.CallbackMetadata?.Item;
      const Amount = CallbackMetadata[0].Value;
      const MpesaReceiptNumber = CallbackMetadata[1].Value;
      /* unused flag balance
      const Balance = CallbackMetadata[2].Value;
      */
      const TransactionDate = CallbackMetadata[3].Value;
      const PhoneNumber = CallbackMetadata[4].Value;

      //save transaction to DB
      const newRecord = new Mpesa();
      newRecord.PhoneNumber = PhoneNumber;
      newRecord.CheckoutRequestID = CheckoutRequestID;
      newRecord.MerchantRequestID = MerchantRequestID;
      newRecord.MpesaReceiptNumber = MpesaReceiptNumber;
      newRecord.ResultCode = ResultCode;
      newRecord.ResultDesc = ResultDesc;
      newRecord.Amount = Amount;
      newRecord.TransactionDate = TransactionDate;

      await newRecord.save();

      content = `Method:MPesa\nCheckoutRequestID: ${CheckoutRequestID}\nMerchantRequestID: ${MerchantRequestID}\nMpesaReceiptNumber: ${MpesaReceiptNumber}\nResult code: ${ResultCode}\nResult Description: ${ResultDesc}\nAmount: ${Amount}\nPhoneNumber: ${PhoneNumber}\nDate: ${TransactionDate}\n\n*****************************\n\n`;
    } else {
      content = `Method:MPesa\nCheckoutRequestID: ${CheckoutRequestID}\nMerchantRequestID: ${MerchantRequestID}\nResult code: ${ResultCode}\nResult Description: ${ResultDesc}\n\n*****************************\n\n`;
    }
    io.emit("mpesaStatus", { ResultCode, ResultDesc });
    logData({ filePath, content });
  } catch (error) {
    next(error);
  }
};
