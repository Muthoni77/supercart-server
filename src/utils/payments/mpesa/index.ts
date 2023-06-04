import { StkPushGeneratePasswordBodyType } from "../../../Types/Payments/Mpesa";
import { format } from "date-fns";

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

export const getTimeStamp = async (): Promise<string> => {
  try {
    const timeStamp = format(Date.now(), "yyyyMMddHHmmss");
    return timeStamp;
  } catch (error) {
    console.log(error);
    throw Error("Failed to create timestamp");
  }
};
export const getTokenPassword = async (): Promise<string> => {
  try {
    const encodedString = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
      "utf-8"
    ).toString("base64");

    return encodedString;
  } catch (error) {
    console.log(error);
    throw Error("Failed to create token password");
  }
};

export const generateSTKPushPassword = async ({
  BusinessShortCode,
  PassKey,
  Timestamp,
}: StkPushGeneratePasswordBodyType): Promise<string> => {
  try {
    const encodedString = Buffer.from(
      `${BusinessShortCode}${PassKey}${Timestamp}`,
      "utf-8"
    ).toString("base64");

    return encodedString;
  } catch (error) {
    console.log(error);
    throw Error("Failed to generate token password");
  }
};
