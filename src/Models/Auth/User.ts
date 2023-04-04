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
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

export default mongoose.model("User", UserSchema);
