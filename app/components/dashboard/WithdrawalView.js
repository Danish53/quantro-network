"use client";

import { useState } from "react";
import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function WithdrawalView() {
  const { t } = useSiteTranslation();
  const [asset, setAsset] = useState("USDT_BNB");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const baseField =
    "mt-2 w-full rounded-[10px] border border-[#2a3558] bg-[#14182b] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/25";

  return (
    <DashboardStandardPage titleKey="dash.wd.title" breadcrumbLastKey="dash.wd.title">
      <p className="mb-6 text-sm text-slate-400">{t("dash.wd.subtitle")}</p>

      <div className="rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 sm:p-6">
        <form
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label htmlFor="wd-asset" className="text-sm text-[#a0aec0]">
              {t("dash.wd.asset")}
            </label>
            <select id="wd-asset" value={asset} onChange={(e) => setAsset(e.target.value)} className={`${baseField} appearance-none`}>
              <option value="USDT_BNB">USDT (BNB)</option>
              <option value="USDC_BNB">USDC (BNB)</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
          <div>
            <label htmlFor="wd-net" className="text-sm text-[#a0aec0]">
              {t("dash.wd.network")}
            </label>
            <input id="wd-net" readOnly value="BNB Smart Chain" className={`${baseField} cursor-not-allowed opacity-80`} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="wd-addr" className="text-sm text-[#a0aec0]">
              {t("dash.wd.address")}
            </label>
            <input id="wd-addr" value={address} onChange={(e) => setAddress(e.target.value)} className={baseField} placeholder="0x…" autoComplete="off" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="wd-amt" className="text-sm text-[#a0aec0]">
              {t("dash.wd.amount")}
            </label>
            <input id="wd-amt" value={amount} onChange={(e) => setAmount(e.target.value)} className={baseField} inputMode="decimal" placeholder="0.00" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-[10px] bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#1d4ed8]">
              {t("dash.wd.submit")}
            </button>
          </div>
        </form>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold text-white">{t("dash.wd.recent")}</h2>
      <div className="rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 sm:p-6">
        <div className="dashboard-sidebar-scroll overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-4 py-3 font-medium text-[#a0aec0]">Ref</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">Asset</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">Amount</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                  {t("dash.wd.empty")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardStandardPage>
  );
}
