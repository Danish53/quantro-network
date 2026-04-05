"use client";

import { useCallback, useEffect, useState } from "react";
import { useSiteTranslation } from "@/app/components/SiteTranslationProvider";
import { AdminWalletTransactionsTableSkeleton } from "./AdminSkeletonBlocks";

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function labelAsset(code) {
  switch (code) {
    case "USDT_BNB":
      return "USDT";
    case "USDC_BNB":
      return "USDC";
    case "ETH":
      return "ETH";
    default:
      return code || "—";
  }
}

function formatAmount(asset, n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  const max = asset === "ETH" ? 8 : 2;
  return x.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: max });
}

function statusBadgeClass(s) {
  switch (s) {
    case "completed":
      return "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25";
    case "pending":
      return "bg-amber-500/15 text-amber-100 ring-amber-500/25";
    case "failed":
      return "bg-rose-500/15 text-rose-100 ring-rose-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 ring-white/10";
  }
}

function truncate(s, max) {
  if (!s) return "—";
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

/**
 * @param {{ txType: "deposit" | "withdrawal" }} props
 */
export default function AdminWalletTransactionsPanel({ txType }) {
  const { t } = useSiteTranslation();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tmr = setTimeout(() => setDebouncedQ(q.trim()), 320);
    return () => clearTimeout(tmr);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, status]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const qs = new URLSearchParams({
        type: txType,
        page: String(page),
        limit: "15",
      });
      if (debouncedQ) qs.set("q", debouncedQ);
      if (status) qs.set("status", status);
      const res = await fetch(`/api/admin/wallet-transactions?${qs}`, { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof json.error === "string" ? json.error : t("admin.load_error"));
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setErr(t("admin.load_error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQ, status, txType, t]);

  useEffect(() => {
    load();
  }, [load]);

  const titleKey = txType === "deposit" ? "admin.tx_deposits_title" : "admin.tx_withdrawals_title";
  const subtitleKey = txType === "deposit" ? "admin.tx_deposits_subtitle" : "admin.tx_withdrawals_subtitle";
  const initialTableLoad = loading && !data;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">{t(titleKey)}</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">{t(subtitleKey)}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-[10px] border border-white/[0.08] bg-[#141235]/60 p-4 ring-1 ring-white/[0.04] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("admin.tx_search_placeholder")}
            className="h-10 w-full min-w-0 max-w-lg rounded-[9px] border border-white/[0.1] bg-[#0F0D2E] px-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-1 ring-white/[0.04] transition focus:border-[#6366f1]/45 focus:ring-2 focus:ring-[#6366f1]/20"
            aria-label={t("admin.tx_search_placeholder")}
          />
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor={`tx-status-${txType}`} className="text-xs font-medium text-slate-500">
              {t("admin.tx_filter_status")}
            </label>
            <select
              id={`tx-status-${txType}`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-[9px] border border-white/[0.1] bg-[#0F0D2E] px-3 text-sm text-slate-200 outline-none ring-1 ring-white/[0.04] transition focus:border-[#6366f1]/45 focus:ring-2 focus:ring-[#6366f1]/20"
            >
              <option value="">{t("admin.tx_status_all")}</option>
              <option value="pending">pending</option>
              <option value="completed">completed</option>
              <option value="failed">failed</option>
            </select>
          </div>
        </div>
        {data ? (
          <p className="shrink-0 text-xs tabular-nums text-slate-500">
            {t("admin.users_page")} {data.page} {t("admin.users_of")} {data.totalPages}
            <span className="text-slate-600"> · </span>
            {data.total} {t("admin.tx_total_rows")}
          </p>
        ) : null}
      </div>

      {err ? (
        <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {err}{" "}
          <button type="button" className="ml-2 font-semibold underline" onClick={load}>
            {t("admin.retry")}
          </button>
        </div>
      ) : null}

      {initialTableLoad ? (
        <AdminWalletTransactionsTableSkeleton />
      ) : (
        <div
          className={`overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#141235] shadow-sm ring-1 ring-white/[0.04] ${
            loading && data ? "pointer-events-none opacity-[0.72]" : ""
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0F0D2E]/50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.tx_col_date")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.tx_col_member")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.tx_col_asset")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5">{t("admin.tx_col_amount")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.tx_col_status")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.tx_col_reference")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.tx_col_tx")}</th>
                  {/* <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.tx_col_mode")}</th> */}
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {!data?.transactions?.length ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center text-slate-500">
                      {t("admin.tx_none")}
                    </td>
                  </tr>
                ) : (
                  data.transactions.map((row) => {
                    const member = row.user;
                    const primary = member ? member.fullName || member.email : t("admin.tx_unknown_user");
                    const secondary =
                      member && member.fullName && member.email
                        ? member.email
                        : member?.username
                          ? `@${member.username}`
                          : null;
                    const titleHint = member ? [member.fullName, member.email].filter(Boolean).join(" · ") : "";
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.03]"
                      >
                        <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-400 sm:px-5">
                          {formatWhen(row.createdAt)}
                        </td>
                        <td className="max-w-[200px] px-4 py-3.5 sm:max-w-[240px] sm:px-5">
                          <div className="truncate font-medium text-slate-100" title={titleHint || undefined}>
                            {primary}
                          </div>
                          {secondary ? (
                            <div className="truncate font-mono text-[12px] text-slate-500">{secondary}</div>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-300 sm:px-5">
                          {labelAsset(row.asset)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono tabular-nums text-slate-100 sm:px-5">
                          {formatAmount(row.asset, row.amount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 sm:px-5">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold capitalize ring-1 ${statusBadgeClass(row.status)}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="max-w-[140px] px-4 py-3.5 font-mono text-[12px] text-slate-400 sm:px-5">
                          <span className="block truncate" title={row.reference || undefined}>
                            {truncate(row.reference, 28)}
                          </span>
                        </td>
                        <td className="max-w-[160px] px-4 py-3.5 font-mono text-[12px] text-slate-400 sm:px-5">
                          <span className="block truncate" title={row.txHash || undefined}>
                            {truncate(row.txHash, 32)}
                          </span>
                        </td>
                        {/* <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500 sm:px-5">
                          {row.mode || "—"}
                        </td> */}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data && data.totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-white/[0.1] bg-[#141235] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06] disabled:opacity-40"
          >
            {t("admin.users_prev")}
          </button>
          <button
            type="button"
            disabled={page >= data.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-white/[0.1] bg-[#141235] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06] disabled:opacity-40"
          >
            {t("admin.users_next")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
