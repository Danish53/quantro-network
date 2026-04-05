"use client";

import Link from "next/link";
import { useSiteTranslation } from "../SiteTranslationProvider";
import { usePortalLink } from "@/app/hooks/usePortalLink";

const SECTION_KEYS = [
  { titleKey: "privacy.s1_title", bodyKey: "privacy.s1_body" },
  { titleKey: "privacy.s2_title", bodyKey: "privacy.s2_body" },
  { titleKey: "privacy.s3_title", bodyKey: "privacy.s3_body" },
  { titleKey: "privacy.s4_title", bodyKey: "privacy.s4_body" },
  { titleKey: "privacy.s5_title", bodyKey: "privacy.s5_body" },
  { titleKey: "privacy.s6_title", bodyKey: "privacy.s6_body" },
  { titleKey: "privacy.s7_title", bodyKey: "privacy.s7_body" },
];

const PLACEMENT_KEYS = ["privacy.place_1", "privacy.place_2", "privacy.place_3", "privacy.place_4"];

function Bullet({ children }) {
  return (
    <li className="flex gap-3 text-slate-300">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPolicyContent() {
  const { t } = useSiteTranslation();
  const { loggedIn, portalHref } = usePortalLink();

  return (
    <div className="relative w-full min-w-0 overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(99,102,241,0.12),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-8 pt-10 text-center sm:px-6 sm:pt-14 lg:px-10 lg:pt-16">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[44px] lg:leading-tight">
          {t("privacy.hero_title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">{t("privacy.hero_subtitle")}</p>
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-12 sm:px-6 lg:px-10">
        <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141235]/90 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.05] backdrop-blur-sm">
          <div className="space-y-10 px-4 py-8 sm:px-10 sm:py-10">
            {SECTION_KEYS.map(({ titleKey, bodyKey }) => (
              <section key={titleKey}>
                <h2 className="text-lg font-semibold text-indigo-400 sm:text-xl">{t(titleKey)}</h2>
                <p className="mt-4 break-words text-slate-300">{t(bodyKey)}</p>
              </section>
            ))}

            <section className="border-t border-white/[0.06] pt-10">
              <h2 className="text-lg font-semibold text-indigo-400 sm:text-xl">{t("privacy.placement_title")}</h2>
              <p className="mt-4 text-slate-300">{t("privacy.placement_intro")}</p>
              <ul className="mt-4 space-y-3">
                {PLACEMENT_KEYS.map((key) => (
                  <Bullet key={key}>{t(key)}</Bullet>
                ))}
              </ul>
            </section>
          </div>
        </article>

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
              href={loggedIn ? portalHref : "/login"}
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
