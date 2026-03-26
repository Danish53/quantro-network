import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import User from "@/lib/models/User";

export const runtime = "nodejs";

const submitSchema = z.object({
  docType: z.enum(["national_id", "passport", "license"]),
  docNumber: z.string().trim().min(2).max(80).optional().or(z.literal("")),
  hasFrontImage: z.boolean(),
  hasBackImage: z.boolean().optional(),
});

export async function POST(request) {
  const userId = await getAuthUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  if (!parsed.data.hasFrontImage) {
    return NextResponse.json({ error: "Front document image is required" }, { status: 400 });
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

  user.kycStatus = "pending";
  user.kycSubmittedAt = new Date();
  user.kycApprovedAt = null;
  user.kycRejectedReason = "";
  await user.save();

  return NextResponse.json({
    ok: true,
    kyc: {
      status: user.kycStatus,
      submittedAt: user.kycSubmittedAt,
      approvedAt: user.kycApprovedAt,
      rejectedReason: user.kycRejectedReason,
    },
  });
}
