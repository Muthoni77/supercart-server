import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified:{
    type:Boolean,
    required:false,
    default:false
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

export default mongoose.model("User", UserSchema);
