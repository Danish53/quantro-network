"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { languageOptions } from "@/app/lib/languages";
import FlagIcon from "../FlagIcon";
import { useSiteTranslation } from "../SiteTranslationProvider";
import logowhite from "@/public/images/logo-white.png";

export default function AdminTopBar({ onMenuClick }) {
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [avatarInitials, setAvatarInitials] = useState("QN");
  const ref = useRef(null);
  const { language, setLanguage, t } = useSiteTranslation();
  const selected = useMemo(
    () => languageOptions.find((l) => l.code === language) ?? languageOptions[0],
    [language],
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
          const initials =
            name
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
    <header className="relative z-30 w-full border-b border-white/[0.06] bg-transparent backdrop-blur-md">
      <div className="flex min-h-[52px] w-full min-w-0 items-center gap-2 px-2 py-1.5 sm:min-h-[56px] sm:gap-3 sm:px-5 sm:py-2 lg:px-6">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.12] bg-white/[0.05] text-slate-200 lg:hidden"
          aria-label={t("dash.open_menu")}
          onClick={onMenuClick}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-md sm:flex-none lg:max-w-lg">
          <Link href="/dashboard/admin" className="flex shrink-0 items-center" aria-label={t("dash.logo_alt")}>
            <Image
              src={logowhite}
              alt={t("dash.logo_alt")}
              width={185}
              height={50}
              className="h-7 w-auto max-w-[120px] object-contain object-left sm:h-9 sm:max-w-[160px]"
              priority
            />
          </Link>
          <div className="hidden min-h-[36px] min-w-0 flex-col justify-center border-l border-white/[0.1] pl-3 sm:flex">
            <span className="text-[11px] font-semibold leading-snug text-slate-200">{t("admin.console_title")}</span>
            <span className="text-[10px] leading-snug text-slate-500">{t("admin.console_subtitle")}</span>
          </div>
          <div className="min-w-0 flex-1 border-l border-white/[0.08] pl-2 sm:hidden">
            <p className="truncate text-[10px] font-medium leading-tight text-slate-400">{t("admin.console_title")}</p>
          </div>
        </div>

        <div className="relative mx-auto hidden min-w-0 flex-1 max-w-xs sm:flex sm:max-w-sm md:max-w-md">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input
            type="search"
            placeholder={t("admin.search_placeholder")}
            className="h-8 w-full min-w-0 rounded-[9px] border border-white/[0.08] bg-[#141235] py-1.5 pl-8 pr-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none ring-1 ring-white/[0.04] transition focus:border-[#6366f1]/45 focus:ring-2 focus:ring-[#6366f1]/20 md:pr-14"
            aria-label={t("admin.search_aria")}
          />
        </div>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-1 sm:gap-2">
          <div ref={ref} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="flex h-8 items-center gap-1.5 rounded-[9px] border border-white/[0.1] bg-[#141235] px-2 text-xs font-medium text-slate-200 ring-1 ring-white/[0.04] transition hover:bg-[#1a1842] sm:h-9 sm:gap-2 sm:px-3 sm:text-sm"
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
                className="absolute right-0 z-[110] mt-2 max-h-64 w-52 overflow-auto rounded-[10px] border border-white/[0.1] bg-[#141235] py-1 shadow-lg ring-1 ring-black/20"
                role="listbox"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {languageOptions.map((opt) => (
                  <li key={opt.code}>
                    <button
                      type="button"
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                        language === opt.code ? "bg-[#6366f1]/25 text-[#a5b4fc]" : "text-slate-300 hover:bg-white/[0.06]"
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
            className="hidden h-8 shrink-0 items-center justify-center rounded-[9px] border border-white/[0.1] bg-[#141235] px-2.5 text-[11px] font-medium text-slate-200 ring-1 ring-white/[0.04] transition hover:bg-[#1a1842] lg:flex lg:h-9 lg:px-3 lg:text-xs"
          >
            {t("dash.logout")}
          </button>

          <button
            type="button"
            className="hidden h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.15] bg-gradient-to-br from-[#6366f1] to-[#5C5AFF] text-[10px] font-bold text-white shadow-sm lg:flex lg:h-9 lg:w-9 lg:text-xs"
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
