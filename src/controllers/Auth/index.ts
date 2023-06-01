import express, { Request, Response, NextFunction } from "express";
import {
  RegisterType,
  LoginType,
  JWTPayloadType,
  JWTExpiresInType,
  TokenType,
  UserType,
  CustomRequest,
  ResetPasswordBody,
} from "../../Types/Auth";
import { customErrorType } from "../../Types/Error";
import User from "../../Models/Auth/User";
import createJWT from "../../utils/jwt/createJWT";
import { bcryptCompare, hashText } from "../../utils/bcrypt";
import formatPhoneNumber from "../../utils/formatPhoneNumber";
import {
  sendEmailActivation,
  sendRequestPasswordChangeEmail,
} from "../../utils/sendEmail";
import verifyJWT from "../../utils/jwt/verifyJWT";
import sendMessage from "../../utils/sendMessage";
import Profile from "../../Models/Auth/Profile";

//register function
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, phone, password }: RegisterType = req.body;
  if (!username || !email || !password) {
    const inputError: customErrorType = new Error();
    inputError.status = 500;
    inputError.message = "Please provide all inputs";
    return next(inputError);
  }

  try {
    const newAccount = new User();
    const formattedPhone = await formatPhoneNumber(phone);
    newAccount.username = username;
    const hashedPassword = await hashText({ rawText: password });
    (newAccount.email = email), (newAccount.password = hashedPassword);
    newAccount.phone = formattedPhone;
    await newAccount.save();

    //create profile for user;
    const accountProfile = new Profile();
    accountProfile.userId = newAccount._id;
    await accountProfile.save();

    //update user with the profile id;
    newAccount.profile = accountProfile._id;

    const tokenPayload: JWTPayloadType = { id: newAccount._id, email };
    const JWTSecret: string = process.env.JWT_SECRET!;
    const JWTRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;
    const JWTVerificationSecret: string = process.env.JWT_VERIFICATION_SECRET!;
    const accessExpiresIn: JWTExpiresInType = { expiresIn: "3h" };
    const refreshExpiresIn: JWTExpiresInType = { expiresIn: "7d" };
    const verificationExpiresIn: JWTExpiresInType = { expiresIn: "2h" };

    const OTP = Math.floor(Math.random() * 10000);
    const hashedOTP = await hashText({ rawText: String(OTP) });

    newAccount.OTP = hashedOTP;

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

    console.log(`The OTP sent is ${OTP}`);
    //sendMessage
    // const isMessageSent = await sendMessage({
    //   recipients: ["+" + formattedPhone],
    //   message: `Hello there ${username}, Your OTP for SuperCart is ${OTP}.`,
    // });

    // if (!isMessageSent) {
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Failed to send the OTP" });
    // }

    const returnedUser = {
      id: newAccount._id,
      username,
      email,
      phone,
      emailVerified: newAccount.emailVerified,
      phoneVerified: newAccount.phoneVerified,
    };

    res.status(200).json({
      success: true,
      message:
        "Registration was successfull! Kindly check your email for further instructions.",
      data: returnedUser,
      accessToken,
      refreshToken,
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
  let existingUserId: string = "";
  const { email, password }: LoginType = req.body;
  if (!email || !password) {
    const inputError: customErrorType = new Error();
    inputError.status = 500;
    inputError.message = "Please provide both your email and password";
    return next(inputError);
  }
  try {
    const userExists: UserType | null = await User.findOne({
      email: email,
    }).populate("profile")!;
    if (userExists) {
      console.log("use exists");
      console.log(userExists);
      existingUserId = String(userExists.id);
      const isPasswordCorrect = await bcryptCompare({
        rawText: password,
        hashText: userExists?.password!,
      });

      console.log("userExists.id.valueOf()");
      console.log(userExists.id.valueOf());

      if (isPasswordCorrect) {
        const objectId = userExists._id;
        const objectIdString = objectId.toString();
        const tokenPayload: JWTPayloadType = {
          id: String(userExists.id),
          email: email,
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

        const returnedUser = {
          id: userExists._id,
          username: userExists.username,
          email: userExists.email,
          phone: userExists.phone,
          emailVerified: userExists.emailVerified,
          phoneVerified: userExists.phoneVerified,
          profile: userExists.profile,
        };

        res.status(200).json({
          success: true,
          message: "Login was successfull",
          data: returnedUser,
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
      .status(500)
      .json({ success: false, message: "Failed to refresh token!" });
  }
};

export const requestVerifyEmail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEmail = req.body.email;
    if (!userEmail) {
      res.status(200).json({
        success: false,
        message: "You must enter your email",
      });
    }

    const userExists: UserType | null = await User.findOne({
      email: userEmail,
    });
    if (userExists) {
      const tokenPayload: JWTPayloadType = {
        id: userExists!._id,
        email: userEmail,
      };

      const JWTVerificationSecret: string =
        process.env.JWT_VERIFICATION_SECRET!;
      const verificationExpiresIn: JWTExpiresInType = { expiresIn: "1d" };

      const verificationToken = await createJWT({
        data: tokenPayload,
        secret: JWTVerificationSecret,
        expiresIn: verificationExpiresIn,
      });

      //send Activation Email
      const isEmailSent = await sendEmailActivation({
        token: verificationToken,
        recipientName: userExists.username,
        recipientEmail: userExists.email,
      });

      if (!isEmailSent) {
        next(new Error("Failed to send activation email"));
      }

      res.status(200).json({
        success: true,
        message: "Kindly check your email for further instructions",
      });
    } else {
      next(new Error("Invalid request"));
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to complete email verification request!",
    });
  }
};

export const verifyEmail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationToken = req.params.token;
    const tokenSecret = process.env.JWT_VERIFICATION_SECRET!;
    if (!verificationToken) next(new Error("Invalid Request"));

    const isTokenValid = await verifyJWT({
      token: verificationToken,
      secret: tokenSecret,
    });

    if (!isTokenValid) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/verification/token-expired`
      );
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid Token",
      // });
    }

    const userExists = await User.findOne({ email: isTokenValid.email });
    if (!userExists) throw new Error("Invalid Request");

    userExists.emailVerified = true;
    await userExists.save();

    // res.status(200).json({
    //   success: true,
    //   message: "Email was verified successfully!",
    //   isTokenValid,
    // });

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/verification/email-verified`
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "Failed to Verify your email!" });
  }
};

