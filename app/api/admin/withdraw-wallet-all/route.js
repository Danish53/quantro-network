import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import WalletWithdrawal from "@/lib/models/WalletWithdrawal";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const result = await WalletWithdrawal.aggregate([
      {
        $match: {
          status: { $in: ["approved", "pending"] }, // safer
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalRequests: { $sum: 1 },
        },
      },
    ]);

    const data = result[0] || {
      totalAmount: 0,
      totalRequests: 0,
    };

    const list = await WalletWithdrawal.find()
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({
      totalWithdrawals: data.totalAmount,
      totalRequests: data.totalRequests,
      withdrawals: list, // 👈 LIST ADD KAR DI
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch total" },
      { status: 500 }
    );
  }
}