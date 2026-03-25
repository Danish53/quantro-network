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
    referral: { type: String, default: "", trim: true, maxlength: 120 },
    password: { type: String, required: true, select: false },
    /** SHA-256 hex of raw reset token from email link */
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    /** bcrypt hash of 6-digit OTP */
    resetOtpHash: { type: String, select: false },
    resetOtpExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
