import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    asset: {
      type: String,
      enum: ["USDT_BNB", "USDC_BNB", "ETH"],
      required: true,
      index: true,
    },
    network: { type: String, required: true, trim: true, maxlength: 50 },
    address: { type: String, required: true, trim: true, maxlength: 120 },
    balance: { type: Number, default: 0, min: 0 },
    lockedBalance: { type: Number, default: 0, min: 0 },
    mode: { type: String, enum: ["mock", "sandbox"], default: "mock" },
  },
  { timestamps: true },
);

WalletSchema.index({ userId: 1, asset: 1 }, { unique: true });

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);

export default Wallet;
