import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth/jwt";
import { effectiveUserRole } from "@/lib/auth/roles";

/**
 * @param {Request} request
 * @returns {Promise<{ ok: true, adminId: string } | { ok: false, response: Response }>}
 */
export async function requireAdmin(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  let payload;
  try {
    payload = await verifyAuthToken(token);
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  try {
    await connectDB();
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Database unavailable" }, { status: 503 }) };
  }
  const user = await User.findById(payload.userId).lean();
  if (!user || user.deletedAt || effectiveUserRole(user) !== "admin") {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, adminId: user._id.toString() };
}
