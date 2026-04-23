"use client";
import logousdt from "@/public/images/image.png";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function WithdrawalPage() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formErr, setFormErr] = useState("");
  const [formOk, setFormOk] = useState("");

  const [withdrawals, setWithdrawals] = useState([]);

    // amount total usdt
    const [totalAmount, setTotalAmount] = useState(0);
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      async function fetchTotal() {
        try {
          const res = await fetch("/api/admin/wallet-requests-all?limit=50", {
            credentials: "include",
          });
          const json = await res.json().catch(() => ({}));
  
          if (res.ok && json.requests) {
            // const total = json.requests.reduce((sum, r) => sum + (r.amount || 0), 0);
            setTotalAmount(json.totalApprovedAmount || 0);
            setCount(json.total || json.requests.length);
          }
        } catch {
          // silent
        }
      }
      fetchTotal();
    }, []);

  // =========================
  // GET API (LOAD HISTORY)
  // =========================
  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/withdraw-wallet-all?page=1&limit=10");
      const json = await res.json();

      if (!res.ok) {
        setFormErr(json.error || "Failed to load withdrawals");
        return;
      }

      setWithdrawals(json.withdrawals || []);
    } catch {
      setFormErr("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  // =========================
  // POST API (CREATE WITHDRAWAL)
  // =========================
  const onSubmit = async (e) => {
    e.preventDefault();
    setFormErr("");
    setFormOk("");

    if (!amount || Number(amount) <= 0) {
      setFormErr("Enter valid amount");
      return;
    }

    if (!walletAddress) {
      setFormErr("Enter wallet address");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/withdraw-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          walletAddress,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormErr(json.error || "Failed to submit");
        return;
      }

      setFormOk("Withdrawal request submitted");

      setAmount("");
      setWalletAddress("");

      // refresh table
      loadWithdrawals();
    } catch {
      setFormErr("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 text-slate-100">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">
          Withdrawal
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Withdraw your funds securely
        </p>
         <Link href="/dashboard/admin/withdrawals">
          
          <button className="flex items-center gap-2 mt-3 rounded-[10px] px-4 py-2 text-sm text-slate-200 transition">

  {/* Label */}
  {/* <span className="text-slate-400">Wallet Requests</span> */}

  {/* USDT ICON + AMOUNT */}
  <div className="flex items-center gap-2">
    <span className="text-slate-400 text-xs">Total Balance</span>
    
    {/* USDT Icon */}
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
      <Image src={logousdt} alt="USDT" width={20} height={20} />
    </span>

    {/* Amount */}
    <span className="font-semibold text-slate-200 text-lg">
      {totalAmount.toLocaleString()} USDT
    </span>
  </div>

  {/* Count Badge */}
  {/* <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400">
    {count}
  </span> */}

</button>
</Link>
      </div>

      {/* INFO BOX */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-sm text-indigo-100">
        <p className="font-semibold text-indigo-200 mb-1">
          Withdrawal Network Info
        </p>
        <p>
          Use <span className="font-semibold">Ethereum (ETH)</span> network for USDT withdrawals.
        </p>
      </div>

      {/* FORM */}
      <div className="rounded-[10px] border border-white/[0.08] bg-[#141235]/60 p-5 ring-1 ring-white/[0.04]">

        <form onSubmit={onSubmit} className="space-y-4">

          {/* AMOUNT */}
          <div>
            <label className="text-xs text-slate-500">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-1 w-full h-10 rounded-[9px] bg-[#0F0D2E] border border-white/10 px-3 text-sm"
            />
          </div>

          {/* WALLET ADDRESS (USER INPUT NOW) */}
          <div>
            <label className="text-xs text-slate-500">
              Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your wallet address"
              className="mt-1 w-full h-10 rounded-[9px] bg-[#0F0D2E] border border-white/10 px-3 text-sm font-mono"
            />
          </div>

          {/* ERROR */}
          {formErr && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-2 rounded text-sm">
              {formErr}
            </div>
          )}

          {/* SUCCESS */}
          {formOk && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded text-sm">
              {formOk}
            </div>
          )}

          {/* SUBMIT */}
          <button
            disabled={submitting}
            type="submit"
            className="px-4 h-10 rounded-[9px] bg-indigo-600 hover:bg-indigo-700 transition text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Withdrawal"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="rounded-[10px] border border-white/[0.08] bg-[#141235] overflow-hidden">

        <div className="p-4 text-sm font-semibold border-b border-white/10">
          Withdrawal History
        </div>

        <table className="w-full text-sm text-slate-200">
          <thead className="text-xs text-slate-400 bg-[#0F0D2E]">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Wallet</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : withdrawals.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-slate-400">
                  No withdrawals found
                </td>
              </tr>
            ) : (
              withdrawals.map((w) => (
                <tr key={w.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    {w.amount} USDT
                  </td>

                  <td className="px-4 py-3 text-amber-400 capitalize">
                    {w.status}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-slate-400">
                    {w.walletAddress?.slice(0, 6)}...
                    {w.walletAddress?.slice(-4)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}