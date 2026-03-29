"use client";

import { useSiteTranslation } from "../SiteTranslationProvider";

/** Placeholder for dashboard sub-routes until real pages exist. */
export default function DashboardPagePlaceholder({ titleKey }) {
  const { t } = useSiteTranslation();
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#141235] p-8 text-center shadow-sm ring-1 ring-white/[0.04] backdrop-blur-md">
      <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">{t(titleKey)}</h1>
      <p className="mt-3 text-sm text-slate-400">{t("dash.placeholder_body")}</p>
    </div>
  );
}
