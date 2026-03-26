import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import VirtualCard from "@/lib/models/VirtualCard";

export const runtime = "nodejs";

export async function POST(request) {
  const userId = await getAuthUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const card = await VirtualCard.findOne({ userId });
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  if (card.status !== "active") {
    return NextResponse.json({ error: "Only active cards can be frozen" }, { status: 409 });
  }

  card.status = "frozen";
  await card.save();

  return NextResponse.json({ ok: true, status: card.status });
}
