import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import VirtualCard from "@/lib/models/VirtualCard";
import VirtualCardTransaction from "@/lib/models/VirtualCardTransaction";
import { reconcileMockCardLifecycle } from "@/lib/card/mockStripeCard";

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
    return NextResponse.json({ transactions: [] }, { status: 200 });
  }
  await reconcileMockCardLifecycle(card);

  const transactions = await VirtualCardTransaction.find({ userId, cardId: card._id })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return NextResponse.json({
    transactions: transactions.map((tx) => ({
      id: tx._id.toString(),
      merchant: tx.merchant,
      amountUsd: tx.amountUsd,
      status: tx.status,
      createdAt: tx.createdAt,
      mode: tx.mode,
    })),
  });
}
