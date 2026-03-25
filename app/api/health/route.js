import { NextResponse } from "next/server";

/** Quick check that API routes resolve (use if /api/auth/* returns 404). */
export async function GET() {
  return NextResponse.json({ ok: true, api: "quantro-network" });
}
