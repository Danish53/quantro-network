"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DashboardNavigateDropdown from "./DashboardNavigateDropdown";
import { useSiteTranslation } from "../SiteTranslationProvider";

const TYPE_FILTERS = [
  { value: "", labelKey: "dash.tx.all_types" },
  { value: "deposit", labelKey: "dash.tx.type_deposit" },
  { value: "withdrawal", labelKey: "dash.tx.type_withdrawal" },
  { value: "transfer", labelKey: "dash.tx.type_transfer" },
  { value: "subscription", labelKey: "dash.tx.type_subscription" },
];

const STATUS_FILTERS = [
  { value: "", labelKey: "dash.tx.all_statuses" },
  { value: "pending", labelKey: "dash.tx.status_pending" },
  { value: "completed", labelKey: "dash.tx.status_completed" },
  { value: "failed", labelKey: "dash.tx.status_failed" },
];

export default function TransactionHistoryView() {
  const { t } = useSiteTranslation();
  const [txType, setTxType] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const transactions = useMemo(() => [], []);

  const baseField =
    "w-full rounded-[10px] border border-[#2a3558] bg-[#14182b] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/25";
  const selectClass = `${baseField} appearance-none pr-10 text-slate-200`;

  const resetFilters = () => {
    setTxType("");
    setStatus("");
    setStartDate("");
    setEndDate("");
  };

  const applyFilters = (e) => {
    e.preventDefault();
    // TODO: fetch when API exists
  };

  return (
    <div className="relative pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">{t("dash.tx.title")}</h1>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/dashboard" className="transition hover:text-slate-300">
                  {t("dash.tx.breadcrumb_dashboard")}
                </Link>
              </li>
              <li className="px-1 text-slate-600" aria-hidden>
                {">"}
              </li>
              <li className="text-slate-300">{t("dash.tx.title")}</li>
            </ol>
          </nav>
          <DashboardNavigateDropdown />
        </div>
      </div>

      <section className="mt-8 rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6 lg:p-8">
        <form onSubmit={applyFilters}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <label htmlFor="tx-type" className="text-sm text-[#a0aec0]">
                {t("dash.tx.filter_type")}
              </label>
              <div className="relative mt-2">
                <select id="tx-type" value={txType} onChange={(e) => setTxType(e.target.value)} className={selectClass}>
                  {TYPE_FILTERS.map((opt) => (
                    <option key={opt.value || "all"} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="tx-status" className="text-sm text-[#a0aec0]">
                {t("dash.tx.filter_status")}
              </label>
              <div className="relative mt-2">
                <select id="tx-status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                  {STATUS_FILTERS.map((opt) => (
                    <option key={opt.value || "all"} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="tx-start" className="text-sm text-[#a0aec0]">
                {t("dash.tx.start_date")}
              </label>
              <div className="relative mt-2">
                <input
                  id="tx-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`${baseField} pr-11 [color-scheme:dark]`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="tx-end" className="text-sm text-[#a0aec0]">
                {t("dash.tx.end_date")}
              </label>
              <div className="relative mt-2">
                <input
                  id="tx-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`${baseField} pr-11 [color-scheme:dark]`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#1d4ed8]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v5.448a9.02 9.02 0 01-.878 3.918l-.878 1.898-1.898.878A9.02 9.02 0 0112 21c-2.755 0-5.455-.232-8.083-.678-.533-.09-.917-.556-.917-1.096v-5.448c0-.54.384-1.006.917-1.096A24.042 24.042 0 0112 3z" />
              </svg>
              {t("dash.tx.apply")}
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-white/[0.15] bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t("dash.tx.reset")}
            </button>
          </div>
        </form>

        <div className="my-6 border-t border-white/[0.08]" />

        <div className="dashboard-sidebar-scroll -mx-1 overflow-x-auto px-1 pb-1">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="whitespace-nowrap px-4 py-3 font-medium text-[#a0aec0]">{t("dash.tx.col_reference")}</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-[#a0aec0]">{t("dash.tx.col_type")}</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-[#a0aec0]">{t("dash.tx.col_amount")}</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-[#a0aec0]">{t("dash.tx.col_status")}</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-[#a0aec0]">{t("dash.tx.col_date")}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                    {t("dash.tx.empty")}
                  </td>
                </tr>
              ) : (
                transactions.map((row) => (
                  <tr key={row.id} className="border-b border-white/[0.05]">
                    <td className="px-4 py-3 text-slate-200">{row.reference}</td>
                    <td className="px-4 py-3 text-slate-200">{row.type}</td>
                    <td className="px-4 py-3 text-slate-200">{row.amount}</td>
                    <td className="px-4 py-3 text-slate-200">{row.status}</td>
                    <td className="px-4 py-3 text-slate-200">{row.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-white/[0.08]" />
      </section>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg shadow-blue-600/35 transition hover:bg-[#1d4ed8]"
        aria-label={t("dash.chat_support")}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m9 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M9.75 21h3.75a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0013.5 4.5h-6a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 007.5 21z"
          />
        </svg>
      </button>
    </div>
  );
}
