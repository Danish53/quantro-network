"use client";

import { useState } from "react";
import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function ConvertView() {
  const { t } = useSiteTranslation();
  const [from, setFrom] = useState("USDT_BNB");
  const [amount, setAmount] = useState("");

  const baseField =
    "mt-2 w-full rounded-[10px] border border-[#2a3558] bg-[#14182b] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/25";

  return (
    <DashboardStandardPage titleKey="dash.conv.title" breadcrumbLastKey="dash.conv.title">
      <p className="mb-6 max-w-2xl text-sm text-slate-400">{t("dash.conv.subtitle")}</p>

      <div className="rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="conv-from" className="text-sm text-[#a0aec0]">
              {t("dash.conv.from")}
            </label>
            <select id="conv-from" value={from} onChange={(e) => setFrom(e.target.value)} className={`${baseField} appearance-none`}>
              <option value="USDT_BNB">USDT (BNB)</option>
              <option value="USDC_BNB">USDC (BNB)</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-[#a0aec0]">{t("dash.conv.to")}</label>
            <input readOnly value={t("dash.conv.fiat_usd")} className={`${baseField} cursor-not-allowed opacity-90`} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="conv-amt" className="text-sm text-[#a0aec0]">
              {t("dash.conv.amount")}
            </label>
            <input
              id="conv-amt"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={baseField}
              inputMode="decimal"
            />
          </div>
        </div>

        <div className="mt-6 rounded-[10px] border border-white/[0.06] bg-[#14182b] px-4 py-3 text-sm text-slate-400">
          <p>
            {t("dash.conv.rate")}: <span className="text-slate-200">1 USDT ≈ 1.00 USD</span>
          </p>
          <p className="mt-2">
            {t("dash.conv.receive")}: <span className="font-semibold text-[#38bdf8]">$0.00</span>
          </p>
        </div>

        <p className="mt-4 text-xs text-slate-500">{t("dash.conv.disclaimer")}</p>

        <button
          type="button"
          className="mt-6 rounded-[10px] bg-[#2563eb] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#1d4ed8]"
        >
          {t("dash.conv.cta")}
        </button>
      </div>
    </DashboardStandardPage>
  );
}
