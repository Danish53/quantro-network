import mongoose from "mongoose";

const VirtualCardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    provider: {
      type: String,
      default: "mock",
      trim: true,
      maxlength: 40,
    },
    status: {
      type: String,
      enum: ["pending", "pending_review", "active", "frozen", "rejected"],
      default: "pending_review",
      index: true,
    },
    networkLabel: {
      type: String,
      default: "Visa · Virtual",
      trim: true,
      maxlength: 60,
    },
    maskedPan: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    expiryMonth: { type: Number, required: true, min: 1, max: 12 },
    expiryYear: { type: Number, required: true, min: 2025, max: 2100 },
    balanceUsd: { type: Number, default: 0, min: 0 },
    mode: {
      type: String,
      enum: ["mock", "sandbox"],
      default: "mock",
    },
  },
  { timestamps: true },
);

const VirtualCard = mongoose.models.VirtualCard || mongoose.model("VirtualCard", VirtualCardSchema);

export default VirtualCard;
