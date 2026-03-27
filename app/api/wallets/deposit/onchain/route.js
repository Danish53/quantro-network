import { NextResponse } from "next/server";
import { z } from "zod";
import { createPublicClient, decodeFunctionData, erc20Abi, formatUnits, http, isAddressEqual } from "viem";
import { bsc } from "wagmi/chains";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import Wallet from "@/lib/models/Wallet";
import WalletTransaction from "@/lib/models/WalletTransaction";
import { createOnchainDeposit, ensureUserWallets, serializeWallet, serializeWalletTransaction } from "@/lib/wallet/mockWalletService";

export const runtime = "nodejs";

const TOKENS = {
  USDT_BNB: { address: "0x55d398326f99059fF775485246999027B3197955", chain: bsc, decimals: 18 },
  USDC_BNB: { address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", chain: bsc, decimals: 18 },
};

const schema = z.object({
  asset: z.enum(["USDT_BNB", "USDC_BNB"]),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
  fromAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
});

function getTreasuryAddress() {
  const v = process.env.NEXT_PUBLIC_BSC_TREASURY_ADDRESS;
  if (!v) throw new Error("BSC treasury address not configured");
  return v;
}

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

  const { asset, txHash, fromAddress } = parsed.data;
  let treasury;
  try {
    treasury = getTreasuryAddress();
  } catch (e) {
    return NextResponse.json({ error: e.message || "Treasury not configured" }, { status: 500 });
  }

  const token = TOKENS[asset];
  const publicClient = createPublicClient({
    chain: token.chain,
    transport: http(),
  });

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  await ensureUserWallets(userId);
  const wallet = await Wallet.findOne({ userId, asset });
  if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

  const existing = await WalletTransaction.findOne({ txHash });
  if (existing) {
    return NextResponse.json({ error: "Transaction already processed" }, { status: 409 });
  }

  const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
  if (!receipt || receipt.status !== "success") {
    return NextResponse.json({ error: "Transaction not successful" }, { status: 400 });
  }

  const tx = await publicClient.getTransaction({ hash: txHash });
  if (!tx || !tx.to || !isAddressEqual(tx.to, token.address)) {
    return NextResponse.json({ error: "Invalid token contract for this asset" }, { status: 400 });
  }
  if (!isAddressEqual(tx.from, fromAddress)) {
    return NextResponse.json({ error: "Sender does not match connected wallet" }, { status: 400 });
  }

  let decoded;
  try {
    decoded = decodeFunctionData({ abi: erc20Abi, data: tx.input });
  } catch {
    return NextResponse.json({ error: "Not an ERC-20 transfer transaction" }, { status: 400 });
  }

  if (decoded.functionName !== "transfer") {
    return NextResponse.json({ error: "Not a transfer transaction" }, { status: 400 });
  }

  const [toArg, valueArg] = decoded.args;
  if (!isAddressEqual(toArg, treasury)) {
    return NextResponse.json({ error: "Transfer destination does not match platform treasury" }, { status: 400 });
  }

  const amount = Number(formatUnits(valueArg, token.decimals));
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const dbTx = await createOnchainDeposit({ wallet, amount, txHash, fromAddress });
  await ensureUserWallets(userId);
  const updated = await Wallet.findOne({ userId, asset });
  return NextResponse.json({
    ok: true,
    wallet: serializeWallet(updated),
    transaction: serializeWalletTransaction(dbTx),
  });
}
