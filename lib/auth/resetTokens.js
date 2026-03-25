import crypto from "crypto";

export function hashResetLinkToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken, "utf8").digest("hex");
}

export function generateResetLinkToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
