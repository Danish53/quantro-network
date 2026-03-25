import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { verifyRecaptchaV2 } from "@/lib/auth/recaptcha";

/** Mongoose + bcrypt need Node (not Edge). */
export const runtime = "nodejs";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1).max(200),
    username: z.string().trim().min(2).max(50),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(5).max(40),
    country: z.string().trim().min(1).max(10),
    referral: z.string().trim().min(1).max(120),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
    recaptchaToken: z.string().optional().nullable(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request) {
  try {
    await connectDB();
  } catch (e) {
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

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const data = parsed.data;

  const captchaOk = await verifyRecaptchaV2(data.recaptchaToken ?? "");
  if (!captchaOk) {
    return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  try {
    await User.create({
      fullName: data.fullName,
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      phone: data.phone,
      country: data.country,
      referral: data.referral ?? "",
      password: passwordHash,
    });
  } catch (e) {
    if (e.code === 11000) {
      const key = e.keyPattern ? Object.keys(e.keyPattern)[0] : "";
      if (key === "email") {
        return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
      }
      if (key === "username") {
        return NextResponse.json({ error: "This username is already taken" }, { status: 409 });
      }
      return NextResponse.json({ error: "Account already exists" }, { status: 409 });
    }
    console.error("[register]", e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Account created. You can sign in." });
}
