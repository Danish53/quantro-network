import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/requireAdmin";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Wallet from "@/lib/models/Wallet";

export const runtime = "nodejs";

const ASSETS = new Set(["USDT_BNB", "USDC_BNB", "ETH"]);

export async function GET(request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10) || 15));
  const q = (searchParams.get("q") || "").trim().slice(0, 80);
  const assetParam = searchParams.get("asset") || "";
  const asset = ASSETS.has(assetParam) ? assetParam : null;

  const base = {};
  if (asset) base.asset = asset;

  try {
    await connectDB();

    let finalFilter = Object.keys(base).length ? base : {};
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(escaped, "i");
      const matchingUsers = await User.find({
        $or: [{ email: rx }, { username: rx }, { fullName: rx }],
      })
        .select("_id")
        .lean();
      const userIds = matchingUsers.map((u) => u._id);
      const orClause = [{ address: rx }, { network: rx }];
      if (userIds.length) orClause.push({ userId: { $in: userIds } });
      finalFilter = Object.keys(base).length ? { $and: [base, { $or: orClause }] } : { $or: orClause };
    }

    const [total, rows] = await Promise.all([
      Wallet.countDocuments(finalFilter),
      Wallet.find(finalFilter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "userId", select: "email fullName username deletedAt" })
        .lean(),
    ]);

    const wallets = rows.map((w) => {
      const u = w.userId;
      const populated = u && typeof u === "object" && u._id;
      const user = populated
        ? {
            id: u._id.toString(),
            email: u.email,
            fullName: u.fullName,
            username: u.username,
            isActive: !u.deletedAt,
          }
        : null;
      return {
        id: w._id.toString(),
        userId: populated ? u._id.toString() : String(w.userId),
        user,
        asset: w.asset,
        network: w.network,
        address: w.address,
        balance: w.balance,
        lockedBalance: w.lockedBalance,
        mode: w.mode,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      };
    });

    return NextResponse.json({
      wallets,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (e) {
    console.error("[admin/crypto-wallets GET]", e);
    return NextResponse.json({ error: "Could not load wallets" }, { status: 500 });
  }
}
