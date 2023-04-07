import { NextFunction, Response } from "express";
import { CustomRequest, JWTPayloadType } from "../Types/Auth";
import verifyJWT from "../utils/jwt/verifyJWT";

const JWTRefreshGuard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if refresh token is available
    const tokenString = req.headers.authorization || req.headers.Authorization;
    if (!tokenString) {
      res.status(403).json({ message: "Unauthorized Request" });
    }

    const refreshToken: string = String(tokenString).split(" ")[1];

    if (!refreshToken) {
      res.status(403).json({ message: "Unauthorized Request" });
    }

    const tokenSecret = process.env.JWT_REFRESH_SECRET!;

    const guardValidCheck: JWTPayloadType | null = await verifyJWT({
      token: refreshToken,
      secret: tokenSecret,
    });

    if (!guardValidCheck) {
      res.status(403).json({ message: "Invalid Refresh Token" });
    }
    req.user = {};

    req.user!.id = guardValidCheck!.id;
    req.user!.email = guardValidCheck!.email;

    next();
  } catch (error) {
    next(error);
  }
};

export default JWTRefreshGuard;
