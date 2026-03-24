"use client";

import Link from "next/link";
import Image from "next/image";
import MonitorMockup from "@/public/images/sec-1.png";
import { useSiteTranslation } from "./SiteTranslationProvider";

export default function SplitFeatureSection() {
  const { t } = useSiteTranslation();

  return (
    <section className="w-full bg-white py-12 sm:py-14 lg:py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
        <article className="order-1 text-left">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6366f1] sm:text-[13px]">{t("split.eyebrow")}</p>
          <h3 className="mt-3 max-w-xl text-3xl font-[900] leading-tight tracking-tight text-[#0f172a] sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
            {t("split.title")}
          </h3>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#4b5563] sm:text-[17px]">{t("split.body")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4f46e5] to-[#9333ea] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 sm:px-7"
            >
              {t("split.cta_primary")} <span className="ml-1.5 text-base leading-none">&gt;</span>
            </Link>
            <Link
              href="/about-us"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#0f172a] transition hover:bg-slate-50 sm:px-7"
            >
              {t("split.cta_secondary")} <span className="ml-1.5 text-base leading-none">&gt;</span>
            </Link>
          </div>
        </article>

        <div className="order-2">
          <Image
            src={MonitorMockup}
            alt={t("split.img_alt")}
            className="h-full w-full rounded-2xl object-cover"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </section>
  );
}
