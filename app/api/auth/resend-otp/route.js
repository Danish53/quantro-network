import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { sendPasswordResetEmail } from "@/lib/email/send";
import { generateOtp, generateResetLinkToken, hashResetLinkToken } from "@/lib/auth/resetTokens";

const schema = z.object({
  email: z.string().trim().email().max(255),
});

function appBaseUrl(request) {
  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (env) return env;
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "http";
  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

export async function POST(request) {
  try {
    await connectDB();
  } catch {
    return NextResponse.json(
      { error: "Database unavailable. Set MONGODB_URI in .env.local." },
      { status: 503 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await User.findOne({ email }).select(
    "+passwordResetTokenHash +passwordResetExpires +resetOtpHash +resetOtpExpires",
  );

  const generic = NextResponse.json({ ok: true, message: "If an account exists, a new code was sent." });

  if (!user) {
    return generic;
  }

  const otp = generateOtp();
  const rawToken = generateResetLinkToken();
  const otpHash = await bcrypt.hash(otp, 10);
  const tokenHash = hashResetLinkToken(rawToken);

  const now = Date.now();
  user.resetOtpHash = otpHash;
  user.resetOtpExpires = new Date(now + 15 * 60 * 1000);
  user.passwordResetTokenHash = tokenHash;
  user.passwordResetExpires = new Date(now + 60 * 60 * 1000);
  await user.save();

  const base = appBaseUrl(request);
  const resetUrl = `${base}/reset-password?token=${rawToken}`;

  try {
    await sendPasswordResetEmail({ to: user.email, otp, resetUrl });
  } catch (e) {
    console.error("[resend-otp email]", e);
    return NextResponse.json({ error: "Could not send email." }, { status: 500 });
  }

  return generic;
}
