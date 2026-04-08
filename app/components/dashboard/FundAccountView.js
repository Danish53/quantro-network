"use client";

import DashboardNavigateDropdown from "./DashboardNavigateDropdown";
import { useSiteTranslation } from "../SiteTranslationProvider";
import FundDepositSection from "./FundDepositSection";

export default function FundAccountView() {
  const { t } = useSiteTranslation();

  return (
    <div className="relative pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">{t("dash.fund.page_title")}</h1>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <nav className="text-sm text-slate-400" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li className="text-slate-400">{t("dash.fund.breadcrumb_finance")}</li>
              <li className="px-1 text-slate-500" aria-hidden>
                /
              </li>
              <li className="text-slate-300">{t("dash.fund.page_title")}</li>
            </ol>
          </nav>
          <DashboardNavigateDropdown />
        </div>
      </div>

      <div className="mt-8">
        <FundDepositSection toastPlacement="fixed" />
      </div>
    </div>
  );
}
