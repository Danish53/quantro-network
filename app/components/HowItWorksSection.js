"use client";

import { useSiteTranslation } from "./SiteTranslationProvider";

const STEP_KEYS = [
  { title: "hiw.step1_title", body: "hiw.step1_body" },
  { title: "hiw.step2_title", body: "hiw.step2_body" },
  { title: "hiw.step3_title", body: "hiw.step3_body" },
  { title: "hiw.step4_title", body: "hiw.step4_body" },
  { title: "hiw.step5_title", body: "hiw.step5_body" },
];

function ArrowBetween() {
  return (
    <div
      className="flex shrink-0 items-center justify-center py-2 lg:self-start lg:pt-10"
      aria-hidden="true"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(15,23,42,0.12)] ring-1 ring-slate-100 sm:h-10 sm:w-10">
        <span className="text-sm font-semibold leading-none text-[#3b82f6] sm:text-base">›</span>
      </div>
    </div>
  );
}

function ArrowDownMobile() {
  return (
    <div className="flex justify-center py-1 lg:hidden" aria-hidden="true">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(15,23,42,0.12)] ring-1 ring-slate-100">
        <span className="text-lg font-semibold leading-none text-[#3b82f6]">⌄</span>
      </div>
    </div>
  );
}

function StepBlock({ title, body }) {
  return (
    <article className="min-w-0 flex-1 text-left">
      <h4 className="text-base font-bold leading-snug text-[#0a1d37] sm:text-lg">{title}</h4>
      <p className="mt-3 text-sm leading-7 text-[#4b5563] sm:text-[15px]">{body}</p>
    </article>
  );
}

export default function HowItWorksSection() {
  const { t } = useSiteTranslation();

  return (
    <section className="w-full bg-white py-10 text-center sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">{t("hiw.eyebrow")}</p>
      <h3 className="mt-3 text-3xl font-extrabold text-[#111827] sm:text-[44px]">{t("hiw.title")}</h3>

      <div className="mx-auto mt-10 w-full max-w-6xl text-left">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-1">
          <StepBlock title={t(STEP_KEYS[0].title)} body={t(STEP_KEYS[0].body)} />
          <ArrowDownMobile />
          <div className="hidden items-start justify-center px-1 pt-10 lg:flex lg:w-14 lg:flex-none lg:shrink-0">
            <ArrowBetween />
          </div>
          <StepBlock title={t(STEP_KEYS[1].title)} body={t(STEP_KEYS[1].body)} />
          <ArrowDownMobile />
          <div className="hidden items-start justify-center px-1 pt-10 lg:flex lg:w-14 lg:flex-none lg:shrink-0">
            <ArrowBetween />
          </div>
          <StepBlock title={t(STEP_KEYS[2].title)} body={t(STEP_KEYS[2].body)} />
        </div>

        <div className="mt-10 flex flex-col lg:mt-14 lg:w-[calc(66.666%-0.5rem)] lg:flex-row lg:items-start lg:gap-1">
          <StepBlock title={t(STEP_KEYS[3].title)} body={t(STEP_KEYS[3].body)} />
          <ArrowDownMobile />
          <div className="hidden items-start justify-center px-1 pt-10 lg:flex lg:w-14 lg:flex-none lg:shrink-0">
            <ArrowBetween />
          </div>
          <StepBlock title={t(STEP_KEYS[4].title)} body={t(STEP_KEYS[4].body)} />
        </div>
      </div>
    </section>
  );
}
