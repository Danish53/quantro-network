"use client";

import { useSiteTranslation } from "./SiteTranslationProvider";

export default function TranslationLoadingOverlay() {
  const { isTranslating, language, hydrated, t } = useSiteTranslation();
  if (!hydrated || !isTranslating || language === "en") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] flex items-start justify-center pt-24 sm:pt-28">
      <div
        className="pointer-events-auto flex max-w-[min(92vw,22rem)] items-center gap-3 rounded-xl border border-white/10 bg-[#161625]/95 px-4 py-3 text-sm text-slate-100 shadow-2xl shadow-black/50 backdrop-blur-md sm:px-5 sm:py-3.5"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span
          className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#9A6B20] border-t-transparent"
          aria-hidden
        />
        <span className="font-medium">{t("app.translating")}</span>
      </div>
    </div>
  );
}
