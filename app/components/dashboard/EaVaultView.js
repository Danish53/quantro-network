"use client";

import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function EaVaultView() {
  const { t } = useSiteTranslation();
  return (
    <DashboardStandardPage titleKey="dash.vault.title" breadcrumbLastKey="dash.vault.title">
      <p className="mb-6 text-sm text-slate-400">{t("dash.vault.subtitle")}</p>
      <div className="rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 sm:p-6">
        <div className="dashboard-sidebar-scroll overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.vault.col_name")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.vault.col_version")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.vault.col_status")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.vault.col_expiry")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-4 py-16 text-center text-slate-500">
                  {t("dash.vault.empty")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardStandardPage>
  );
}
