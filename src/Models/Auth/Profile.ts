import mongoose from "mongoose";
import { Schema } from "mongoose";
import User from "./User";

const ProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  dob: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Profile", ProfileSchema);
