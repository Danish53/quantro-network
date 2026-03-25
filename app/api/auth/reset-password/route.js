import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { AUTH_COOKIE, PW_RESET_COOKIE, verifyPasswordResetCookie } from "@/lib/auth/jwt";
import { hashResetLinkToken } from "@/lib/auth/resetTokens";

const schema = z
  .object({
    password: z.string().min(8).max(128),
    passwordConfirm: z.string().min(8).max(128),
    token: z.string().min(10).max(200).optional().nullable(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

function clearedCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return { httpOnly: true, path: "/", sameSite: "lax", secure, maxAge: 0 };
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
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { password, token: bodyToken } = parsed.data;
  const cookieToken = request.cookies.get(PW_RESET_COOKIE)?.value;
  const linkToken = bodyToken?.trim() || null;

  let user = null;

  if (linkToken) {
    const hash = hashResetLinkToken(linkToken);
    user = await User.findOne({
      passwordResetTokenHash: hash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetTokenHash +passwordResetExpires");
  } else if (cookieToken) {
    let payload;
    try {
      payload = await verifyPasswordResetCookie(cookieToken);
    } catch {
      return NextResponse.json({ error: "Reset session expired. Verify your code again." }, { status: 401 });
    }
    user = await User.findById(payload.userId);
  } else {
    return NextResponse.json(
      { error: "Missing reset token. Open the link from your email or verify your OTP first." },
      { status: 400 },
    );
  }

  if (!user) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  }

  user.password = await bcrypt.hash(password, 12);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  user.resetOtpHash = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  const res = NextResponse.json({ ok: true, message: "Password updated. You can sign in." });
  res.cookies.set(PW_RESET_COOKIE, "", clearedCookieOptions());
  /** Invalidate any existing login session after password change */
  res.cookies.set(AUTH_COOKIE, "", clearedCookieOptions());
  return res;
}
