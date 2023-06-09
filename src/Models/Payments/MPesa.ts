import mongoose, { Schema } from "mongoose";

const MpesaSchema = new Schema({
  PhoneNumber: {
    type: String,
    required: true,
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

export default mongoose.model("MpesaRecord", MpesaSchema);
