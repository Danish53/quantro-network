"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { languageOptions } from "@/app/lib/languages";
import { NAV_LINKS } from "@/app/lib/siteStrings";
import { useSiteTranslation } from "./SiteTranslationProvider";

function countryCodeToEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

export default function Navbar({
  brand = "Quantro Network",
  links = NAV_LINKS,
  loginLabelKey = "nav.login",
  ctaLabelKey = "nav.cta",
  ctaHref = "/register",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const { language, setLanguage, t, isTranslating } = useSiteTranslation();

  const selectedLanguage = useMemo(
    () => languageOptions.find((lang) => lang.code === language) ?? languageOptions[0],
    [language]
  );

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!langDropdownRef.current) return;
      if (!langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode);
    setIsOpen(false);
    setIsLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="mx-auto flex h-[80px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="shrink-0" aria-label={brand}>
          <Image src="/logo-horizon.png" alt={brand} width={185} height={50} priority />
        </Link>

        <div className="hidden items-center gap-8 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-[600] text-[#4B5563] transition-colors hover:text-[#111827]"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <Link href="/login" className="px-1 text-[13px] font-semibold text-[#111827] transition hover:text-blue-700">
            {t(loginLabelKey)}
          </Link>
          <Link
            href={ctaHref}
            className="rounded-full border border-[lightgray] bg-white px-5 py-[9px] text-[14px] font-semibold text-[#111827] transition hover:bg-slate-50"
          >
            {t(ctaLabelKey)} <span aria-hidden="true" className="ml-1">{">"}</span>
          </Link>

          <div ref={langDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-sm bg-white px-3 py-2.5 text-[13px] font-semibold text-[#111827] shadow-sm transition"
              aria-haspopup="listbox"
              aria-expanded={isLangOpen}
            >
              <span aria-hidden="true">{countryCodeToEmoji(selectedLanguage.flag)}</span>
              <span className="uppercase">{selectedLanguage.code}</span>
              <svg
                className={`h-3 w-3 text-slate-500 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isLangOpen ? (
              <ul
                className="absolute right-0 z-20 mt-2 max-h-72 w-64 overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
                role="listbox"
                aria-label={t("nav.lang_options")}
              >
                {languageOptions.map((langOption) => (
                  <li key={langOption.code}>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange(langOption.code)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] ${
                        language === langOption.code
                          ? "bg-slate-100 font-semibold text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                      role="option"
                      aria-selected={language === langOption.code}
                    >
                      <span aria-hidden="true">{countryCodeToEmoji(langOption.flag)}</span>
                      <span>{langOption.label}</span>
                      <span className="ml-auto uppercase text-slate-500">{langOption.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 transition hover:bg-slate-100 xl:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span className="sr-only">{t("nav.open_menu")}</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setIsOpen(false)}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <Link href="/login" className="rounded-md px-2 py-2 text-sm font-semibold text-slate-900" onClick={() => setIsOpen(false)}>
              {t(loginLabelKey)}
            </Link>
            <Link
              href={ctaHref}
              className="mt-1 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-900 shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              {t(ctaLabelKey)} <span aria-hidden="true" className="ml-1">{">"}</span>
            </Link>
            <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{t("nav.language")}</p>
              <div className="grid gap-1">
                {languageOptions.map((langOption) => (
                  <button
                    key={langOption.code}
                    type="button"
                    onClick={() => handleLanguageChange(langOption.code)}
                    className={`flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${
                      language === langOption.code
                        ? "bg-slate-100 font-semibold text-slate-900"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span aria-hidden="true">{countryCodeToEmoji(langOption.flag)}</span>
                    <span>{langOption.label}</span>
                    <span className="ml-auto uppercase text-slate-500">{langOption.code}</span>
                  </button>
                ))}
              </div>
            </div>
            {isTranslating ? <p className="text-xs text-slate-500">{t("nav.translating")}</p> : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
