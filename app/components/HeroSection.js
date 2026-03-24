"use client";

import Image from "next/image";
import leftImage from "@/public/images/left-image.999f05cb.png";
import rightImage from "@/public/images/right-image.5e8ab15a.png";
import { useSiteTranslation } from "./SiteTranslationProvider";

export default function HeroSection() {
  const { t } = useSiteTranslation();

  return (
    <section
      id="about-us"
      className="relative overflow-hidden rounded-[24px] bg-[#070B3D] px-4 py-10 text-white sm:px-5 sm:py-14 lg:min-h-[610px] lg:px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(97,90,255,0.9)_0%,_rgba(57,56,166,0.38)_48%,_rgba(7,11,61,0)_75%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-[44px]">{t("hero.title")}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] font-medium leading-8 text-blue-100/95">{t("hero.body")}</p>

        <button
          type="button"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#5C5AFF] px-12 py-4 text-lg font-semibold text-white shadow-[0_10px_40px_rgba(92,90,255,0.45)] transition hover:bg-[#6e6bff]"
        >
          {t("hero.cta")} <span className="ml-2 text-xl leading-none">›</span>
        </button>

        <p className="mt-7 text-lg font-semibold text-white">{t("hero.trusted")}</p>
        <div className="mt-2 flex items-center justify-center gap-2 text-amber-400">
          <span className="text-[18px]">★ ★ ★ ★ ★</span>
          <span className="text-lg font-semibold text-white">4.9</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[31%] lg:block">
        <Image
          src={leftImage}
          alt={t("hero.alt_left")}
          fill
          className="object-contain object-left"
          sizes="(min-width: 1024px) 31vw, 0vw"
          priority
        />
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[31%] lg:block">
        <Image
          src={rightImage}
          alt={t("hero.alt_right")}
          fill
          className="object-contain object-right"
          sizes="(min-width: 1024px) 31vw, 0vw"
          priority
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#070B3D] to-transparent" />
    </section>
  );
}
