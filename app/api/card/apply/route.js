import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import VirtualCard from "@/lib/models/VirtualCard";
import User from "@/lib/models/User";
import { reconcileMockKycStatus } from "@/lib/kyc/mockKyc";
import { createMockStripeCard, reconcileMockCardLifecycle, serializeCard } from "@/lib/card/mockStripeCard";

export const runtime = "nodejs";
const USA_ALLOWED = new Set(["US", "USA", "UNITED STATES", "UNITED STATES OF AMERICA"]);

export async function POST(request) {
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
  if (user.kycStatus !== "approved") {
    return NextResponse.json(
      { error: "KYC approval is required before card application", kycStatus: user.kycStatus },
      { status: 403 },
    );
  }
  const countryCode = String(user.country ?? "").trim().toUpperCase();
  if (!USA_ALLOWED.has(countryCode)) {
    return NextResponse.json({ error: "Virtual card is currently available for USA users only" }, { status: 403 });
  }

  const existing = await VirtualCard.findOne({ userId });
  if (existing) {
    await reconcileMockCardLifecycle(existing);
    return NextResponse.json({ error: "Virtual card already exists", card: serializeCard(existing) }, { status: 409 });
  }

  const card = await VirtualCard.create(await createMockStripeCard({ userId }));

  return NextResponse.json({
    ok: true,
    card: serializeCard(card),
  });
}
