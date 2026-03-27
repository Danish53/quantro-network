import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "convert_out", "convert_in"],
      required: true,
      index: true,
    },
    asset: { type: String, enum: ["USDT_BNB", "USDC_BNB", "ETH"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed", index: true },
    reference: { type: String, trim: true, maxlength: 80 },
    txHash: { type: String, trim: true, maxlength: 80 },
    direction: { type: String, enum: ["debit", "credit"], required: true },
    note: { type: String, trim: true, maxlength: 200, default: "" },
    mode: { type: String, enum: ["mock", "sandbox"], default: "mock" },
  },
  { timestamps: true },
);

WalletTransactionSchema.index({ userId: 1, createdAt: -1 });
WalletTransactionSchema.index({ txHash: 1 }, { unique: true, sparse: true });

const WalletTransaction =
  mongoose.models.WalletTransaction || mongoose.model("WalletTransaction", WalletTransactionSchema);

export default WalletTransaction;
