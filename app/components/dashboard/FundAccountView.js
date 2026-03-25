"use client";

import DashboardNavigateDropdown from "./DashboardNavigateDropdown";
import { useState } from "react";
import { useSiteTranslation } from "../SiteTranslationProvider";

const CURRENCIES = [
  { value: "BTC", labelKey: "dash.fund.currency_btc" },
  { value: "ETH", labelKey: "dash.fund.currency_eth" },
  { value: "USDT", labelKey: "dash.fund.currency_usdt" },
];

export default function FundAccountView() {
  const { t } = useSiteTranslation();
  const [currency, setCurrency] = useState("BTC");
  const [amount, setAmount] = useState("");

  return (
    <div className="relative pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">{t("dash.fund.page_title")}</h1>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li className="text-slate-400">{t("dash.fund.breadcrumb_finance")}</li>
              <li className="px-1 text-slate-600" aria-hidden>
                {">"}
              </li>
              <li className="text-slate-300">{t("dash.fund.page_title")}</li>
            </ol>
          </nav>
          <DashboardNavigateDropdown />
        </div>
      </div>

      {/* Deposit Request */}
      <section className="mt-8 rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6">
        <h2 className="text-lg font-semibold text-white">{t("dash.fund.deposit_title")}</h2>
        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <label htmlFor="fund-currency" className="block text-sm text-[#a0aec0]">
              {t("dash.fund.currency_label")} <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <select
                id="fund-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full appearance-none rounded-[10px] border border-white/[0.12] bg-[#14182b] py-3 pl-4 pr-10 text-sm text-white outline-none transition focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/30"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {t(c.labelKey)}
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
            <label htmlFor="fund-amount" className="block text-sm text-[#a0aec0]">
              {t("dash.fund.amount_label")} <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 flex rounded-[10px] border border-white/[0.12] bg-[#14182b] focus-within:border-[#2563eb]/50 focus-within:ring-1 focus-within:ring-[#2563eb]/30">
              <span className="flex items-center border-r border-white/[0.08] px-4 text-lg text-slate-400">$</span>
              <input
                id="fund-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={t("dash.fund.amount_placeholder")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="min-w-0 flex-1 rounded-r-[10px] bg-transparent py-3 pr-4 text-sm text-white placeholder:text-slate-500 outline-none"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">{t("dash.fund.min_deposit")}</p>
          </div>

          <button
            type="submit"
            className="w-full rounded-[10px] bg-[#1a73e8] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#1567d3] sm:w-auto sm:min-w-[140px] sm:px-8"
          >
            {t("dash.fund.submit")}
          </button>
        </form>
      </section>

      {/* Recent Deposits */}
      <section className="mt-8 rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6">
        <h2 className="text-lg font-semibold text-white">{t("dash.fund.recent_title")}</h2>
        <div className="mt-4 overflow-x-auto rounded-[8px] border border-white/[0.06]">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#14182b]/80">
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_reference")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_amount")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_currency")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_status")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_date")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_action")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-slate-500">
                  {t("dash.fund.empty")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
