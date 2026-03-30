"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteTranslation } from "./SiteTranslationProvider";

export default function EngineeringTeamSection({ phoneSrc = "/images/sec-3.png" }) {
  const { t } = useSiteTranslation();

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <article className="order-1 text-left">
          <p className="inline-block bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#fb923c] bg-clip-text text-xs font-bold uppercase tracking-[0.18em] text-transparent sm:text-[13px]">
            {t("eng.eyebrow")}
          </p>
          <h3 className="mt-4 max-w-xl text-3xl font-[900] leading-[1.15] tracking-tight text-[#0a1128] sm:text-4xl lg:text-[44px]">
            {t("eng.title")}
          </h3>
          <p className="mt-6 max-w-xl text-base font-normal leading-relaxed text-[#4a5568] sm:text-[17px]">{t("eng.body")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/membership"
              className="inline-flex items-center justify-center rounded-full bg-[#5d45fd] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105 sm:px-7"
            >
              {t("eng.cta_join")}
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#0a1128] backdrop-blur-sm transition hover:bg-white sm:px-7"
            >
              {t("eng.cta_view")}
            </Link>
          </div>
        </article>

        <div className="order-2 flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-[28px] bg-black p-6 shadow-[0_28px_64px_rgba(15,23,42,0.18)] sm:p-8 lg:max-w-lg">
            <div className="flex justify-center">
              <div className="relative w-[72%] max-w-[280px]">
                <Image
                  src={phoneSrc}
                  alt={t("eng.phone_alt")}
                  width={560}
                  height={1120}
                  className="h-auto w-full object-contain drop-shadow-2xl"
                  sizes="(min-width: 1024px) 320px, 72vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
