import { NextResponse } from "next/server";

/** Mock deposits are disabled; use on-chain flow at POST /api/wallets/deposit/onchain */
export async function POST() {
  return NextResponse.json(
    {
      error: "Mock deposits are disabled. Send USDT or USDC on BNB Smart Chain from your connected wallet via the Fund page.",
    },
    { status: 410 },
  );
}
