"use client";

import Image from "next/image";
import { aboutImages } from "./aboutImages";
import { useSiteTranslation } from "../SiteTranslationProvider";

const BULLET_KEYS = ["about.algo.b0", "about.algo.b1", "about.algo.b2", "about.algo.b3"];

export default function AboutAlgorithmsSection() {
  const { t } = useSiteTranslation();
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{t("about.algo.section_title")}</h2>
      <div className="mt-8 grid gap-8 overflow-hidden rounded-2xl border border-white/10 bg-[#141235]/95 p-6 shadow-xl sm:p-8 lg:mt-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10">
        <div className="order-2 text-left lg:order-1">
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">{t("about.algo.body")}</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-200 sm:text-base">
            {BULLET_KEYS.map((key) => (
              <li key={key} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
          <div className="relative aspect-[6/5] w-full">
            <Image
              src={aboutImages.zenithProduct}
              alt={t("about.algo.alt")}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
