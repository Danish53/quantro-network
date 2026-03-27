"use client";

import { useSiteTranslation } from "../SiteTranslationProvider";

export default function RoadmapVisionSection() {
  const { t } = useSiteTranslation();
  return (
    <section
      aria-labelledby="roadmap-vision-heading"
      className="rounded-2xl border border-white/10 bg-[#0f1629]/95 p-6 shadow-xl sm:p-8 lg:p-10"
    >
      <h2 id="roadmap-vision-heading" className="text-xl font-bold text-violet-400 sm:text-2xl">{t("roadmap.vision.title")}</h2>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-200 sm:text-base">
        <p>{t("roadmap.vision.p1")}</p>
        <p>{t("roadmap.vision.p2")}</p>
      </div>
    </section>
  );
}
