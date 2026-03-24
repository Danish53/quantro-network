"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { languageOptions } from "@/app/lib/languages";
import { useSiteTranslation } from "../SiteTranslationProvider";

function countryCodeToEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

export default function DashboardTopBar({ onMenuClick }) {
  const [langOpen, setLangOpen] = useState(false);
  const ref = useRef(null);
  const { language, setLanguage } = useSiteTranslation();
  const selected = useMemo(
    () => languageOptions.find((l) => l.code === language) ?? languageOptions[0],
    [language]
  );

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex min-h-[56px] items-center gap-3 border-b border-white/10 bg-[#050f18]/55 px-3 py-2 backdrop-blur-xl sm:gap-4 sm:px-5 sm:py-3 lg:px-8">
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      <div className="relative mx-auto flex min-w-0 flex-1 max-w-2xl">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search pages..."
          className="h-10 w-full rounded-full border border-white/10 bg-black/25 py-2 pl-10 pr-16 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/30 sm:h-11 sm:pr-20"
          aria-label="Search pages"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline">
          ⌘K
        </kbd>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-white sm:flex"
          aria-label="Theme"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.53 16.122a3 3 0 00-.981 1.172 3.001 3.001 0 01-5.198 0 3 3 0 00-.981-1.172m9.962 0a3 3 0 00-.981-1.172 3.001 3.001 0 01-5.198 0 3 3 0 00-.981 1.172M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2.25M4.5 9.75H3m18 0h-1.5M8.25 19.5V21M15.75 19.5V21" />
          </svg>
        </button>

        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-2.5 text-xs font-medium text-white sm:gap-2 sm:px-3 sm:text-sm"
            aria-expanded={langOpen}
            aria-haspopup="listbox"
          >
            <span aria-hidden>{countryCodeToEmoji(selected.flag)}</span>
            <span className="hidden sm:inline">{selected.label}</span>
            <svg className={`h-3 w-3 text-slate-400 transition ${langOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
              />
            </svg>
          </button>
          {langOpen ? (
            <ul
              className="absolute right-0 z-50 mt-2 max-h-64 w-52 overflow-auto rounded-xl border border-white/10 bg-[#0c1824] py-1 shadow-xl"
              role="listbox"
            >
              {languageOptions.map((opt) => (
                <li key={opt.code}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                      language === opt.code ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"
                    }`}
                    onClick={() => {
                      setLanguage(opt.code);
                      setLangOpen(false);
                    }}
                  >
                    <span>{countryCodeToEmoji(opt.flag)}</span>
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-cyan-600/40 to-blue-700/50 text-xs font-bold text-white sm:h-10 sm:w-10"
          aria-label="Profile"
        >
          QN
        </button>
      </div>
    </header>
  );
}
