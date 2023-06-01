import { Request } from "express";
import { Document, Types } from "mongoose";

export interface RegisterType {
  username: string;
  email: string;
  password: string;
  phone: string;
}
export interface LoginType {
  email: string;
  password: string;
}

export interface UserType extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  phone: string;
  password: string;
  refreshToken: string;
  OTP?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profile: any;
}

export interface JWTPayloadType {
  id:  string;
  email: string;
}
export interface JWTExpiresInType {
  expiresIn: string;
}

export interface TokenType {
  data: JWTPayloadType;
  secret: string;
  expiresIn: JWTExpiresInType;
}

export interface VerifyTokenType {
  token: string;
  secret: string;
}

export interface CustomRequest extends Request {
  user?: {
    [key: string]: any;
  };
}

export interface ResetPasswordBody {
  oldPassword: string;
  newPassword: string;
}
