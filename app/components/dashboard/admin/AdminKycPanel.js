"use client";

import { useCallback, useEffect, useState } from "react";
import { useSiteTranslation } from "@/app/components/SiteTranslationProvider";
import { AdminDataTableSkeleton } from "./AdminSkeletonBlocks";

function formatWhen(iso) {
  if (!iso) return "—";
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

function kycBadgeClass(status) {
  switch (status) {
    case "approved":
      return "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25";
    case "pending":
      return "bg-amber-500/15 text-amber-100 ring-amber-500/25";
    case "rejected":
      return "bg-rose-500/15 text-rose-100 ring-rose-500/20";
    case "not_submitted":
      return "bg-slate-500/10 text-slate-400 ring-white/10";
    default:
      return "bg-slate-500/10 text-slate-400 ring-white/10";
  }
}

function truncate(s, max) {
  if (!s) return "—";
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

export default function AdminKycPanel() {
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
      const qs = new URLSearchParams({ page: String(page), limit: "15" });
      if (debouncedQ) qs.set("q", debouncedQ);
      if (status) qs.set("status", status);
      const res = await fetch(`/api/admin/kyc?${qs}`, { credentials: "include" });
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
  }, [page, debouncedQ, status, t]);

  useEffect(() => {
    load();
  }, [load]);

  const initialTableLoad = loading && !data;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">{t("admin.kyc_title")}</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">{t("admin.kyc_subtitle")}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-[10px] border border-white/[0.08] bg-[#141235]/60 p-4 ring-1 ring-white/[0.04] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("admin.kyc_search_placeholder")}
            className="h-10 w-full min-w-0 max-w-lg rounded-[9px] border border-white/[0.1] bg-[#0F0D2E] px-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-1 ring-white/[0.04] transition focus:border-[#6366f1]/45 focus:ring-2 focus:ring-[#6366f1]/20"
            aria-label={t("admin.kyc_search_placeholder")}
          />
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="admin-kyc-status" className="text-xs font-medium text-slate-500">
              {t("admin.kyc_filter_status")}
            </label>
            <select
              id="admin-kyc-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-[9px] border border-white/[0.1] bg-[#0F0D2E] px-3 text-sm text-slate-200 outline-none ring-1 ring-white/[0.04] transition focus:border-[#6366f1]/45 focus:ring-2 focus:ring-[#6366f1]/20"
            >
              <option value="">{t("admin.tx_status_all")}</option>
              <option value="not_submitted">not_submitted</option>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
        </div>
        {data ? (
          <p className="shrink-0 text-xs tabular-nums text-slate-500">
            {t("admin.users_page")} {data.page} {t("admin.users_of")} {data.totalPages}
            <span className="text-slate-600"> · </span>
            {data.total} {t("admin.kyc_total")}
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
        <AdminDataTableSkeleton cols={10} minWidthClass="min-w-[1120px]" rowCount={9} />
      ) : (
        <div
          className={`overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#141235] shadow-sm ring-1 ring-white/[0.04] ${
            loading && data ? "pointer-events-none opacity-[0.72]" : ""
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0F0D2E]/50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.kyc_col_member")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.kyc_col_account")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.kyc_col_status")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.kyc_col_submitted")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.kyc_col_approved")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.kyc_col_country")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.kyc_col_city")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.kyc_col_dob")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.kyc_col_ssn4")}</th>
                  <th className="min-w-[120px] px-4 py-3.5 sm:px-5">{t("admin.kyc_col_reason")}</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {!data?.submissions?.length ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-14 text-center text-slate-500">
                      {t("admin.kyc_none")}
                    </td>
                  </tr>
                ) : (
                  data.submissions.map((row) => {
                    const primary = row.fullName || row.email;
                    const secondary =
                      row.fullName && row.email ? row.email : row.username ? `@${row.username}` : null;
                    const cityLine = [row.kycCity, row.kycState].filter(Boolean).join(", ") || "—";
                    return (
                      <tr
                        key={row.id}
                        className={`border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.03] ${
                          !row.isActive ? "bg-rose-950/[0.08]" : ""
                        }`}
                      >
                        <td className="max-w-[200px] px-4 py-3.5 sm:px-5">
                          <div className="truncate font-medium text-slate-100">{primary}</div>
                          {secondary ? (
                            <div className="truncate font-mono text-[12px] text-slate-500">{secondary}</div>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 sm:px-5">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${
                              row.isActive
                                ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
                                : "bg-rose-500/15 text-rose-100 ring-rose-500/25"
                            }`}
                          >
                            {row.isActive ? t("admin.status_active") : t("admin.status_inactive")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 sm:px-5">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ${kycBadgeClass(row.kycStatus)}`}
                          >
                            {String(row.kycStatus || "").replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-400 sm:px-5">
                          {formatWhen(row.kycSubmittedAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-400 sm:px-5">
                          {formatWhen(row.kycApprovedAt)}
                        </td>
                        <td className="max-w-[100px] truncate px-4 py-3.5 text-slate-300 sm:px-5" title={row.kycCountry}>
                          {row.kycCountry || "—"}
                        </td>
                        <td className="max-w-[160px] px-4 py-3.5 text-slate-400 sm:px-5">
                          <div className="truncate" title={cityLine}>
                            {cityLine}
                          </div>
                          {row.kycAddressLine1 ? (
                            <div
                              className="truncate text-[11px] text-slate-500"
                              title={row.kycAddressLine1}
                            >
                              {truncate(row.kycAddressLine1, 36)}
                            </div>
                          ) : null}
                          {row.kycPostalCode ? (
                            <div className="truncate font-mono text-[11px] text-slate-500">{row.kycPostalCode}</div>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-400 sm:px-5">
                          {row.kycDateOfBirth || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[13px] text-slate-400 sm:px-5">
                          {row.kycSsnLast4 ? `••••${row.kycSsnLast4}` : "—"}
                        </td>
                        <td className="max-w-[180px] px-4 py-3.5 text-xs text-slate-400 sm:px-5">
                          <span className="line-clamp-2" title={row.kycRejectedReason || undefined}>
                            {truncate(row.kycRejectedReason, 80)}
                          </span>
                        </td>
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
