import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import User from "@/lib/models/User";
import { reconcileMockKycStatus } from "@/lib/kyc/mockKyc";

export const runtime = "nodejs";

function toKycPayload(user) {
  return {
    status: user.kycStatus ?? "not_submitted",
    submittedAt: user.kycSubmittedAt ?? null,
    approvedAt: user.kycApprovedAt ?? null,
    rejectedReason: user.kycRejectedReason ?? "",
  };
}

export async function GET(request) {
  const userId = await getAuthUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await reconcileMockKycStatus(user);
  return NextResponse.json({ kyc: toKycPayload(user) });
}
