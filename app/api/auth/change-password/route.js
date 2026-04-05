import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let payload;
  try {
    payload = await verifyAuthToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error?.issues?.[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: String(msg) }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  try {
    const user = await User.findById(payload.userId).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const storedHash = user.password;
    if (!storedHash || typeof storedHash !== "string") {
      return NextResponse.json(
        { error: "No password is stored for this account. Use the forgot-password flow on the login page." },
        { status: 400 },
      );
    }

    let match = false;
    try {
      match = await bcrypt.compare(currentPassword, storedHash);
    } catch (e) {
      console.error("[change-password] bcrypt.compare", e);
      return NextResponse.json({ error: "Could not verify your current password" }, { status: 500 });
    }

    if (!match) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    // Use updateOne so we do not run full-document validation on save(). Older rows may
    // violate current schema (e.g. country length) and would otherwise make password change fail with 500.
    const upd = await User.updateOne({ _id: user._id }, { $set: { password: hashed } });
    if (upd.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (e) {
    console.error("[change-password]", e);
    return NextResponse.json({ error: "Could not update password" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Password updated" });
}
