"use client";

import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

const TIERS = [
  { titleKey: "dash.part.t1", descKey: "dash.part.t1c" },
  { titleKey: "dash.part.t2", descKey: "dash.part.t2c" },
  { titleKey: "dash.part.t3", descKey: "dash.part.t3c" },
];

export default function PartnershipView() {
  const { t } = useSiteTranslation();
  return (
    <DashboardStandardPage titleKey="dash.part.title" breadcrumbLastKey="dash.part.title">
      <p className="mb-2 max-w-2xl text-sm text-slate-400">{t("dash.part.subtitle")}</p>
      <p className="mb-8 text-sm text-slate-500">{t("dash.part.learn")}</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.titleKey}
            className="flex flex-col rounded-xl border border-white/[0.08] bg-[#141235] p-6 shadow-sm ring-1 ring-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          >
            <p className="text-lg font-bold text-slate-100">{t(tier.titleKey)}</p>
            <p className="mt-2 text-sm text-slate-400">{t(tier.descKey)}</p>
            <button
              type="button"
              className="mt-6 rounded-[10px] border border-[#2563eb]/50 bg-[#2563eb]/10 py-2.5 text-sm font-semibold text-[#60a5fa] transition hover:bg-[#2563eb]/20"
            >
              {t("dash.part.apply")}
            </button>
          </div>
        ))}
      </div>
    </DashboardStandardPage>
  );
}
