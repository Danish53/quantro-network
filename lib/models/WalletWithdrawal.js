import mongoose from "mongoose";

const WalletWithdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"],
    },

    walletAddress: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },

    approvedAt: Date,
    rejectedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.WalletWithdrawal ||
  mongoose.model("WalletWithdrawal", WalletWithdrawalSchema);