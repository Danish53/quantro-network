import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import WalletRequest from "@/lib/models/WalletRequest";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const amount = Number(body.amount);
    const adminWalletAddress = (body.adminWalletAddress || "").trim();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const newRequest = await WalletRequest.create({
      user: "64b7f0c9e1d3c2a5f0a1b2c3", // hardcoded for testing
      amount,
      adminWalletAddress,   // ← yeh add karo
    });

    return NextResponse.json({
      success: true,
      request: {
        id: newRequest._id.toString(),
        amount: newRequest.amount,
        status: newRequest.status,
        adminWalletAddress: newRequest.adminWalletAddress,
        createdAt: newRequest.createdAt,
      },
    });
  } catch (e) {
    console.error("[wallet-request POST]", e);
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
  }
}