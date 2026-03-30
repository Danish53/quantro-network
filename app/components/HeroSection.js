"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import leftImage from "@/public/images/left-image.999f05cb.png";
import rightImage from "@/public/images/right-image.5e8ab15a.png";
import { useSiteTranslation } from "./SiteTranslationProvider";

export default function HeroSection() {
  const { t } = useSiteTranslation();
  const [ctaHref, setCtaHref] = useState("/login");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (!cancelled) {
          setCtaHref(res.ok && data?.user ? "/dashboard" : "/login");
        }
      } catch {
        if (!cancelled) setCtaHref("/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="about-us"
      className="relative w-full min-w-0 overflow-hidden rounded-[20px] bg-[#070B3D] px-3 py-8 text-white sm:rounded-[24px] sm:px-5 sm:py-14 lg:min-h-[610px] lg:px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(97,90,255,0.9)_0%,_rgba(57,56,166,0.38)_48%,_rgba(7,11,61,0)_75%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl min-w-0 px-1 text-center sm:px-0">
        <h1 className="text-[1.65rem] font-bold leading-[1.2] tracking-tight sm:text-4xl md:text-[44px] md:leading-tight">
          {t("hero.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-blue-100/95 sm:mt-5 sm:text-[16px] sm:leading-8">
          {t("hero.body")}
        </p>

        <Link
          href={ctaHref}
          className="mt-6 inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#5C5AFF] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_40px_rgba(92,90,255,0.45)] transition hover:bg-[#6e6bff] sm:mt-8 sm:w-auto sm:max-w-none sm:px-12 sm:py-4 sm:text-lg"
        >
          {t("hero.cta")}
        </Link>

        <p className="mt-6 text-base font-semibold text-white sm:mt-7 sm:text-lg">{t("hero.trusted")}</p>
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
