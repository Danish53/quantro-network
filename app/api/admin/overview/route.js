import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/requireAdmin";
import { buildAdminOverview } from "@/lib/admin/overviewStats";

export const runtime = "nodejs";

const RANGES = new Set(["7d", "8w", "12m"]);

export async function GET(request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "7d";
  if (!RANGES.has(range)) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  try {
    const data = await buildAdminOverview(range);
    return NextResponse.json(data);
  } catch (e) {
    console.error("[admin/overview]", e);
    return NextResponse.json({ error: "Could not load overview" }, { status: 500 });
  }
}
