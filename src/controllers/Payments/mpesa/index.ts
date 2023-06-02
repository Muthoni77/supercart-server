import { Response } from "express";
import { CustomRequest } from "../../../Types/Auth";

export const handleMpesaCheckout = async (
  req: CustomRequest,
  res: Response
) => {
  res.status(200).json({ message: "Handling checkout" });
};

export const generateAccessToken = async () => {
  
};
