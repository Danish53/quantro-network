"use client";

import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function LiveTradesView() {
  const { t } = useSiteTranslation();
  return (
    <DashboardStandardPage titleKey="dash.live.title" breadcrumbLastKey="dash.live.title">
      <p className="mb-6 text-sm text-slate-400">{t("dash.live.subtitle")}</p>
      <div className="rounded-xl border border-white/[0.08] bg-[#141235] p-5 shadow-sm ring-1 ring-white/[0.04] sm:p-6">
        <div className="dashboard-sidebar-scroll overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.live.col_pair")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.live.col_side")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.live.col_size")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.live.col_pnl")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.live.col_time")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                  {t("dash.live.empty")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardStandardPage>
  );
}
