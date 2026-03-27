"use client";

import Image from "next/image";
import { aboutImages } from "./aboutImages";
import { useSiteTranslation } from "../SiteTranslationProvider";

const cardClass =
  "rounded-2xl border border-white/10 bg-[#0f1629]/95 p-6 text-left shadow-lg sm:p-8";

export default function AboutPlatformDetailsSection() {
  const { t } = useSiteTranslation();
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{t("about.platform.section_title")}</h2>
      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-8">
        <article className={cardClass}>
          <h3 className="text-lg font-bold text-white sm:text-xl">{t("about.platform.hours_title")}</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{t("about.platform.hours_body")}</p>
          <ul className="mt-5 space-y-2 text-sm text-slate-200">
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> {t("about.platform.hours_li1")}
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> {t("about.platform.hours_li2")}
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> {t("about.platform.hours_li3")}
            </li>
          </ul>
        </article>
        <article className={cardClass}>
          <h3 className="text-lg font-bold text-white sm:text-xl">{t("about.platform.scalable_title")}</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{t("about.platform.scalable_body")}</p>
          <div className="relative mt-6 aspect-[16/10] w-full max-w-xs overflow-hidden rounded-lg border border-white/10">
            <Image
              src={aboutImages.scalableThumb}
              alt={t("about.platform.scalable_alt")}
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
