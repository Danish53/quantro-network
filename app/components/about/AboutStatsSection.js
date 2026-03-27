"use client";

import { useSiteTranslation } from "../SiteTranslationProvider";

const cardClass =
  "flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0f1629]/95 px-6 py-12 text-center shadow-lg sm:py-14";

export default function AboutStatsSection() {
  const { t } = useSiteTranslation();
  return (
    <section>
      <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
        <article className={cardClass}>
          <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">99.99%</p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-slate-400 sm:text-base">{t("about.stats.uptime_label")}</p>
        </article>
        <article className={cardClass}>
          <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">24/7</p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-slate-400 sm:text-base">{t("about.stats.support_label")}</p>
        </article>
      </div>
    </section>
  );
}
