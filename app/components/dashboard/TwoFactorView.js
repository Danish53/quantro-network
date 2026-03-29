"use client";

import { useState } from "react";
import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function TwoFactorView() {
  const { t } = useSiteTranslation();
  const [enabled, setEnabled] = useState(false);
  const [code, setCode] = useState("");

  return (
    <DashboardStandardPage titleKey="dash.twofa.title" breadcrumbLastKey="dash.twofa.title">
      <p className="mb-6 max-w-2xl text-sm text-slate-400">{t("dash.twofa.subtitle")}</p>

      <div className="rounded-xl border border-white/[0.08] bg-[#141235] p-5 shadow-sm ring-1 ring-white/[0.04] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-slate-100">{t("dash.twofa.enable")}</span>
          <button
            type="button"
            onClick={() => setEnabled((v) => !v)}
            className={`relative h-9 w-14 shrink-0 rounded-full transition-colors ${
              enabled ? "bg-emerald-600" : "bg-slate-600"
            }`}
            aria-pressed={enabled}
          >
            <span
              className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-white shadow transition-transform ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {enabled ? (
          <div className="mt-8 border-t border-white/[0.08] pt-8">
            <p className="text-sm text-[#a0aec0]">{t("dash.twofa.scan")}</p>
            <div className="mt-4 flex h-40 w-40 items-center justify-center rounded-[12px] border border-dashed border-white/[0.12] bg-[#0F0D2E]/40 text-xs text-slate-500">
              QR
            </div>
            <p className="mt-6 text-sm text-[#a0aec0]">{t("dash.twofa.backup")}</p>
            <div className="mt-2 rounded-[10px] border border-white/[0.1] bg-[#0F0D2E]/50 px-4 py-3 font-mono text-sm text-slate-400">
              •••• •••• •••• ••••
            </div>
            <label htmlFor="twofa-code" className="mt-6 block text-sm text-[#a0aec0]">
              {t("dash.twofa.verify")}
            </label>
            <input
              id="twofa-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-2 w-full max-w-xs rounded-[10px] border border-white/[0.12] bg-[#0F0D2E]/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-[#6366f1]/60"
              placeholder={t("dash.twofa.placeholder")}
              inputMode="numeric"
            />
            <button type="button" className="mt-4 rounded-[10px] bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
              {t("dash.twofa.save")}
            </button>
          </div>
        ) : null}
      </div>
    </DashboardStandardPage>
  );
}
