import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { verifyRecaptchaV2 } from "@/lib/auth/recaptcha";
import { AUTH_COOKIE, signAuthToken } from "@/lib/auth/jwt";

const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(128),
  recaptchaToken: z.string().optional().nullable(),
});

function authCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24 * 7,
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

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { email, password, recaptchaToken } = parsed.data;

  const captchaOk = await verifyRecaptchaV2(recaptchaToken ?? "");
  if (!captchaOk) {
    return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  let token;
  try {
    token = await signAuthToken({ userId: user._id.toString(), email: user.email });
  } catch (e) {
    console.error("[login jwt]", e);
    return NextResponse.json({ error: "Server misconfigured (JWT_SECRET)" }, { status: 500 });
  }

  const res = NextResponse.json({
    ok: true,
    user: {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      username: user.username,
    },
  });
  res.cookies.set(AUTH_COOKIE, token, authCookieOptions());
  return res;
}
