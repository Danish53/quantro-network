import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    country: { type: String, required: true, trim: true, maxlength: 10 },
    avatarDataUrl: { type: String, default: "", maxlength: 2_000_000 },
    kycStatus: {
      type: String,
      enum: ["not_submitted", "pending", "approved", "rejected"],
      default: "not_submitted",
      index: true,
    },
    kycSubmittedAt: { type: Date },
    kycApprovedAt: { type: Date },
    kycRejectedReason: { type: String, trim: true, maxlength: 220, default: "" },
    kycCountry: { type: String, trim: true, maxlength: 60, default: "" },
    kycState: { type: String, trim: true, maxlength: 80, default: "" },
    kycCity: { type: String, trim: true, maxlength: 80, default: "" },
    kycAddressLine1: { type: String, trim: true, maxlength: 160, default: "" },
    kycPostalCode: { type: String, trim: true, maxlength: 20, default: "" },
    kycDateOfBirth: { type: String, trim: true, maxlength: 20, default: "" },
    kycSsnLast4: { type: String, trim: true, maxlength: 4, default: "" },
    kycUsResident: { type: Boolean, default: false },
    referral: { type: String, default: "", trim: true, maxlength: 120 },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    password: { type: String, required: true, select: false },
    /** SHA-256 hex of raw reset token from email link */
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    /** bcrypt hash of 6-digit OTP */
    resetOtpHash: { type: String, select: false },
    resetOtpExpires: { type: Date, select: false },
    /** Soft delete — set when admin archives a user; login and member APIs exclude these. */
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
