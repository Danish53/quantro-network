import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth/jwt";

export const runtime = "nodejs";

function clearCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return { httpOnly: true, path: "/", sameSite: "lax", secure, maxAge: 0 };
}

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", clearCookieOptions());
  return res;
}
