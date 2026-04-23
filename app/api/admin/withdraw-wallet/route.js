import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import WalletWithdrawal from "@/lib/models/WalletWithdrawal";
import WalletRequest from "@/lib/models/WalletRequest";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const amount = Number(body.amount);
    const walletAddress = (body.walletAddress || "").trim();

    // =========================
    // VALIDATION
    // =========================
    if (!amount || amount <= 0 || isNaN(amount)) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // =========================
    // TOTAL DEPOSITS (APPROVED)
    // =========================
    const depositAgg = await WalletRequest.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          totalDeposits: { $sum: "$amount" },
        },
      },
    ]);

    const totalDeposits = depositAgg[0]?.totalDeposits || 0;

    // =========================
    // TOTAL WITHDRAWALS (APPROVED ONLY)
    // =========================
    const withdrawalAgg = await WalletWithdrawal.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          totalWithdrawals: { $sum: "$amount" },
        },
      },
    ]);

    const totalWithdrawals = withdrawalAgg[0]?.totalWithdrawals || 0;

    const availableBalance = totalDeposits - totalWithdrawals;

    console.log("DEPOSITS:", totalDeposits);
    console.log("WITHDRAWALS:", totalWithdrawals);
    console.log("AVAILABLE:", availableBalance);

    // =========================
    // BALANCE CHECK
    // =========================
    if (amount > availableBalance) {
      return NextResponse.json(
        {
          error: "Insufficient balance",
          availableBalance,
          requested: amount,
        },
        { status: 400 }
      );
    }

    // =========================
    // CREATE WITHDRAWAL
    // =========================
    console.log("CREATING WITHDRAWAL...");

    const newWithdrawal = await WalletWithdrawal.create({
      user: "64b7f0c9e1d3c2a5f0a1b2c3",
      amount,
      walletAddress,
      status: "pending",
    });

    console.log("CREATED:", newWithdrawal);

    return NextResponse.json({
      success: true,
      withdrawal: newWithdrawal,
      balance: {
        totalDeposits,
        totalWithdrawals,
        availableBalance,
      },
    });

  } catch (e) {
    console.error("[wallet-withdrawal POST ERROR]", e);

    return NextResponse.json(
      { error: "Server error", details: e.message },
      { status: 500 }
    );
  }
}