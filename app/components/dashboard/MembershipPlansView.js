"use client";

import Link from "next/link";
import { useSiteTranslation } from "../SiteTranslationProvider";

const ACCESS_KEYS = ["dash.mem.access_f1", "dash.mem.access_f2", "dash.mem.access_f3", "dash.mem.access_f4", "dash.mem.access_f5"];
const PRIME_KEYS = [
  "dash.mem.prime_f1",
  "dash.mem.prime_f2",
  "dash.mem.prime_f3",
  "dash.mem.prime_f4",
  "dash.mem.prime_f5",
  "dash.mem.prime_f6",
];

function GoldCheck() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9A6B20]/25 text-[#e8a54c]" aria-hidden>
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </span>
  );
}

function PlanCard({ titleKey, priceKey, featureKeys }) {
  const { t } = useSiteTranslation();
  return (
    <div className="flex flex-col rounded-[12px] border border-white/[0.08] bg-gradient-to-b from-[#1c1c34]/95 to-[#16162a] p-5 shadow-[0_0_40px_-12px_rgba(59,130,246,0.15)] sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{t(titleKey)}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">{t(priceKey)}</p>
      <p className="mt-1 text-sm text-slate-500">{t("dash.mem.billing_cycle")}</p>
      <ul className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-6">
        {featureKeys.map((key) => (
          <li key={key} className="flex gap-3 text-sm leading-snug text-slate-200">
            <GoldCheck />
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-6">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-white/[0.1] bg-[#14142a] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-[#1c1c30]"
        >
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l3.468 12.04A2.25 2.25 0 009.896 19h8.396a2.25 2.25 0 002.122-1.48l3.464-9.814A2.25 2.25 0 0021.75 5.25H7.5m-4.5 0V19.5m0 0h15.75"
            />
          </svg>
          {t("dash.mem.recaptcha")}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-[#e85d4c]">
          <svg className="h-4 w-4 shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          {t("dash.mem.insufficient")}
        </p>
      </div>
    </div>
  );
}

export default function MembershipPlansView() {
  const { t } = useSiteTranslation();

  return (
    <div className="relative pb-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">{t("dash.mem.title")}</h1>
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/dashboard" className="transition hover:text-slate-300">
                {t("dash.mem.breadcrumb_dashboard")}
              </Link>
            </li>
            <li className="px-1 text-slate-600" aria-hidden>
              {">"}
            </li>
            <li className="text-slate-400">{t("dash.mem.title")}</li>
          </ol>
        </nav>
      </div>

      {/* Wallet bar */}
      <div className="mt-8 flex flex-col gap-4 rounded-[12px] border border-[#3b82f6]/25 bg-[#14142a]/90 p-4 shadow-[0_0_32px_-8px_rgba(59,130,246,0.25)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#3b82f6]/15 text-[#60a5fa] ring-1 ring-[#3b82f6]/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m0 0a2.25 2.25 0 012.25-2.25H18.75A2.25 2.25 0 0121 9v3M3 9v3"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-white">{t("dash.mem.wallet_title")}</p>
            <p className="mt-0.5 text-sm text-slate-500">{t("dash.mem.wallet_caption")}</p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p className="text-center text-3xl font-bold tracking-tight text-[#38bdf8] sm:text-right">$0.00</p>
          <Link
            href="/dashboard/fund"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1d4ed8]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t("dash.mem.fund_wallet")}
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-white">{t("dash.mem.available_title")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("dash.mem.available_subtitle")}</p>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <PlanCard titleKey="dash.mem.plan_access_title" priceKey="dash.mem.price_access" featureKeys={ACCESS_KEYS} />
          <PlanCard titleKey="dash.mem.plan_prime_title" priceKey="dash.mem.price_prime" featureKeys={PRIME_KEYS} />
        </div>
      </div>

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
