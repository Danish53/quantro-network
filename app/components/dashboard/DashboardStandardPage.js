"use client";

import Link from "next/link";
import DashboardNavigateDropdown from "./DashboardNavigateDropdown";
import { useSiteTranslation } from "../SiteTranslationProvider";

/**
 * @param {string} titleKey - i18n key for H1
 * @param {string} [breadcrumbLastKey] - last crumb key; defaults to titleKey
 */
export default function DashboardStandardPage({ titleKey, breadcrumbLastKey, children }) {
  const { t } = useSiteTranslation();
  const last = breadcrumbLastKey ?? titleKey;
  return (
    <div className="relative pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">{t(titleKey)}</h1>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <nav className="text-sm text-slate-400" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/dashboard" className="font-medium transition hover:text-[#a5b4fc]">
                  {t("dash.breadcrumb_dashboard")}
                </Link>
              </li>
              <li className="px-1 text-slate-500" aria-hidden>
                /
              </li>
              <li className="font-medium text-slate-300">{t(last)}</li>
            </ol>
          </nav>
          <DashboardNavigateDropdown />
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
