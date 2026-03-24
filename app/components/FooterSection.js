"use client";

import Link from "next/link";
import { useState } from "react";
import { useSiteTranslation } from "./SiteTranslationProvider";

const accent = "#7066e0";

const footerColumns = [
  {
    titleKey: "footer.col_company",
    links: [
      { labelKey: "footer.link_about", href: "/about-us" },
      { labelKey: "footer.link_mission", href: "/about-us" },
    ],
  },
  {
    titleKey: "footer.col_corporate",
    links: [
      { labelKey: "footer.link_roadmap", href: "/roadmap" },
      { labelKey: "footer.link_compliance", href: "/about-us" },
      { labelKey: "footer.link_membership", href: "/membership" },
    ],
  },
  {
    titleKey: "footer.col_legal",
    links: [
      { labelKey: "footer.link_terms", href: "/about-us" },
      { labelKey: "footer.link_privacy", href: "/about-us" },
      { labelKey: "footer.link_risk", href: "/about-us" },
    ],
  },
  {
    titleKey: "footer.col_help",
    links: [
      { labelKey: "footer.link_academy", href: "/about-us" },
      { labelKey: "footer.link_guide", href: "/get-started" },
      { labelKey: "footer.link_faq", href: "/faqs" },
      { labelKey: "footer.link_support", href: "mailto:support@quantronetwork.com" },
    ],
  },
];

function TelegramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function FooterSection() {
  const { t } = useSiteTranslation();
  const [email, setEmail] = useState("");
  const [miniEmail, setMiniEmail] = useState("");
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setEmail("");
  };

  const handleMiniSubscribe = (e) => {
    e.preventDefault();
    if (miniEmail.trim()) setMiniEmail("");
  };

  return (
    <footer className="relative w-full overflow-hidden rounded-[24px] border border-slate-100 bg-white px-4 py-12 text-slate-900 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sky-100/50 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl lg:text-[2rem]">{t("footer.news_title")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{t("footer.news_desc")}</p>
        <form
          onSubmit={handleSubscribe}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-2"
        >
          <label htmlFor="footer-newsletter-email" className="sr-only">
            {t("footer.email_label")}
          </label>
          <input
            id="footer-newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={t("footer.email_ph")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[48px] w-full flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-[#0f172a] placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
          <button
            type="submit"
            className="min-h-[48px] shrink-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-sm font-semibold text-white shadow-md transition hover:brightness-105 sm:px-10"
          >
            {t("footer.subscribe")}
          </button>
        </form>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl border-t border-slate-100 pt-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {footerColumns.map((col) => (
            <div key={col.titleKey}>
              <h3 className="text-sm font-bold text-violet-600 sm:text-[15px]">{t(col.titleKey)}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((item) => (
                  <li key={item.labelKey}>
                    <Link href={item.href} className="text-sm text-slate-600 transition hover:text-slate-900">
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-10 border-t border-slate-100 pt-12 md:flex-row md:items-start md:justify-between md:gap-8">
          <div>
            <h3 className="text-base font-bold" style={{ color: accent }}>
              {t("footer.connect")}
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://t.me/quantronetwork"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8e6f4] text-[#7066e0] transition hover:bg-[#ddd8f0]"
                aria-label="Telegram"
              >
                <TelegramIcon />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8e6f4] text-[#7066e0] transition hover:bg-[#ddd8f0]"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>

          <div className="w-full md:max-w-md md:flex-shrink-0">
            <h3 className="text-base font-bold" style={{ color: accent }}>
              {t("footer.newsletter_heading")}
            </h3>
            <form
              onSubmit={handleMiniSubscribe}
              className="mt-4 flex w-full max-w-md flex-col gap-0 sm:flex-row sm:items-stretch"
            >
              <label htmlFor="footer-mini-newsletter-email" className="sr-only">
                {t("footer.mini_email_label")}
              </label>
              <input
                id="footer-mini-newsletter-email"
                type="email"
                autoComplete="email"
                placeholder={t("footer.mini_email_ph")}
                value={miniEmail}
                onChange={(e) => setMiniEmail(e.target.value)}
                className="min-h-[44px] w-full flex-1 rounded-l-lg rounded-r-lg border border-slate-200 bg-white px-4 text-sm text-[#0f172a] placeholder:text-slate-400 outline-none transition focus:z-10 focus:border-[#7066e0] focus:ring-1 focus:ring-[#7066e0]/30 sm:rounded-r-none"
              />
              <button
                type="submit"
                className="min-h-[44px] shrink-0 rounded-lg border border-[#7066e0] bg-[#7066e0] px-5 text-sm font-semibold text-white transition hover:brightness-105 sm:rounded-l-none sm:rounded-r-lg sm:border-l-0"
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-16 py-8 text-center text-xs font-normal tracking-normal text-slate-400 sm:text-[13px]">
          {t("footer.copyright").replace("{year}", String(year))}
        </p>

        <p className="mx-auto max-w-3xl px-2 text-center text-sm font-normal leading-7 text-slate-600 sm:text-[15px] sm:leading-8">
          {t("footer.tagline")}
        </p>
      </div>
    </footer>
  );
}
