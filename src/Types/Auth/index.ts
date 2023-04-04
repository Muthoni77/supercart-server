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
  email: string;
  id: string;
}
export interface JWTExpiresInType {
  expiresIn: string;
}

export interface TokenType {
  data: JWTPayloadType;
  secret: string;
  expiresIn: JWTExpiresInType;
}
