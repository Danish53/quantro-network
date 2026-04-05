import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/requireAdmin";
import { ADMIN_MEMBER_LIST_FILTER } from "@/lib/admin/overviewStats";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";

export const runtime = "nodejs";

const KYC_STATUSES = new Set(["not_submitted", "pending", "approved", "rejected"]);

export async function GET(request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10) || 15));
  const q = (searchParams.get("q") || "").trim().slice(0, 80);
  const statusParam = searchParams.get("status") || "";
  const status = KYC_STATUSES.has(statusParam) ? statusParam : null;

  try {
    await connectDB();

    const parts = [{ ...ADMIN_MEMBER_LIST_FILTER }];
    if (status) parts.push({ kycStatus: status });
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(escaped, "i");
      parts.push({ $or: [{ email: rx }, { username: rx }, { fullName: rx }] });
    }
    const filter = parts.length > 1 ? { $and: parts } : parts[0];

    const [total, rows] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          "fullName email username deletedAt kycStatus kycSubmittedAt kycApprovedAt kycRejectedReason kycCountry kycState kycCity kycAddressLine1 kycPostalCode kycDateOfBirth kycSsnLast4 kycUsResident updatedAt createdAt",
        )
        .lean(),
    ]);

    const submissions = rows.map((u) => ({
      id: u._id.toString(),
      fullName: u.fullName,
      email: u.email,
      username: u.username,
      isActive: !u.deletedAt,
      kycStatus: u.kycStatus,
      kycSubmittedAt: u.kycSubmittedAt,
      kycApprovedAt: u.kycApprovedAt,
      kycRejectedReason: u.kycRejectedReason || "",
      kycCountry: u.kycCountry || "",
      kycState: u.kycState || "",
      kycCity: u.kycCity || "",
      kycAddressLine1: u.kycAddressLine1 || "",
      kycPostalCode: u.kycPostalCode || "",
      kycDateOfBirth: u.kycDateOfBirth || "",
      kycSsnLast4: u.kycSsnLast4 || "",
      kycUsResident: Boolean(u.kycUsResident),
      updatedAt: u.updatedAt,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      submissions,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (e) {
    console.error("[admin/kyc GET]", e);
    return NextResponse.json({ error: "Could not load KYC records" }, { status: 500 });
  }
}
