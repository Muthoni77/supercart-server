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

    res.status(200).json({
      responseCode: response?.data?.ResponseCode,
      MerchantRequestID: response?.data?.MerchantRequestID,
      CheckoutRequestID: response?.data?.CheckoutRequestID,
      message: response?.data?.ResponseDescription,
    });
  } catch (error) {
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


    if(ResultCode===0){
      const CallbackMetadata=req.body?.Body?.stkCallback?.CallbackMetadata?.Item;
      const Amount=CallbackMetadata[0].Value;
        "CallbackMetadata": {                
            "Item": [{                        
               "Name": "Amount",                        
               "Value": 1.00                    
            },                    
            {                        
               "Name": "MpesaReceiptNumber",                        
               "Value": "NLJ7RT61SV"                    
            },                    
            {                        
               "Name": "TransactionDate",                        
               "Value": 20191219102115                    
            },                    
            {                        
               "Name": "PhoneNumber",                        
               "Value": 254708374149                    
            }]            
         } 
    }

    res
      .status(200)
      .json({ message: req.body?.stkCallback?.ResultDesc, body: req.body });

    
  } catch (error) {
    next(error);
  }
};
