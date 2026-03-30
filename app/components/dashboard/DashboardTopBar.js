"use client";

import Image from "next/image";
import Link from "next/link";
import { useDashboardWalletModal } from "./DashboardWalletConnectModal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { languageOptions } from "@/app/lib/languages";
import FlagIcon from "../FlagIcon";
import { useSiteTranslation } from "../SiteTranslationProvider";
import logowhite from "@/public/images/logo-white.png"

function shortenAddress(addr) {
  if (!addr || addr.length < 12) return addr || "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function WalletGlyph({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m0 0a2.25 2.25 0 012.25-2.25H18.75A2.25 2.25 0 0121 9v3M3 9v3"
      />
    </svg>
  );
}

export default function DashboardTopBar({ onMenuClick }) {
  const router = useRouter();
  const { openWalletModal } = useDashboardWalletModal();
  const { address, isConnected } = useAccount();
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
    <header className="relative z-30 w-full border-b border-white/[0.06] bg-transparent backdrop-blur-md">
      <div className="flex min-h-[52px] w-full min-w-0 items-center gap-1.5 px-2 py-1.5 sm:min-h-[56px] sm:gap-4 sm:px-5 sm:py-2 lg:px-6">
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

        <Link href="/dashboard" className="flex shrink-0 items-center" aria-label={t("dash.logo_alt")}>
          <Image
            src={logowhite}
            alt={t("dash.logo_alt")}
            width={185}
            height={50}
            className="h-7 w-auto max-w-[140px] object-contain object-left sm:h-9 sm:max-w-[180px]"
            priority
          />
        </Link>

        <div className="relative mx-auto hidden min-w-0 flex-1 max-w-xs sm:flex sm:max-w-sm md:max-w-md">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input
            type="search"
            placeholder={t("dash.search_placeholder")}
            className="h-8 w-full min-w-0 rounded-[9px] border border-white/[0.1] bg-[#141235] py-1.5 pl-8 pr-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none ring-1 ring-white/[0.04] transition focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/20 md:pr-14"
            aria-label={t("dash.search_aria")}
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-white/[0.1] bg-[#141235] px-1 py-0.5 text-[9px] font-medium text-slate-500 md:inline">
            ⌘K
          </kbd>
        </div>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-1 sm:gap-2">
          <button
            type="button"
            onClick={openWalletModal}
            className={`inline-flex h-8 max-w-[11rem] shrink-0 items-center justify-center gap-1.5 rounded-[9px] border px-2.5 text-[11px] font-semibold transition sm:max-w-[13rem] md:max-w-none md:px-3 ${
              isConnected
                ? "border-emerald-500/35 bg-[#141235] text-emerald-100/90 ring-1 ring-white/[0.04] hover:border-emerald-400/45 hover:bg-[#1a1842]"
                : "border-[#6366f1]/40 bg-gradient-to-r from-[#6366f1] to-[#5C5AFF] text-white shadow-md shadow-indigo-950/30 hover:brightness-110"
            }`}
            aria-label={isConnected ? t("dash.topbar_wallet_manage") : t("dash.topbar_connect_wallet")}
          >
            <WalletGlyph className={`h-3.5 w-3.5 shrink-0 ${isConnected ? "text-emerald-300" : ""}`} />
            <span className="min-w-0 truncate">
              {isConnected && address ? shortenAddress(address) : t("dash.topbar_connect_wallet")}
            </span>
          </button>
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
