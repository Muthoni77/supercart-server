import { Response } from "express";
import { CustomRequest } from "../../../Types/Auth";
import axios from "axios";

const mpesaEndpoint = process.env.MPESA_ENDPOINT;

export const handleMpesaCheckout = async (
  req: CustomRequest,
  res: Response
) => {
  await generateAccessToken();
  res.status(200).json({ message: "Handling checkout" });
};

export const generateAccessToken = async () => {
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

  console.log("response");
  console.log(response);
  console.log("response data");
  console.log(response.data);
};
