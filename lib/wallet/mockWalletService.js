import mongoose from "mongoose";
import Wallet from "@/lib/models/Wallet";
import WalletTransaction from "@/lib/models/WalletTransaction";
import VirtualCard from "@/lib/models/VirtualCard";
import VirtualCardTransaction from "@/lib/models/VirtualCardTransaction";

const WALLET_DEFS = [
  { asset: "USDT_BNB", network: "BNB Smart Chain (BEP-20)" },
  { asset: "USDC_BNB", network: "BNB Smart Chain (BEP-20)" },
  { asset: "ETH", network: "Ethereum Mainnet" },
];

const MOCK_PRICES = {
  USDT_BNB: 1.0,
  USDC_BNB: 1.0,
  ETH: 3200.0,
};
const DEFAULT_WITHDRAW_COMPLETE_SECONDS = 45;

function shortUser(userId) {
  return String(userId).slice(-8);
}

function makeAddress(asset, userId) {
  const seed = shortUser(userId);
  if (asset === "ETH") return `0x${seed.padStart(40, "a")}`;
  return `0x${seed.padStart(40, "b")}`;
}

function makeRef(prefix) {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

export function serializeWallet(wallet) {
  return {
    id: wallet._id.toString(),
    asset: wallet.asset,
    network: wallet.network,
    address: wallet.address,
    balance: wallet.balance,
    lockedBalance: wallet.lockedBalance,
    mode: wallet.mode,
  };
}

export function serializeWalletTransaction(tx) {
  return {
    id: tx._id.toString(),
    walletId: tx.walletId.toString(),
    asset: tx.asset,
    type: tx.type,
    direction: tx.direction,
    amount: tx.amount,
    status: tx.status,
    reference: tx.reference,
    note: tx.note,
    createdAt: tx.createdAt,
  };
}

export async function ensureUserWallets(userId) {
  const oid = typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;
  const existing = await Wallet.find({ userId: oid }).lean();
  const byAsset = new Set(existing.map((w) => w.asset));

  const toInsert = WALLET_DEFS.filter((def) => !byAsset.has(def.asset)).map((def) => ({
    userId: oid,
    asset: def.asset,
    network: def.network,
    address: makeAddress(def.asset, oid.toString()),
    mode: "mock",
    balance: 0,
    lockedBalance: 0,
  }));

  if (toInsert.length) {
    await Wallet.insertMany(toInsert, { ordered: false }).catch(() => {});
  }

  return Wallet.find({ userId: oid }).sort({ asset: 1 });
}

export async function createDeposit({ wallet, amount }) {
  wallet.balance += amount;
  await wallet.save();
  const tx = await WalletTransaction.create({
    userId: wallet.userId,
    walletId: wallet._id,
    type: "deposit",
    asset: wallet.asset,
    amount,
    status: "completed",
    reference: makeRef("DEP"),
    direction: "credit",
    note: "Mock deposit confirmed",
    mode: "mock",
  });
  return tx;
}

export async function createWithdrawal({ wallet, amount, destinationAddress }) {
  if (wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }
  wallet.balance -= amount;
  await wallet.save();
  const tx = await WalletTransaction.create({
    userId: wallet.userId,
    walletId: wallet._id,
    type: "withdrawal",
    asset: wallet.asset,
    amount,
    status: "pending",
    reference: makeRef("WDR"),
    direction: "debit",
    note: `Mock withdrawal to ${destinationAddress.slice(0, 10)}...`,
    mode: "mock",
  });
  return tx;
}

export async function convertToCardUsd({ wallet, amount }) {
  if (wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }
  const card = await VirtualCard.findOne({ userId: wallet.userId });
  if (!card || card.status !== "active") {
    throw new Error("Active virtual card is required");
  }

  const rate = MOCK_PRICES[wallet.asset] ?? 1;
  const usdValue = Number((amount * rate).toFixed(2));
  wallet.balance -= amount;
  await wallet.save();

  card.balanceUsd = Number((card.balanceUsd + usdValue).toFixed(2));
  await card.save();

  const txOut = await WalletTransaction.create({
    userId: wallet.userId,
    walletId: wallet._id,
    type: "convert_out",
    asset: wallet.asset,
    amount,
    status: "completed",
    reference: makeRef("CVT"),
    direction: "debit",
    note: `Converted to card USD at ${rate}`,
    mode: "mock",
  });

  await VirtualCardTransaction.create({
    cardId: card._id,
    userId: wallet.userId,
    merchant: `Crypto conversion (${wallet.asset})`,
    amountUsd: usdValue,
    status: "approved",
    mode: "mock",
  });

  return { txOut, usdValue, rate };
}

export function getMockRate(asset) {
  return MOCK_PRICES[asset] ?? 1;
}

function getWithdrawCompleteMs() {
  const raw = Number(process.env.MOCK_WITHDRAW_COMPLETE_SECONDS ?? DEFAULT_WITHDRAW_COMPLETE_SECONDS);
  const sec = Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_WITHDRAW_COMPLETE_SECONDS;
  return sec * 1000;
}

export async function reconcilePendingWithdrawals(userId) {
  const oid = typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;
  const cutoff = new Date(Date.now() - getWithdrawCompleteMs());
  await WalletTransaction.updateMany(
    {
      userId: oid,
      type: "withdrawal",
      status: "pending",
      createdAt: { $lte: cutoff },
    },
    {
      $set: { status: "completed", note: "Mock withdrawal completed" },
    },
  );
}
