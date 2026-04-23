import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/requireAdmin";
import connectDB from "@/lib/db/mongoose";
import WalletRequest from "@/lib/models/WalletRequest";
import User from "@/lib/models/User";

export const runtime = "nodejs";

const STATUSES = new Set(["pending", "approved", "rejected"]);

export async function GET(request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "10", 10)));

  const q = (searchParams.get("q") || "").trim();
  const statusParam = searchParams.get("status");
  const status = STATUSES.has(statusParam) ? statusParam : null;

  try {
    await connectDB();

    let filter = {};
    if (status) filter.status = status;

    // 🔍 search by user/email/name
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

      const users = await User.find({
        $or: [{ email: rx }, { username: rx }, { fullName: rx }],
      })
        .select("_id")
        .lean();

      const userIds = users.map((u) => u._id);

      filter = {
        $and: [
          filter,
          {
            $or: [
              { adminWalletAddress: rx },
              { user: { $in: userIds } },
            ],
          },
        ],
      };
    }

    const [total, rows] = await Promise.all([
      WalletRequest.countDocuments(filter),
      WalletRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "user",
          select: "email fullName username",
        })
        .lean(),
    ]);

    const requests = rows.map((r) => ({
      id: r._id.toString(),
      amount: r.amount,
      status: r.status,
      adminWalletAddress: r.adminWalletAddress || "",
      adminNote: r.adminNote || "",
      createdAt: r.createdAt,
      approvedAt: r.approvedAt || null,
      rejectedAt: r.rejectedAt || null,
      user: r.user
        ? {
            id: r.user._id.toString(),
            email: r.user.email,
            fullName: r.user.fullName,
            username: r.user.username,
          }
        : null,
    }));

    return NextResponse.json({
      requests,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (e) {
    console.error("[admin/wallet-requests GET]", e);
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 });
  }
}