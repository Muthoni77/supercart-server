import express, { Request, Response, NextFunction } from "express";
import { RegisterType, LoginType } from "../../Types/Auth";
import { customErrorType } from "../../Types/Auth/Error";
import User from "../../Models/Auth/User";

//register function
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password }: RegisterType = req.body;
  if (!username || !email || !password) {
    const inputError: customErrorType = new Error();
    inputError.status = 500;
    inputError.message = "Please provide all inputs";
    return next(inputError);
  }

  try {
    const newAccount = new User();
    newAccount.username = username;
    (newAccount.email = email), (newAccount.password = password);
    await newAccount.save();

    res
      .status(200)
      .json({ message: "Registration was successfull", data: newAccount });
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

  res.status(200).json({ message: "Inputs well received", data: req.body });
};
