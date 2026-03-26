import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";

export const runtime = "nodejs";
import User from "@/lib/models/User";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth/jwt";

const patchMeSchema = z
  .object({
    fullName: z.string().trim().min(1).max(200).optional(),
    username: z.string().trim().min(2).max(50).optional(),
    phone: z.string().trim().min(5).max(40).optional(),
    country: z.string().trim().min(1).max(10).optional(),
    avatarDataUrl: z.string().max(2_000_000).optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "No fields to update",
  });

function jsonUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    username: user.username,
    phone: user.phone,
    country: user.country,
    avatarDataUrl: user.avatarDataUrl || "",
  };
}

export async function GET(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  let payload;
  try {
    payload = await verifyAuthToken(token);
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const user = await User.findById(payload.userId).lean();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: jsonUser(user) });
}

export async function PATCH(request) {
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

  const parsed = patchMeSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const data = parsed.data;

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (data.fullName !== undefined) user.fullName = data.fullName;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.country !== undefined) user.country = data.country;
  if (data.avatarDataUrl !== undefined) user.avatarDataUrl = data.avatarDataUrl;

  if (data.username !== undefined) {
    const nextUsername = data.username.toLowerCase();
    if (nextUsername !== user.username) {
      const taken = await User.findOne({
        username: nextUsername,
        _id: { $ne: user._id },
      }).lean();
      if (taken) {
        return NextResponse.json({ error: "This username is already taken" }, { status: 409 });
      }
      user.username = nextUsername;
    }
  }

  try {
    await user.save();
  } catch (e) {
    if (e.code === 11000) {
      return NextResponse.json({ error: "This username is already taken" }, { status: 409 });
    }
    console.error("[PATCH /api/auth/me]", e);
    return NextResponse.json({ error: "Could not update profile" }, { status: 500 });
  }

  return NextResponse.json({ user: jsonUser(user) });
}
