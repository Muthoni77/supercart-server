import mongoose, { Schema } from "mongoose";
import User from "../Auth/User";

const MpesaSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  CheckoutRequestID: {
    type: String,
    required: true,
  },
  MerchantRequestID: {
    type: String,
    required: true,
  },
  MpesaReceiptNumber: {
    type: String,
    required: true,
  },
  ResultCode: {
    type: String,
    required: true,
  },
  ResultDesc: {
    type: String,
    required: true,
  },
  Amount: {
    type: String,
    required: true,
  },
  TransactionDate: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Mpesa", MpesaSchema);
