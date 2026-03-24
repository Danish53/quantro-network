"use client";

import Image from "next/image";
import Link from "next/link";
import AtlasMockups from "@/public/images/sec-2.png";
import { useSiteTranslation } from "./SiteTranslationProvider";

export default function Datastreamsfeatures() {
  const { t } = useSiteTranslation();

  return (
    <section className="mt-12 grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="order-2">
        <Image
          src={AtlasMockups}
          alt={t("data.img_alt")}
          className="h-full w-full rounded-2xl object-cover"
          width={1000}
          height={1000}
        />
      </div>

      <article className="order-1 text-left lg:order-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6366f1] sm:text-[13px]">{t("data.eyebrow")}</p>
        <h3 className="mt-3 max-w-xl text-3xl font-[900] leading-tight tracking-tight text-[#0f172a] sm:text-4xl lg:text-[50px] lg:leading-[1.12]">
          {t("data.title")}
        </h3>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#4b5563] sm:text-[17px]">{t("data.body")}</p>
        <Link
          href="/get-started"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4f46e5] to-[#9333ea] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
        >
          {t("data.cta")} <span className="ml-1.5 text-base leading-none">&gt;</span>
        </Link>
      </article>
    </section>
  );
}
