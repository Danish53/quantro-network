"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";
import DashboardToast from "./DashboardToast";

const cardShell =
  "rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6";

const WALLET_ROWS = [
  { asset: "USDT_BNB", titleKey: "dash.wal.usdt", netKey: "dash.wal.usdt_net", color: "from-emerald-600/30 to-emerald-900/20" },
  { asset: "USDC_BNB", titleKey: "dash.wal.usdc", netKey: "dash.wal.usdc_net", color: "from-blue-600/30 to-blue-900/20" },
  { asset: "ETH", titleKey: "dash.wal.eth", netKey: "dash.wal.eth_net", color: "from-violet-600/30 to-violet-900/20" },
];

export default function WalletsView() {
  const { t } = useSiteTranslation();
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyAsset, setBusyAsset] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const money = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }),
    [],
  );

  async function refreshData() {
    const [wRes, txRes] = await Promise.all([
      fetch("/api/wallets/me", { credentials: "include" }),
      fetch("/api/wallets/transactions", { credentials: "include" }),
    ]);
    const wData = await wRes.json().catch(() => ({}));
    const txData = await txRes.json().catch(() => ({}));
    if (!wRes.ok) throw new Error(wData?.error || t("dash.wal.err_load"));
    if (!txRes.ok) throw new Error(txData?.error || t("dash.wal.err_load_tx"));
    setWallets(Array.isArray(wData.wallets) ? wData.wallets : []);
    setTransactions(Array.isArray(txData.transactions) ? txData.transactions : []);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        await refreshData();
      } catch (e) {
        if (!cancelled) setError(e.message || t("dash.wal.err_load"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  async function quickWithdraw(asset) {
    try {
      setBusyAsset(asset);
      setError("");
      setNotice("");
      const res = await fetch("/api/wallets/withdraw/mock", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset,
          amount: asset === "ETH" ? 0.01 : 25,
          destinationAddress: "0xMockExternalDestination12345",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || t("dash.wal.err_withdraw"));
      await refreshData();
      setNotice(t("dash.wal.withdraw_ok"));
    } catch (e) {
      setError(e.message || t("dash.wal.err_withdraw"));
    } finally {
      setBusyAsset("");
    }
  }

  function statusLabel(status) {
    if (status === "completed") return t("dash.wal.status_completed");
    if (status === "pending") return t("dash.wal.status_pending");
    if (status === "failed") return t("dash.wal.status_failed");
    return status;
  }

  function typeLabel(type) {
    if (type === "deposit") return t("dash.wal.type_deposit");
    if (type === "withdrawal") return t("dash.wal.type_withdraw");
    if (type === "convert_out") return t("dash.wal.type_convert");
    return type;
  }

  return (
    <DashboardStandardPage titleKey="dash.wal.title" breadcrumbLastKey="dash.wal.title">
      <p className="mb-6 max-w-3xl text-sm text-slate-400">{t("dash.wal.subtitle")}</p>
      <div className="pointer-events-none fixed right-4 top-20 z-[80] space-y-2 sm:right-6">
        <DashboardToast type="error" message={error} onClose={() => setError("")} />
        <DashboardToast type="success" message={notice} onClose={() => setNotice("")} />
      </div>
      {loading ? (
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${cardShell} animate-pulse`}>
              <div className="h-4 w-28 rounded bg-white/10" />
              <div className="mt-2 h-3 w-36 rounded bg-white/10" />
              <div className="mt-3 h-3 w-full rounded bg-white/10" />
              <div className="mt-4 h-7 w-24 rounded bg-white/10" />
              <div className="mt-6 h-9 w-full rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : null}
      {!loading ? <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {WALLET_ROWS.map((w) => {
          const wallet = wallets.find((x) => x.asset === w.asset);
          return (
          <div key={w.asset} className={`${cardShell} flex flex-col bg-gradient-to-br ${w.color}`}>
            <p className="text-sm font-semibold text-white">{t(w.titleKey)}</p>
            <p className="mt-1 text-xs text-slate-400">{t(w.netKey)}</p>
            <p className="mt-2 truncate text-xs text-slate-500">{wallet?.address || "—"}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">{t("dash.wal.balance")}</p>
            <p className="text-2xl font-bold text-white">{loading ? "..." : money.format(wallet?.balance || 0)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/dashboard/fund"
                className="flex-1 rounded-[10px] bg-[#2563eb] px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
              >
                {t("dash.wal.deposit")}
              </Link>
              <button
                type="button"
                onClick={() => quickWithdraw(w.asset)}
                disabled={busyAsset === w.asset || loading}
                className="flex-1 rounded-[10px] border border-white/15 bg-transparent px-3 py-2 text-center text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                {busyAsset === w.asset ? t("dash.wal.working") : t("dash.wal.withdraw")}
              </button>
            </div>
          </div>
          );
        })}
      </div> : null}

      {!loading ? <div className={`${cardShell} mt-6`}>
        <h2 className="text-lg font-semibold text-white">{t("dash.wal.history_title")}</h2>
        <div className="mt-4 overflow-x-auto dashboard-sidebar-scroll">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-3 py-2 font-medium text-[#a0aec0]">{t("dash.wal.col_asset")}</th>
                <th className="px-3 py-2 font-medium text-[#a0aec0]">{t("dash.wal.col_type")}</th>
                <th className="px-3 py-2 font-medium text-[#a0aec0]">{t("dash.wal.col_amount")}</th>
                <th className="px-3 py-2 font-medium text-[#a0aec0]">{t("dash.wal.col_status")}</th>
                <th className="px-3 py-2 font-medium text-[#a0aec0]">{t("dash.wal.col_date")}</th>
              </tr>
            </thead>
            <tbody>
              {!transactions.length ? (
                <tr>
                  <td colSpan={5} className="px-3 py-12 text-center text-slate-500">
                    {t("dash.wal.history_empty")}
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-3 py-3 text-slate-300">{tx.asset}</td>
                    <td className="px-3 py-3 text-slate-300">{typeLabel(tx.type)}</td>
                    <td className={`px-3 py-3 ${tx.direction === "debit" ? "text-rose-300" : "text-emerald-300"}`}>
                      {tx.direction === "debit" ? "-" : "+"}
                      {money.format(tx.amount)}
                    </td>
                    <td className="px-3 py-3 text-slate-300">{statusLabel(tx.status)}</td>
                    <td className="px-3 py-3 text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div> : null}
    </DashboardStandardPage>
  );
}
