import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/requireAdmin";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import VirtualCard from "@/lib/models/VirtualCard";

export const runtime = "nodejs";

const CARD_STATUSES = new Set(["pending", "pending_review", "active", "frozen", "rejected"]);

export async function GET(request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10) || 15));
  const q = (searchParams.get("q") || "").trim().slice(0, 80);
  const statusParam = searchParams.get("status") || "";
  const status = CARD_STATUSES.has(statusParam) ? statusParam : null;

  const base = {};
  if (status) base.status = status;

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
      const orClause = [{ maskedPan: rx }, { networkLabel: rx }];
      if (userIds.length) orClause.push({ userId: { $in: userIds } });
      finalFilter = Object.keys(base).length ? { $and: [base, { $or: orClause }] } : { $or: orClause };
    }

    const [total, rows] = await Promise.all([
      VirtualCard.countDocuments(finalFilter),
      VirtualCard.find(finalFilter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "userId", select: "email fullName username deletedAt" })
        .select(
          "userId provider status networkLabel maskedPan expiryMonth expiryYear balanceUsd mode createdAt updatedAt",
        )
        .lean(),
    ]);

    const cards = rows.map((c) => {
      const u = c.userId;
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
        id: c._id.toString(),
        userId: populated ? u._id.toString() : String(c.userId),
        user,
        provider: c.provider,
        status: c.status,
        networkLabel: c.networkLabel,
        maskedPan: c.maskedPan,
        expiryMonth: c.expiryMonth,
        expiryYear: c.expiryYear,
        balanceUsd: c.balanceUsd,
        mode: c.mode,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return NextResponse.json({
      cards,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (e) {
    console.error("[admin/virtual-cards GET]", e);
    return NextResponse.json({ error: "Could not load virtual cards" }, { status: 500 });
  }
}
