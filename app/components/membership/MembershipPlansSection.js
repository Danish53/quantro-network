"use client";

import Link from "next/link";
import { useSiteTranslation } from "../SiteTranslationProvider";
import Image from "next/image";
import bnb from "@/public/images/bnb.svg";
import usdtLogo from "@/public/images/tether.svg";

const ACCESS_KEYS = [
  "membership.access_f1",
  "membership.access_f2",
  "membership.access_f3",
  "membership.access_f4",
  "membership.access_f5",
  "membership.access_f6",
  "membership.access_f7",
];

const PRIME_KEYS = [
  "membership.prime_f1",
  "membership.prime_f2",
  "membership.prime_f3",
  "membership.prime_f4",
  "membership.prime_f5",
  "membership.prime_f6",
  "membership.prime_f7",
];

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/25 ring-1 ring-[#60a5fa]/40">
      <svg className="h-3 w-3 text-[#93c5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function MembershipPlansSection() {
  const { t } = useSiteTranslation();

  return (
    <div className="relative w-full min-w-0 overflow-hidden">
      <div
        className="pointer-events-none "
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-6 pt-10 text-center sm:px-6 sm:pt-14 lg:px-10 lg:pt-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-300 sm:text-xs">{t("membership.eyebrow")}</p>
        <h1 className="my-5 mt-4 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-black sm:text-3xl md:text-4xl lg:text-[44px] lg:leading-[1.12]">
          {t("membership.hero_title")}
        </h1>
        <div className="mt-8 w-full max-w-xl rounded-2xl border border-indigo-400/30 bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#6366f1]/35 px-5 py-4 shadow-[0_20px_50px_rgba(79,70,229,0.25)] backdrop-blur-sm sm:px-8 sm:py-5">
          <p className="break-words text-sm font-medium leading-relaxed text-white/95 sm:text-[15px]">
            {t("membership.promo")}
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xl flex-col gap-8 px-4 pb-12 sm:px-6 lg:px-10 py-10">
        {/* Access Quarterly */}
        <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1329] shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.06] mb-5">
          <div className="px-6 pb-2 pt-7 sm:px-8 sm:pt-8">
            <h2 className="text-left text-xl font-bold text-white sm:text-2xl">{t("membership.access_title")}</h2>
            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-600/35 via-[#4f46e5]/30 to-purple-700/35 p-6 shadow-inner sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left">
                  <p className="text-3xl font-bold tabular-nums text-white sm:text-[2rem]">
                    {t("membership.access_price")}
                    <span className="text-lg font-semibold text-white/75 sm:text-xl">{t("membership.access_period")}</span>
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#0f172a] shadow-md transition hover:bg-slate-100"
                >
                  {t("membership.access_cta")}
                  <span aria-hidden>›</span>
                </Link>
              </div>
            </div>
            <ul className="mt-8 space-y-4 pb-8 text-left">
              {ACCESS_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-[15px] leading-relaxed text-white/90 sm:text-base">
                  <CheckIcon />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Prime Quarterly */}
        <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1329] shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.06]">
          <div className="px-6 pb-2 pt-7 sm:px-8 sm:pt-8">
            <h2 className="text-left text-xl font-bold text-white sm:text-2xl">{t("membership.prime_title")}</h2>
            <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left">
                  <p className="text-3xl font-bold tabular-nums text-[#6366f1] sm:text-[2rem]">
                    {t("membership.prime_price")}
                    <span className="text-lg font-semibold text-[#6366f1]/75 sm:text-xl">{t("membership.prime_period")}</span>
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-[#0a0e27] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#121a3a]"
                >
                  {t("membership.prime_cta")}
                  <span aria-hidden>›</span>
                </Link>
              </div>
            </div>
            <ul className="mt-8 space-y-4 pb-8 text-left">
              {PRIME_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-[15px] leading-relaxed text-white/90 sm:text-base">
                  <CheckIcon />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <p className="pb-2 text-center text-xs font-medium text-black mt-12 sm:text-sm">{t("membership.trust")}</p>
        <div className="flex flex-wrap mt-4 items-center justify-center gap-3 sm:gap-3">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" focusable="false" class="chakra-icon css-ev9woa" height="35" width="35" xmlns="http://www.w3.org/2000/svg">
            <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-141.651-35.33c4.937-32.999-20.191-50.739-54.55-62.573l11.146-44.702-27.213-6.781-10.851 43.524c-7.154-1.783-14.502-3.464-21.803-5.13l10.929-43.81-27.198-6.781-11.153 44.686c-5.922-1.349-11.735-2.682-17.377-4.084l.031-.14-37.53-9.37-7.239 29.062s20.191 4.627 19.765 4.913c11.022 2.751 13.014 10.044 12.68 15.825l-12.696 50.925c.76.194 1.744.473 2.829.907-.907-.225-1.876-.473-2.876-.713l-17.796 71.338c-1.349 3.348-4.767 8.37-12.471 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.147 35.414 8.827c6.588 1.651 13.045 3.379 19.4 5.006l-11.262 45.213 27.182 6.781 11.153-44.733a1038.209 1038.209 0 0 0 21.687 5.627l-11.115 44.523 27.213 6.781 11.262-45.128c46.404 8.781 81.299 5.239 95.986-36.727 11.836-33.79-.589-53.281-25.004-65.991 17.78-4.098 31.174-15.792 34.747-39.949zm-62.177 87.179c-8.41 33.79-65.308 15.523-83.755 10.943l14.944-59.899c18.446 4.603 77.6 13.717 68.811 48.956zm8.417-87.667c-7.673 30.736-55.031 15.12-70.393 11.292l13.548-54.327c15.363 3.828 64.836 10.973 56.845 43.035z"></path>
          </svg>
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" focusable="false" class="chakra-icon css-ev9woa" height="35" width="35" xmlns="http://www.w3.org/2000/svg">
            <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
          </svg>
          <Image src={bnb} className="w-10 h-10" alt="Trust" width={100} height={100} />
          <Image src={usdtLogo} className="w-10 h-10" alt="Trust" width={100} height={100} />
        </div>
      </div>
    </div>
  );
}
