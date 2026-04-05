import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/requireAdmin";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import WalletTransaction from "@/lib/models/WalletTransaction";

export const runtime = "nodejs";

const TX_TYPES = new Set(["deposit", "withdrawal"]);
const STATUSES = new Set(["pending", "completed", "failed"]);

export async function GET(request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (!TX_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid or missing type" }, { status: 400 });
  }

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10) || 15));
  const q = (searchParams.get("q") || "").trim().slice(0, 80);
  const statusParam = searchParams.get("status") || "";
  const status = STATUSES.has(statusParam) ? statusParam : null;

  const base = { type };
  if (status) base.status = status;

  try {
    await connectDB();

    let finalFilter = base;
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(escaped, "i");
      const matchingUsers = await User.find({
        $or: [{ email: rx }, { username: rx }, { fullName: rx }],
      })
        .select("_id")
        .lean();
      const userIds = matchingUsers.map((u) => u._id);
      const orClause = [{ reference: rx }, { txHash: rx }];
      if (userIds.length) orClause.push({ userId: { $in: userIds } });
      finalFilter = { $and: [base, { $or: orClause }] };
    }
    const [total, rows] = await Promise.all([
      WalletTransaction.countDocuments(finalFilter),
      WalletTransaction.find(finalFilter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "userId", select: "email fullName username" })
        .lean(),
    ]);

    const transactions = rows.map((tx) => {
      const u = tx.userId;
      const populated = u && typeof u === "object" && u._id;
      const user = populated
        ? {
            id: u._id.toString(),
            email: u.email,
            fullName: u.fullName,
            username: u.username,
          }
        : null;
      const userIdStr = populated ? u._id.toString() : String(tx.userId);
      return {
        id: tx._id.toString(),
        userId: userIdStr,
        user,
        walletId: tx.walletId?.toString?.() ?? String(tx.walletId),
        asset: tx.asset,
        amount: tx.amount,
        status: tx.status,
        reference: tx.reference || "",
        txHash: tx.txHash || "",
        direction: tx.direction,
        mode: tx.mode,
        note: tx.note || "",
        createdAt: tx.createdAt,
      };
    });

    return NextResponse.json({
      transactions,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (e) {
    console.error("[admin/wallet-transactions GET]", e);
    return NextResponse.json({ error: "Could not load transactions" }, { status: 500 });
  }
}
