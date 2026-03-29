"use client";

import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function SignalsApiView() {
  const { t } = useSiteTranslation();
  return (
    <DashboardStandardPage titleKey="dash.sig.title" breadcrumbLastKey="dash.sig.title">
      <p className="mb-6 max-w-2xl text-sm text-slate-400">{t("dash.sig.subtitle")}</p>

      <div className="rounded-xl border border-white/[0.08] bg-[#141235] p-5 shadow-sm ring-1 ring-white/[0.04] sm:p-6">
        <p className="text-sm text-[#a0aec0]">{t("dash.sig.key_label")}</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="flex-1 rounded-[10px] border border-white/[0.1] bg-[#0F0D2E]/60 px-4 py-3 font-mono text-sm text-slate-300">
            {t("dash.sig.masked")}
          </code>
          <div className="flex gap-2">
            <button type="button" className="rounded-[10px] bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
              {t("dash.sig.regenerate")}
            </button>
            <button type="button" className="rounded-[10px] border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5">
              {t("dash.sig.docs")}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-white/[0.08] pt-6 sm:grid-cols-2">
          <div className="rounded-[10px] border border-white/[0.06] bg-[#0F0D2E]/40 px-4 py-3">
            <p className="text-xs text-slate-500">{t("dash.sig.usage")}</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">0</p>
          </div>
          <div className="rounded-[10px] border border-white/[0.06] bg-[#0F0D2E]/40 px-4 py-3">
            <p className="text-xs text-slate-500">{t("dash.sig.limit")}</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">60 / min</p>
          </div>
        </div>
      </div>
    </DashboardStandardPage>
  );
}
