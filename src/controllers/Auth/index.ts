import express, { Request, Response, NextFunction } from "express";
import {
  RegisterType,
  LoginType,
  JWTPayloadType,
  JWTExpiresInType,
  TokenType,
  UserType,
  CustomRequest,
} from "../../Types/Auth";
import { customErrorType } from "../../Types/Error";
import User from "../../Models/Auth/User";
import createJWT from "../../utils/jwt/createJWT";
import { bcryptCompare, hashText } from "../../utils/bcrypt";
import formatPhoneNumber from "../../utils/formatPhoneNumber";
import { sendEmailActivation } from "../../utils/sendEmail";

//register function
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, phone, password }: RegisterType = req.body;
  if (!username || !email || !password) {
    const inputError: customErrorType = new Error();
    inputError.status = 500;
    inputError.message = "Please provide all inputs";
    return next(inputError);
  }

  try {
    const newAccount = new User();
    newAccount.username = username;
    const hashedPassword = await hashText({ rawText: password });
    (newAccount.email = email), (newAccount.password = hashedPassword);
    newAccount.phone = await formatPhoneNumber(phone);
    await newAccount.save();

    const tokenPayload: JWTPayloadType = { id: newAccount._id, email };
    const JWTSecret: string = process.env.JWT_SECRET!;
    const JWTRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;
    const JWTVerificationSecret: string = process.env.JWT_VERIFICATION_SECRET!;
    const accessExpiresIn: JWTExpiresInType = { expiresIn: "3h" };
    const refreshExpiresIn: JWTExpiresInType = { expiresIn: "7d" };
    const verificationExpiresIn: JWTExpiresInType = { expiresIn: "1d" };

    const accessToken = await createJWT({
      data: tokenPayload,
      secret: JWTSecret,
      expiresIn: accessExpiresIn,
    });
    const refreshToken = await createJWT({
      data: tokenPayload,
      secret: JWTRefreshSecret,
      expiresIn: refreshExpiresIn,
    });
    const verificationToken = await createJWT({
      data: tokenPayload,
      secret: JWTVerificationSecret,
      expiresIn: verificationExpiresIn,
    });

    const hashedRefreshToken = await hashText({ rawText: refreshToken });
    newAccount.refreshToken = hashedRefreshToken;
    await newAccount.save();

    //send Activation Email
    const isEmailSent = await sendEmailActivation({
      token: verificationToken,
      recipientName: username,
      recipientEmail: email,
    });

    if (!isEmailSent) {
      next(new Error("Failed to send activation email"));
    }

    res.status(200).json({
      success: true,
      message:
        "Registration was successfull! Kindly check your email for further instructions.",
      data: newAccount,
      accessToken,
      refreshToken,
      refreshExpiresIn,
    });
  } catch (error) {
    next(error);
  }
};

//Login function
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password }: LoginType = req.body;
  if (!email || !password) {
    const inputError: customErrorType = new Error();
    inputError.status = 500;
    inputError.message = "Please provide both your email and password";
    return next(inputError);
  }
  try {
    const userExists: UserType | null = await User.findOne({ email: email })!;
    if (userExists) {
      const isPasswordCorrect = await bcryptCompare({
        rawText: password,
        hashText: userExists?.password!,
      });

      if (isPasswordCorrect) {
        const tokenPayload: JWTPayloadType = {
          id: userExists?._id,
          email,
        };
        const JWTSecret: string = process.env.JWT_SECRET!;
        const JWTRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;
        const accessExpiresIn: JWTExpiresInType = { expiresIn: "30s" };
        const refreshExpiresIn: JWTExpiresInType = { expiresIn: "7d" };

        const accessToken = await createJWT({
          data: tokenPayload,
          secret: JWTSecret,
          expiresIn: accessExpiresIn,
        });
        const refreshToken = await createJWT({
          data: tokenPayload,
          secret: JWTRefreshSecret,
          expiresIn: refreshExpiresIn,
        });

        const hashedRefreshToken = await hashText({ rawText: refreshToken });
        userExists.refreshToken = hashedRefreshToken;
        await userExists.save();
        res.status(200).json({
          message: "Login was successfull",
          accessToken,
          refreshToken,
        });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Incorrect Email or Password" });
      }
    } else {
      next(new Error("User with that email doesn't exist"));
    }
  } catch (error) {
    next(error);
  }
};

//logout
export const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user!.id) {
    res.status(403).json({ success: false, message: "Unauthorized" });
  }
  try {
    const userId = req.user!.id;
    const userEmail = req.user!.email;

    const userExists: UserType | null = await User.findOne({
      email: userEmail,
    });
    if (!userExists) {
      throw new Error("Invalid Request");
    }
    userExists.refreshToken = "";
    await userExists.save();
    res
      .status(200)
      .json({ success: true, message: "You have successfully logged out!" });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to log out error");
  }
};

export const refreshToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEmail = req.user?.email;

    const userExists: UserType | null = await User.findOne({
      email: userEmail,
    });
    if (userExists) {
      const tokenPayload: JWTPayloadType = {
        id: userExists!._id,
        email: userEmail,
      };

      const JWTSecret: string = process.env.JWT_SECRET!;
      const JWTRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;

      const accessExpiresIn: JWTExpiresInType = { expiresIn: "1h" };
      const refreshExpiresIn: JWTExpiresInType = { expiresIn: "7d" };

      const accessToken = await createJWT({
        data: tokenPayload,
        secret: JWTSecret,
        expiresIn: accessExpiresIn,
      });
      const refreshToken = await createJWT({
        data: tokenPayload,
        secret: JWTRefreshSecret,
        expiresIn: refreshExpiresIn,
      });

      const hashedRefreshToken = await hashText({ rawText: refreshToken });
      userExists.refreshToken = hashedRefreshToken;
      await userExists.save();

      res.status(200).json({
        success: true,
        message: "Tokens were refreshed successfully",
        accessToken,
        refreshToken,
      });
    } else {
      next(new Error("Invalid request"));
    }
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ success: false, message: "Failed to refresh token!" });
  }
};

export const verifyEmail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      success: true,
      message: "Email was verified successfully!",
      id: req.params.id,
    });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ success: false, message: "Failed to Verify your email!" });
  }
};
