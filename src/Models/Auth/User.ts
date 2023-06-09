import mongoose, { Schema } from "mongoose";
import Profile from "./Profile";

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
  OTP: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    required: false,
    default: false,
  },

  refreshToken: {
    type: String,
    required: false,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: Profile,
    required: false,
  },
});

export default mongoose.model("User", UserSchema);
