import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import {
  ensureUserWallets,
  reconcilePendingWithdrawals,
  serializeWalletTransaction,
} from "@/lib/wallet/mockWalletService";
import WalletTransaction from "@/lib/models/WalletTransaction";

export const runtime = "nodejs";

export async function GET(request) {
  const userId = await getAuthUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  await ensureUserWallets(userId);
  await reconcilePendingWithdrawals(userId);
  const transactions = await WalletTransaction.find({ userId }).sort({ createdAt: -1 }).limit(50);
  return NextResponse.json({ transactions: transactions.map(serializeWalletTransaction) });
}
