"use client";

import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

const cardShell =
  "rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6";

const WALLET_ROWS = [
  { key: "usdt", titleKey: "dash.wal.usdt", netKey: "dash.wal.usdt_net", color: "from-emerald-600/30 to-emerald-900/20" },
  { key: "usdc", titleKey: "dash.wal.usdc", netKey: "dash.wal.usdc_net", color: "from-blue-600/30 to-blue-900/20" },
  { key: "eth", titleKey: "dash.wal.eth", netKey: "dash.wal.eth_net", color: "from-violet-600/30 to-violet-900/20" },
];

export default function WalletsView() {
  const { t } = useSiteTranslation();

  return (
    <DashboardStandardPage titleKey="dash.wal.title" breadcrumbLastKey="dash.wal.title">
      <p className="mb-6 max-w-3xl text-sm text-slate-400">{t("dash.wal.subtitle")}</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {WALLET_ROWS.map((w) => (
          <div key={w.key} className={`${cardShell} flex flex-col bg-gradient-to-br ${w.color}`}>
            <p className="text-sm font-semibold text-white">{t(w.titleKey)}</p>
            <p className="mt-1 text-xs text-slate-400">{t(w.netKey)}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">{t("dash.wal.balance")}</p>
            <p className="text-2xl font-bold text-white">0.00</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="flex-1 rounded-[10px] bg-[#2563eb] px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
              >
                {t("dash.wal.deposit")}
              </button>
              <button
                type="button"
                className="flex-1 rounded-[10px] border border-white/15 bg-transparent px-3 py-2 text-center text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                {t("dash.wal.withdraw")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardStandardPage>
  );
}
