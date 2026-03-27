"use client";

import { useSiteTranslation } from "../SiteTranslationProvider";

const cardClass =
  "rounded-2xl border border-white/10 bg-[#0f1629]/95 p-6 text-left shadow-lg sm:p-8";

export default function AboutMissionVision() {
  const { t } = useSiteTranslation();
  return (
    <section>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <article className={cardClass}>
          <h2 className="text-xl font-bold text-white sm:text-2xl">{t("about.mission.title")}</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{t("about.mission.body")}</p>
        </article>
        <article className={cardClass}>
          <h2 className="text-xl font-bold text-white sm:text-2xl">{t("about.vision.title")}</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{t("about.vision.body")}</p>
        </article>
      </div>
    </section>
  );
}
