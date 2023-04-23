import { Document, Types } from "mongoose";
export interface ProfileType extends Document {
  _id: Types.ObjectId;
  photo: string;
  dob: string;
  country: string;
  language: string;
}
