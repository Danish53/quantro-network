"use client";

import Image from "next/image";
import { aboutImages } from "./aboutImages";
import { useSiteTranslation } from "../SiteTranslationProvider";

const cardClass =
  "rounded-2xl border border-white/10 bg-[#141235]/95 p-6 text-left shadow-lg sm:p-8";

export default function AboutMobileSection() {
  const { t } = useSiteTranslation();
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{t("about.mobile.section_title")}</h2>
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#141235]/95 p-6 shadow-xl sm:p-8 lg:mt-10 lg:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="text-left">
            <h3 className="text-xl font-bold text-white sm:text-2xl">{t("about.mobile.subtitle")}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{t("about.mobile.body")}</p>
          </div>
          <div className="relative mx-auto flex max-w-[280px] justify-center sm:max-w-[320px]">
            <div className="relative aspect-[9/16] w-full max-h-[520px]">
              <Image
                src={aboutImages.mobileApp}
                alt={t("about.mobile.alt")}
                fill
                className="object-contain object-top"
                sizes="(max-width: 1024px) 280px, 320px"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:mt-8">
        <article className={cardClass}>
          <h3 className="text-lg font-bold text-white sm:text-xl">{t("about.mobile.fast_title")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{t("about.mobile.fast_body")}</p>
        </article>
        <article className={cardClass}>
          <h3 className="text-lg font-bold text-white sm:text-xl">{t("about.mobile.seamless_title")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{t("about.mobile.seamless_body")}</p>
        </article>
      </div>
    </section>
  );
}
