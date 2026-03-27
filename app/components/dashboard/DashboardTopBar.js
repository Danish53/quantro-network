"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { languageOptions } from "@/app/lib/languages";
import logoImage from "@/public/images/logo-white.png";
import FlagIcon from "../FlagIcon";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function DashboardTopBar({ onMenuClick }) {
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [avatarInitials, setAvatarInitials] = useState("QN");
  const ref = useRef(null);
  const { language, setLanguage, t } = useSiteTranslation();
  const selected = useMemo(
    () => languageOptions.find((l) => l.code === language) ?? languageOptions[0],
    [language]
  );

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadUser = () =>
      fetch("/api/auth/me", { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled || !data?.user) return;
          const name = String(data.user.fullName || data.user.username || "QN").trim();
          const initials = name
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase() || "")
            .join("") || "QN";
          setAvatarInitials(initials);
          setAvatarDataUrl(data.user.avatarDataUrl || "");
        })
        .catch(() => {});

    const onProfileUpdated = () => loadUser();
    loadUser();
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener("profile-updated", onProfileUpdated);
    };
  }, []);

  return (
    <header className="relative z-30 w-full border-b border-white/[0.06] bg-[#14142a]/95 backdrop-blur-md">
      <div className="flex min-h-[52px] w-full min-w-0 items-center gap-1.5 px-2 py-1.5 sm:min-h-[56px] sm:gap-4 sm:px-5 sm:py-2 lg:px-6">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.08] bg-[#1C1C30] text-white lg:hidden"
          aria-label={t("dash.open_menu")}
          onClick={onMenuClick}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>

        <Link href="/dashboard" className="flex shrink-0 items-center" aria-label={t("dash.logo_alt")}>
          <Image src={logoImage} alt={t("dash.logo_alt")} className="h-6 w-auto max-w-[120px] sm:h-8 sm:max-w-[180px]" priority />
        </Link>

        <div className="relative mx-auto hidden min-w-0 flex-1 max-w-2xl sm:flex">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input
            type="search"
            placeholder={t("dash.search_placeholder")}
            className="h-10 w-full min-w-0 rounded-[10px] border border-white/[0.08] bg-[#1C1C30] py-2 pl-9 pr-10 text-xs text-white placeholder:text-slate-500 outline-none transition focus:border-[#9A6B20]/45 focus:ring-1 focus:ring-[#9A6B20]/25 sm:h-11 sm:pl-10 sm:pr-16 sm:text-sm md:pr-20"
            aria-label={t("dash.search_aria")}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/15 bg-[#252538] px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline">
            ⌘K
          </kbd>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          {/* <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-[10px] text-slate-400 transition hover:bg-white/[0.05] hover:text-white sm:h-10 sm:w-10"
            aria-label={t("dash.notifications")}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.082A2.25 2.25 0 0019.5 15v-3.75a6.75 6.75 0 00-1.5-4.23m0 0A6.75 6.75 0 009 5.25v3.75m0 0A6.75 6.75 0 001.5 15v3.75a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V15a6.75 6.75 0 00-1.5-4.23M9 5.25v3.75m0 0A6.75 6.75 0 0115 9v3.75m-6 0v-.75a6 6 0 0112 0v.75"
              />
            </svg>
            <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
              3
            </span>
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-slate-400 transition hover:bg-white/[0.05] hover:text-white sm:h-10 sm:w-10"
            aria-label={t("dash.theme")}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.53 16.122a3 3 0 00-.981 1.172 3.001 3.001 0 01-5.198 0 3 3 0 00-.981-1.172m9.962 0a3 3 0 00-.981-1.172 3.001 3.001 0 01-5.198 0 3 3 0 00-.981 1.172M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2.25M4.5 9.75H3m18 0h-1.5M8.25 19.5V21M15.75 19.5V21" />
            </svg>
          </button> */}

          <div ref={ref} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="flex h-9 items-center gap-1.5 rounded-[10px] border border-white/[0.08] bg-[#1C1C30] px-2 text-xs font-medium text-white sm:h-10 sm:gap-2 sm:px-3 sm:text-sm"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
            >
              <FlagIcon countryCode={selected.flag} width={20} className="h-[15px]" />
              <span className="hidden sm:inline">{t(selected.labelKey)}</span>
              <svg className={`h-3 w-3 text-slate-400 transition ${langOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                />
              </svg>
            </button>
            {langOpen ? (
              <ul
                className="absolute right-0 z-[110] mt-2 max-h-64 w-52 overflow-auto rounded-[10px] border border-white/[0.08] bg-[#1C1C30] py-1 shadow-xl"
                role="listbox"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {languageOptions.map((opt) => (
                  <li key={opt.code}>
                    <button
                      type="button"
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                        language === opt.code ? "bg-white/[0.08] text-white" : "text-slate-300 hover:bg-white/[0.05]"
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLanguage(opt.code);
                        setLangOpen(false);
                      }}
                      onClick={() => {
                        setLanguage(opt.code);
                        setLangOpen(false);
                      }}
                    >
                      <FlagIcon countryCode={opt.flag} width={20} className="h-[15px]" />
                      {t(opt.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
              router.push("/login");
              router.refresh();
            }}
            className="hidden h-9 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.1] bg-[#252538] px-2.5 text-[11px] font-medium text-slate-200 transition hover:bg-[#2f2f48] sm:flex sm:h-10 sm:px-3 sm:text-xs"
          >
            {t("dash.logout")}
          </button>

          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.12] bg-gradient-to-br from-[#3d3d52] to-[#252538] text-xs font-bold text-white sm:h-10 sm:w-10"
            aria-label={t("dash.profile")}
          >
            {avatarDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              avatarInitials
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
