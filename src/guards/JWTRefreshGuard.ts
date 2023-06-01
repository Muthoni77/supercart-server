import { NextFunction, Response } from "express";
import { CustomRequest, JWTPayloadType, UserType } from "../Types/Auth";
import verifyJWT from "../utils/jwt/verifyJWT";
import User from "../Models/Auth/User";

const JWTRefreshGuard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if refresh token is available
    const tokenString = req.headers.authorization || req.headers.Authorization;
    if (!tokenString) {
      return res.status(403).json({ message: "Unauthorized Request" });
    }

    const refreshToken: string = String(tokenString).split(" ")[1];

    if (!refreshToken) {
      return res.status(403).json({ message: "Unauthorized Request" });
    }

    const tokenSecret = process.env.JWT_REFRESH_SECRET!;

    const guardValidCheck: JWTPayloadType | null = await verifyJWT({
      token: refreshToken,
      secret: tokenSecret,
    });

    const userExists: UserType | null = await User.findOne({
      email: guardValidCheck!.email,
    });

   if (!guardValidCheck || !userExists) {
     return res.status(403).json({ message: "Invalid Access Token" });
   }
   req.user = {};

   req.user!.id = userExists._id.toString();
   req.user!.email = guardValidCheck!.email;

    next();
  } catch (error) {
    next(error);
  }
};

export default JWTRefreshGuard;
