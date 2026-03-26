import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import Wallet from "@/lib/models/Wallet";
import { createDeposit, ensureUserWallets, serializeWallet, serializeWalletTransaction } from "@/lib/wallet/mockWalletService";

export const runtime = "nodejs";

const schema = z.object({
  asset: z.enum(["USDT_BNB", "USDC_BNB", "ETH"]),
  amount: z.number().positive().max(1000000),
});

export async function POST(request) {
  const userId = await getAuthUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  await ensureUserWallets(userId);
  const wallet = await Wallet.findOne({ userId, asset: parsed.data.asset });
  if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

  const tx = await createDeposit({ wallet, amount: parsed.data.amount });
  return NextResponse.json({ ok: true, wallet: serializeWallet(wallet), transaction: serializeWalletTransaction(tx) });
}
