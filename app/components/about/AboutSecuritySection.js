"use client";
import Image from "next/image";
import { aboutImages } from "./aboutImages";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function AboutSecuritySection() {
  const { t } = useSiteTranslation();
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{t("about.security.title")}</h2>
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#141235]/95 p-6 text-center shadow-xl sm:p-8 lg:mt-10 lg:p-10">
        <div className="relative mx-auto mb-8 h-40 w-full max-w-xs sm:h-44">
          <Image
            src={aboutImages.atlasSecurity}
            alt={t("about.security.alt")}
            fill
            className="object-contain"
            sizes="320px"
          />
        </div>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {t("about.security.body")}
        </p>
      </div>
    </section>
  );
}
