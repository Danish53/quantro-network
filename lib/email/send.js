import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    });
  }
  return transporter;
}

/**
 * @param {{ to: string; otp: string; resetUrl: string }} p
 */
export async function sendPasswordResetEmail({ to, otp, resetUrl }) {
  const subject = "Reset your Quantro Network password";
  const text = [
    "You requested a password reset.",
    "",
    `Your verification code: ${otp}`,
    `Or open this link to set a new password (valid for a limited time):`,
    resetUrl,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>You requested a password reset.</p>
    <p><strong>Verification code:</strong> ${otp}</p>
    <p><a href="${resetUrl}">Set a new password</a></p>
    <p>If you did not request this, ignore this email.</p>
  `;

  const t = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@localhost";

  if (!t) {
    console.info("[email:dev] Password reset (configure SMTP_HOST to send real mail)", {
      to,
      otp,
      resetUrl,
    });
    return;
  }

  await t.sendMail({ from, to, subject, text, html });
}
