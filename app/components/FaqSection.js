"use client";

import { useState } from "react";
import { FAQ_ITEM_KEYS } from "@/app/lib/siteStrings";
import { useSiteTranslation } from "./SiteTranslationProvider";

export default function FaqSection() {
  const { t } = useSiteTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faqs"
      className="relative w-full overflow-hidden rounded-[24px] bg-gradient-to-b from-slate-50 via-white to-[#f8fafc] py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600 sm:text-[13px]">{t("faq.eyebrow")}</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl lg:text-[44px] lg:leading-tight">
          {t("faq.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-[17px]">
          {t("faq.intro_before")}{" "}
          <a
            href="mailto:support@quantronetwork.com"
            className="font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition hover:text-indigo-700"
          >
            support@quantronetwork.com
          </a>{" "}
          {t("faq.intro_after")}
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-3 sm:mt-14">
        {FAQ_ITEM_KEYS.map((item, index) => {
          const isOpen = openIndex === index;
          const question = t(item.q);
          return (
            <div
              key={item.q}
              className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80 sm:px-6 sm:py-5"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
              >
                <span className="text-base font-bold text-[#0f172a] sm:text-lg">{question}</span>
                <span
                  className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="border-t border-slate-100 px-5 pb-5 pt-0 text-left text-sm leading-7 text-slate-600 sm:px-6 sm:text-[15px]">
                    {t(item.a)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
