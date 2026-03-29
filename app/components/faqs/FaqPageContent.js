"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FAQ_PAGE_ITEMS } from "@/app/lib/siteStrings";
import { useSiteTranslation } from "../SiteTranslationProvider";

const FILTERS = [
  { id: "all", labelKey: "faq_page.filter_all" },
  { id: "general", labelKey: "faq_page.filter_general" },
  { id: "billing", labelKey: "faq_page.filter_billing" },
  { id: "technical", labelKey: "faq_page.filter_technical" },
];

export default function FaqPageContent() {
  const { t } = useSiteTranslation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  const visibleItems = useMemo(() => {
    const qLower = search.trim().toLowerCase();
    return FAQ_PAGE_ITEMS.filter(({ category, q }) => {
      if (filter !== "all" && category !== filter) return false;
      if (!qLower) return true;
      const text = t(q).toLowerCase();
      return text.includes(qLower);
    });
  }, [search, filter, t]);

  useEffect(() => {
    setOpenIndex(null);
  }, [search]);

  const toggle = (displayIndex) => {
    setOpenIndex((prev) => (prev === displayIndex ? null : displayIndex));
  };

  return (
    <div className="relative w-full min-w-0 overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(99,102,241,0.12),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-6 pt-10 text-center sm:px-6 sm:pt-14 lg:px-10 lg:pt-16">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[44px] lg:leading-tight">
          {t("faq_page.hero_title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 sm:text-lg">{t("faq_page.hero_subtitle")}</p>

        <div className="mx-auto mt-10 max-w-2xl">
          <label htmlFor="faq-search" className="sr-only">
            {t("faq_page.search_ph")}
          </label>
          <input
            id="faq-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("faq_page.search_ph")}
            className="w-full rounded-xl border border-white/[0.12] bg-[#141235] px-5 py-3.5 text-left text-sm text-white placeholder:text-slate-500 outline-none ring-0 transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 sm:text-[15px]"
          />
        </div>

        <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-3">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id);
                  setOpenIndex(null);
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-[13px] ${
                  active
                    ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-900/40"
                    : "bg-white/[0.06] text-slate-400 ring-1 ring-white/[0.08] hover:bg-white/[0.1] hover:text-slate-200"
                }`}
              >
                {t(f.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141235]/80 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.05] backdrop-blur-sm">
          {visibleItems.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate-400">{t("faq_page.no_results")}</p>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {visibleItems.map((item, i) => {
                const isOpen = openIndex === i;
                const question = t(item.q);
                const answer = t(item.a);
                return (
                  <li key={item.q}>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition hover:bg-white/[0.03] sm:px-6 sm:py-5"
                      aria-expanded={isOpen}
                    >
                      <span className="min-w-0 flex-1 break-words text-[15px] font-semibold leading-snug text-white sm:text-base">
                        {question}
                      </span>
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.12] text-lg font-light text-white transition ${
                          isOpen ? "rotate-45 bg-white/[0.08]" : ""
                        }`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="border-t border-white/[0.04] px-5 pb-5 pl-5 text-left text-sm leading-7 text-slate-400 sm:px-6 sm:pb-6 sm:text-[15px] sm:leading-8">
                          {answer}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-white/[0.06] bg-[#141235] p-6 sm:p-8">
            <div className="mx-auto max-w-md text-center">
              <p className="text-base font-semibold text-white sm:text-lg">{t("faq_page.support_title")}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-[15px]">{t("faq_page.support_body")}</p>
              <a
                href="mailto:support@quantronetwork.com"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-[#0f172a] shadow-md transition hover:bg-slate-100"
              >
                {t("faq_page.contact_cta")}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0f1428] to-[#080b14] p-6 shadow-xl sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8 lg:p-10">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white sm:text-2xl">{t("faq_page.cta_title")}</h2>
            <p className="mt-2 max-w-md text-sm text-slate-400 sm:text-[15px]">{t("faq_page.cta_subtitle")}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-shrink-0 sm:flex-row sm:items-center">
            <Link
              href="/membership"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#0f172a] transition hover:bg-slate-100"
            >
              {t("faq_page.cta_pricing")}
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/25 bg-transparent px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("faq_page.cta_portal")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
