import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/requireAdmin";
import User from "@/lib/models/User";
import { ADMIN_MEMBER_LIST_FILTER } from "@/lib/admin/overviewStats";

export const runtime = "nodejs";

export async function GET(request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10) || 15));
  const q = (searchParams.get("q") || "").trim().slice(0, 80);

  const filter = q
    ? (() => {
        const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        return {
          $and: [ADMIN_MEMBER_LIST_FILTER, { $or: [{ email: rx }, { username: rx }, { fullName: rx }] }],
        };
      })()
    : ADMIN_MEMBER_LIST_FILTER;

  try {
    const [total, rows] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("fullName email username kycStatus createdAt deletedAt")
        .lean(),
    ]);

    const users = rows.map((u) => ({
      id: u._id.toString(),
      fullName: u.fullName,
      email: u.email,
      username: u.username,
      kycStatus: u.kycStatus,
      createdAt: u.createdAt,
      isActive: !u.deletedAt,
      deactivatedAt: u.deletedAt ? new Date(u.deletedAt).toISOString() : null,
    }));

    return NextResponse.json({
      users,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (e) {
    console.error("[admin/users GET]", e);
    return NextResponse.json({ error: "Could not load users" }, { status: 500 });
  }
}
