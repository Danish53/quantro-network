import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { PW_RESET_COOKIE, signPasswordResetToken } from "@/lib/auth/jwt";

const schema = z.object({
  email: z.string().trim().email().max(255),
  otp: z.string().trim().length(6).regex(/^\d{6}$/),
});

function pwResetCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 15,
  };
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
    return NextResponse.json({ error: "Invalid code or email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await User.findOne({ email }).select("+resetOtpHash +resetOtpExpires");

  if (!user?.resetOtpHash || !user.resetOtpExpires) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  if (user.resetOtpExpires.getTime() < Date.now()) {
    return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
  }

  const ok = await bcrypt.compare(parsed.data.otp, user.resetOtpHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  user.resetOtpHash = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  let jwt;
  try {
    jwt = await signPasswordResetToken(user._id.toString());
  } catch (e) {
    console.error("[verify-otp jwt]", e);
    return NextResponse.json({ error: "Server misconfigured (JWT_SECRET)" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PW_RESET_COOKIE, jwt, pwResetCookieOptions());
  return res;
}
