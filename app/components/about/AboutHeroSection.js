"use client";

import Image from "next/image";
import { aboutImages } from "./aboutImages";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function AboutHeroSection() {
  const { t } = useSiteTranslation();
  return (
    <section className="text-center">
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        {t("about.hero.title")}
      </h1>
      <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">{t("about.hero.subtitle")}</p>
      <div className="relative mx-auto mt-10 rounded-2xl sm:p-6 lg:mt-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image
            src={aboutImages.heroDashboard}
            alt={t("about.hero.alt_dashboard")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority
          />
        </div>
      </div>
    </section>
  );
}
