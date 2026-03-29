"use client";

import Link from "next/link";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function AboutPreFooterCta() {
  const { t } = useSiteTranslation();
  return (
    <section className="rounded-2xl border border-white/10 bg-[#141235]/95 px-5 py-8 shadow-lg sm:px-8 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">{t("about.cta.title")}</h2>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">{t("about.cta.subtitle")}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/20 bg-white px-8 text-sm font-semibold text-[#0f172a] transition hover:bg-slate-100"
          >
            {t("about.cta.login")}
          </Link>
          <Link
            href="/get-started"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-violet-600 px-8 text-sm font-semibold text-white shadow-md transition hover:bg-violet-500"
          >
            {t("about.cta.signup")}
          </Link>
        </div>
      </div>
    </section>
  );
}
