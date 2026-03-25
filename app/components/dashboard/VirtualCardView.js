"use client";

import { useState } from "react";
import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

const cardShell = "rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 sm:p-6";

export default function VirtualCardView() {
  const { t } = useSiteTranslation();
  const [hasCard] = useState(true);
  const [frozen, setFrozen] = useState(false);

  return (
    <DashboardStandardPage titleKey="dash.vcard.title" breadcrumbLastKey="dash.vcard.title">
      <p className="mb-6 max-w-2xl text-sm text-slate-400">{t("dash.vcard.subtitle")}</p>

      {!hasCard ? (
        <div className={`${cardShell} text-center`}>
          <h2 className="text-lg font-semibold text-white">{t("dash.vcard.apply_title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{t("dash.vcard.apply_body")}</p>
          <button
            type="button"
            className="mt-6 rounded-[10px] bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1d4ed8]"
          >
            {t("dash.vcard.apply_btn")}
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e1b4b 100%)",
              }}
            >
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{t("dash.vcard.network")}</p>
              <p className="mt-8 font-mono text-xl tracking-widest text-white">{t("dash.vcard.masked")}</p>
              <div className="mt-6 flex justify-between text-sm text-slate-300">
                <span>{t("dash.vcard.expiry")} 12/28</span>
                <span>CVV •••</span>
              </div>
            </div>

            <div className={`${cardShell} flex flex-col justify-between`}>
              <div>
                <p className="text-sm text-[#a0aec0]">{t("dash.vcard.balance_fiat")}</p>
                <p className="mt-1 text-3xl font-bold text-[#38bdf8]">$0.00</p>
                <p className="mt-2 text-xs text-slate-500">{t("dash.vcard.balance_label")}</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    frozen ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {frozen ? t("dash.vcard.status_frozen") : t("dash.vcard.status_active")}
                </span>
                <button
                  type="button"
                  onClick={() => setFrozen((v) => !v)}
                  className={`rounded-[10px] px-4 py-2 text-sm font-medium transition ${
                    frozen
                      ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      : "border border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                  }`}
                >
                  {frozen ? t("dash.vcard.unfreeze") : t("dash.vcard.freeze")}
                </button>
              </div>
            </div>
          </div>

          <div className={`${cardShell} mt-6`}>
            <h2 className="text-lg font-semibold text-white">{t("dash.vcard.activity")}</h2>
            <div className="mt-4 overflow-x-auto dashboard-sidebar-scroll">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-3 py-2 font-medium text-[#a0aec0]">{t("dash.vcard.col_merchant")}</th>
                    <th className="px-3 py-2 font-medium text-[#a0aec0]">{t("dash.vcard.col_amount")}</th>
                    <th className="px-3 py-2 font-medium text-[#a0aec0]">{t("dash.vcard.col_status")}</th>
                    <th className="px-3 py-2 font-medium text-[#a0aec0]">{t("dash.vcard.col_date")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="px-3 py-12 text-center text-slate-500">
                      {t("dash.vcard.empty_activity")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardStandardPage>
  );
}
