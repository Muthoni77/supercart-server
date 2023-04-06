import { Request, Response, NextFunction } from "express";
import verifyJWT from "../utils/jwt/verifyJWT";
import { Document, Types } from "mongoose";
import { CustomRequest, JWTPayloadType } from "../Types/Auth";

const JWTGuard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if token is available
    const tokenString = req.headers.authorization || req.headers.Authorization;
    if (!tokenString) {
      res.status(403).json({ message: "Unauthorized Request" });
    }

    const accessToken: string = String(tokenString).split(" ")[1];

    if (!accessToken) {
      res.status(403).json({ message: "Unauthorized Request" });
    }

    const tokenSecret = process.env.JWT_SECRET!;

    const guardValidCheck: JWTPayloadType | null = await verifyJWT({
      token: accessToken,
      secret: tokenSecret,
    });

    if (!guardValidCheck) {
      res.status(403).json({ message: "Invalid Access Token" });
    }
    req.user = {};

    req.user!.id = guardValidCheck!.id;
    req.user!.email = guardValidCheck!.email;

    next();
  } catch (error) {
    next(error);
  }
};

export default JWTGuard;
