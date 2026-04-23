import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import WalletWithdrawal from "@/lib/models/WalletWithdrawal";
import WalletRequest from "@/lib/models/WalletRequest";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const userId = "64b7f0c9e1d3c2a5f0a1b2c3";
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // =========================
    // TOTAL APPROVED DEPOSITS
    // =========================
    const depositAgg = await WalletRequest.aggregate([
      {
        $match: {
          user: userObjectId,
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          totalDeposits: {
            $sum: { $toDouble: "$amount" }, // 🔥 FIX
          },
        },
      },
    ]);

    const totalDeposits = depositAgg[0]?.totalDeposits || 0;

    // =========================
    // TOTAL APPROVED WITHDRAWALS
    // =========================
    const withdrawalAgg = await WalletWithdrawal.aggregate([
      {
        $match: {
          user: userObjectId,
          status: "approved", // 🔥 ONLY APPROVED
        },
      },
      {
        $group: {
          _id: null,
          totalWithdrawals: {
            $sum: { $toDouble: "$amount" }, // 🔥 FIX
          },
        },
      },
    ]);

    const totalWithdrawals = withdrawalAgg[0]?.totalWithdrawals || 0;

    // =========================
    // FINAL BALANCE
    // =========================
    const availableBalance = totalDeposits - totalWithdrawals;

    console.log("DEPOSITS:", totalDeposits);
    console.log("WITHDRAWALS:", totalWithdrawals);
    console.log("BALANCE:", availableBalance);

    // =========================
    // LIST
    // =========================
    const list = await WalletWithdrawal.find({
      user: userObjectId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({
      withdrawals: list,
      totalDeposits,
      totalWithdrawals,
      availableBalance,
    });

  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}