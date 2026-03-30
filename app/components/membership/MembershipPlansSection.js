"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteTranslation } from "../SiteTranslationProvider";
import bnb from "@/public/images/bnb.svg";
import usdtLogo from "@/public/images/tether.svg";

/** Shared feature rows (middle line varies per plan: subscription length + line 8). */
function featureKeysForPlan(plan) {
  return [
    plan.subKey,
    "membership.plan_feat_2",
    "membership.plan_feat_3",
    "membership.plan_feat_4",
    "membership.plan_feat_5",
    "membership.plan_feat_6",
    "membership.plan_feat_7",
    plan.feat8Key,
    "membership.plan_feat_9",
    "membership.plan_feat_10",
    "membership.plan_feat_11",
  ];
}

const PLANS = [
  {
    id: "quarterly",
    nameKey: "membership.plan_q_name",
    priceKey: "membership.plan_q_price",
    periodKey: "membership.plan_q_period",
    subKey: "membership.plan_feat_sub_3",
    feat8Key: "membership.plan_feat_8_placeholder",
  },
  {
    id: "semi",
    nameKey: "membership.plan_s_name",
    priceKey: "membership.plan_s_price",
    periodKey: "membership.plan_s_period",
    subKey: "membership.plan_feat_sub_6",
    feat8Key: "membership.plan_feat_8_placeholder",
  },
  {
    id: "annual",
    nameKey: "membership.plan_a_name",
    priceKey: "membership.plan_a_price",
    periodKey: "membership.plan_a_period",
    subKey: "membership.plan_feat_sub_12",
    feat8Key: "membership.plan_feat_8_physical",
  },
];

export default function MembershipPlansSection() {
  const { t } = useSiteTranslation();

  return (
    <div className="relative w-full min-w-0 overflow-hidden">
      <div
        className="pointer-events-none "
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-6 pt-10 text-center sm:px-6 sm:pt-14 lg:px-10 lg:pt-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-300 sm:text-xs">{t("membership.eyebrow")}</p>
        <h1 className="my-5 mt-4 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-black sm:text-3xl md:text-4xl lg:text-[44px] lg:leading-[1.12]">
          {t("membership.hero_title")}
        </h1>
        <div className="mt-8 w-full max-w-3xl rounded-2xl border border-indigo-400/30 bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#6366f1]/35 px-5 py-4 shadow-[0_20px_50px_rgba(79,70,229,0.25)] backdrop-blur-sm sm:px-8 sm:py-5">
          <p className="break-words text-sm font-medium leading-relaxed text-white/95 sm:text-[15px]">
            {t("membership.promo")}
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 pb-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch md:gap-5 lg:gap-6">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
            >
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3.5 text-center sm:py-4">
                <h2 className="text-base font-bold text-[#6564F1] sm:text-lg">{t(plan.nameKey)}</h2>
              </div>
              <div className="flex flex-1 flex-col px-4 pb-6 pt-5 text-center sm:px-5 sm:pt-6">
                <div className="text-[#6564F1]">
                  <span className="text-3xl font-bold tabular-nums tracking-tight sm:text-[2rem]">{t(plan.priceKey)}</span>
                  <span className="text-lg font-semibold sm:text-xl"> {t(plan.periodKey)}</span>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-left text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                  {featureKeysForPlan(plan).map((key) => (
                    <li key={key} className="text-center">
                      {t(key)}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-[10px] bg-[#5C5AFF] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#9A6B20]/20 transition hover:bg-[#ac7924] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t("membership.plan_cta")}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center text-xs font-medium text-slate-600 sm:text-sm">{t("membership.trust")}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 512 512"
            className="h-9 w-9 text-slate-600"
            height={35}
            width={35}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-141.651-35.33c4.937-32.999-20.191-50.739-54.55-62.573l11.146-44.702-27.213-6.781-10.851 43.524c-7.154-1.783-14.502-3.464-21.803-5.13l10.929-43.81-27.198-6.781-11.153 44.686c-5.922-1.349-11.735-2.682-17.377-4.084l.031-.14-37.53-9.37-7.239 29.062s20.191 4.627 19.765 4.913c11.022 2.751 13.014 10.044 12.68 15.825l-12.696 50.925c.76.194 1.744.473 2.829.907-.907-.225-1.876-.473-2.876-.713l-17.796 71.338c-1.349 3.348-4.767 8.37-12.471 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.147 35.414 8.827c6.588 1.651 13.045 3.379 19.4 5.006l-11.262 45.213 27.182 6.781 11.153-44.733a1038.209 1038.209 0 0 0 21.687 5.627l-11.115 44.523 27.213 6.781 11.262-45.128c46.404 8.781 81.299 5.239 95.986-36.727 11.836-33.79-.589-53.281-25.004-65.991 17.78-4.098 31.174-15.792 34.747-39.949zm-62.177 87.179c-8.41 33.79-65.308 15.523-83.755 10.943l14.944-59.899c18.446 4.603 77.6 13.717 68.811 48.956zm8.417-87.667c-7.673 30.736-55.031 15.12-70.393 11.292l13.548-54.327c15.363 3.828 64.836 10.973 56.845 43.035z" />
          </svg>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 320 512"
            className="h-9 w-9 text-slate-600"
            height={35}
            width={35}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
          </svg>
          <Image src={bnb} className="h-10 w-10" alt="" width={40} height={40} />
          <Image src={usdtLogo} className="h-10 w-10" alt="" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}
