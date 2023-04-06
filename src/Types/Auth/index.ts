import { Request } from "express";
import { Document, Types } from "mongoose";

export interface RegisterType {
  username: string;
  email: string;
  password: string;
}
export interface LoginType {
  email: string;
  password: string;
}

export interface UserType extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  refreshToken: string;
}

export interface JWTPayloadType {
  id: Types.ObjectId;
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
