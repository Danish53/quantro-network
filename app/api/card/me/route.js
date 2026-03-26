import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import VirtualCard from "@/lib/models/VirtualCard";
import { reconcileMockCardLifecycle, serializeCard } from "@/lib/card/mockStripeCard";

export const runtime = "nodejs";

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

  const card = await VirtualCard.findOne({ userId });
  if (!card) {
    return NextResponse.json({ card: null }, { status: 200 });
  }

  await reconcileMockCardLifecycle(card);
  return NextResponse.json({ card: serializeCard(card) });
}
