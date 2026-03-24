"use client";

import { useSiteTranslation } from "./SiteTranslationProvider";

const languageCards = [
  {
    code: "GB",
    title: "English",
    subtitle: "Global",
    description: "Comprehensive presentation covering all aspects of Quantro Network",
  },
  {
    code: "FR",
    title: "Français",
    subtitle: "French",
    description: "Présentation complète pour les marchés francophones",
  },
  {
    code: "DE",
    title: "Deutsch",
    subtitle: "German",
    description: "Umfassende Präsentation für den deutschsprachigen Markt",
  },
  {
    code: "IN",
    title: "हिंदी",
    subtitle: "Hindi",
    description: "भारतीय बाजारों हेतु व्यापक प्रस्तुति",
  },
  {
    code: "KR",
    title: "한국어",
    subtitle: "Korean",
    description: "한국 시장을 위한 종합 프레젠테이션",
  },
  {
    code: "BR",
    title: "Português",
    subtitle: "Portuguese",
    description: "Apresentação completa para mercados lusófonos",
  },
  {
    code: "RU",
    title: "Русский",
    subtitle: "Russian",
    description: "Комплексная презентация для русскоязычных рынков",
  },
  {
    code: "ES",
    title: "Español",
    subtitle: "Spanish",
    description: "Presentación completa para mercados hispanohablantes",
  },
];

export default function PartnersSection() {
  const { t } = useSiteTranslation();

  return (
    <section className="w-full">
      <h2 className="mb-4 text-center text-3xl font-bold leading-tight sm:text-[44px]">{t("partners.title")}</h2>
      <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">
        {t("partners.subtitle")}
      </p>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {languageCards.map((item) => (
          <article
            key={item.code}
            className="flex flex-col justify-between rounded-2xl bg-[linear-gradient(165deg,#111a5e_0%,#0a1248_100%)] p-6 text-white shadow-[0_14px_40px_rgba(15,23,42,0.18)] ring-1 ring-white/10 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-semibold uppercase tracking-wide">{item.code}</span>
                <div>
                  <p className="text-2xl font-bold leading-tight sm:text-[26px]">{item.title}</p>
                  <p className="mt-1 text-base text-white/70 sm:text-lg">{item.subtitle}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{item.description}</p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-violet-400/40 bg-transparent py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
              >
                <svg
                  className="h-4 w-4 shrink-0 text-violet-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {t("partners.view_pdf")}
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {t("partners.download")}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