export const requestResetPassword = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEmail = req.body.email;
    if (!userEmail) {
      return next(new Error("You must provide your reset account email!"));
    }

    const userExists = await User.findOne({ email: userEmail });

    if (!userExists)
      return next(
        new Error("We don't have an account registered with that user!")
      );

    const tokenPayload: JWTPayloadType = {
      id: userExists!._id,
      email: userEmail,
    };

    const tokenSecret = process.env.JWT_RESET_PASSWORD_SECRET!;
    const tokenExpiry: JWTExpiresInType = { expiresIn: "1h" };
    const token = await createJWT({
      data: tokenPayload,
      secret: tokenSecret,
      expiresIn: tokenExpiry,
    });
    const isEmailSent = await sendRequestPasswordChangeEmail({
      recipientEmail: userEmail,
      token: token,
    });

    if (!isEmailSent) {
      return next(new Error("Failed to send the reset password email!"));
    }
    res.status(200).json({
      success: true,
      userEmail,
      message:
        "Request was successfull. Check your email for further instructions",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to reset your password!" });
  }
};

export const resetPassword = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //check inputs
    const { newPassword }: ResetPasswordBody = req.body;

    if (!newPassword)
      return res
        .status(200)
        .json({ success: false, message: "Inputs required!" });

    //check if user exists
    const userEmail = req.user?.email;

    const userExists: UserType | null = await User.findOne({
      email: userEmail,
    });

    if (!userEmail || !userExists)
      return res
        .status(200)
        .json({ success: false, message: "Unauthorized Request" });

    //hash new password
    const newHashedPassword: string = await hashText({ rawText: newPassword });

    userExists!.password = newHashedPassword;
    await userExists?.save();

    if (!userExists)
      return res
        .status(403)
        .json({ success: false, message: "Invalid Request" });

    res.status(200).json({
      success: true,
      message: "You password was changed successfully",
      userExists,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to reset your password!" });
  }
};

export const resendOTP = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if user exists
    const userEmail = req.user?.email;

    const userExists: UserType | null = await User.findOne({
      email: userEmail,
    });

    const OTP = Math.floor(Math.random() * 10000);
    const hashedOTP = await hashText({ rawText: String(OTP) });

    userExists!.OTP = hashedOTP;
    await userExists!.save();

    if (!userEmail || !userExists)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Request" });

    const isMessageSent = await sendMessage({
      recipients: ["+" + userExists.phone],
      message: `Hello there, Your OTP for SuperCart is ${OTP}.`,
    });

    if (!isMessageSent) {
      return res
        .status(403)
        .json({ success: false, message: "Failed to send the OTP" });
    }

    res.status(200).json({
      success: true,
      message: "OTP was sent successfully",
      userExists,
    });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ success: false, message: "Failed to reset your password!" });
  }
};

export const verifyOTP = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const guessOTP = req.body.otp;

    if (!guessOTP)
      return res.status(403).json({ success: false, message: "OTP required" });

    //check if user exists
    const userEmail = req.user?.email;

    const userExists: UserType | null = await User.findOne({
      email: userEmail,
    });

    if (!userEmail || !userExists)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Request" });

    const isOTPCorrect = await bcryptCompare({
      rawText: String(guessOTP),
      hashText: userExists.OTP!,
    });

    if (!isOTPCorrect) {
      return res
        .status(200)
        .json({ success: false, message: "You have entered the wrong OTP!" });
    }

    userExists.phoneVerified = true;
    await userExists.save();

    res.status(200).json({
      success: true,
      message: "Phone number was verified successfully",
      userExists,
    });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ success: false, message: "Failed to verify your OTP!" });
  }
};
