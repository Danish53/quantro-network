import mongoose from "mongoose";

const VirtualCardTransactionSchema = new mongoose.Schema(
  {
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VirtualCard",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    merchant: { type: String, required: true, trim: true, maxlength: 120 },
    amountUsd: { type: Number, required: true },
    status: {
      type: String,
      enum: ["approved", "pending", "declined"],
      default: "approved",
    },
    mode: {
      type: String,
      enum: ["mock", "sandbox"],
      default: "mock",
    },
  },
  { timestamps: true },
);

const VirtualCardTransaction =
  mongoose.models.VirtualCardTransaction || mongoose.model("VirtualCardTransaction", VirtualCardTransactionSchema);

export default VirtualCardTransaction;
