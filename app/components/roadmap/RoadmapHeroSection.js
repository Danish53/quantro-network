"use client";

import { useSiteTranslation } from "../SiteTranslationProvider";

export default function RoadmapHeroSection() {
  const { t } = useSiteTranslation();
  return (
    <header className="text-center">
      <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-[2.5rem] xl:leading-tight">
        {t("roadmap.hero.title")}
      </h1>
      <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base lg:text-lg">{t("roadmap.hero.subtitle")}</p>
    </header>
  );
}
