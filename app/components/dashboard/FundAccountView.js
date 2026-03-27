"use client";

import DashboardNavigateDropdown from "./DashboardNavigateDropdown";
import DashboardToast from "./DashboardToast";
import { useEffect, useState } from "react";
import { useSiteTranslation } from "../SiteTranslationProvider";
import Link from "next/link";
import { useAccount, usePublicClient, useSwitchChain, useWriteContract } from "wagmi";
import { erc20Abi, parseUnits } from "viem";
import { TOKEN_META } from "@/app/lib/wallet/tokenAddresses";

const ASSETS = [
  { value: "USDT_BNB", label: "USDT (BNB)" },
  { value: "USDC_BNB", label: "USDC (BNB)" },
  
];

export default function FundAccountView() {
  const { t } = useSiteTranslation();
  const [asset, setAsset] = useState("USDT_BNB");
  const [amount, setAmount] = useState("");
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { address, chainId, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const baseField =
    "mt-2 w-full rounded-[10px] border border-[#2a3558] bg-[#14182b] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/25";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/wallets/transactions", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const tx = Array.isArray(data?.transactions) ? data.transactions : [];
        setRows(tx.filter((x) => x.type === "deposit"));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleOnchainDeposit(submitAsset, amountText) {
    const meta = TOKEN_META[submitAsset];
    const amountNum = Number(amountText);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      throw new Error(t("dash.fund.err_amount"));
    }
    if (!isConnected || !address) {
      throw new Error(t("dash.fund.err_wallet"));
    }

    const treasury = process.env.NEXT_PUBLIC_BSC_TREASURY_ADDRESS;

    if (!treasury) {
      throw new Error(t("dash.fund.err_treasury"));
    }

    if (chainId !== meta.chainId) {
      await switchChainAsync({ chainId: meta.chainId });
    }

    const units = parseUnits(amountText, meta.decimals);
    const txHash = await writeContractAsync({
      abi: erc20Abi,
      address: meta.address,
      functionName: "transfer",
      args: [treasury, units],
      chainId: meta.chainId,
    });

    if (!txHash) {
      throw new Error(t("dash.fund.err_submit"));
    }

    if (publicClient) {
      await publicClient.waitForTransactionReceipt({ hash: txHash });
    }

    const creditRes = await fetch("/api/wallets/deposit/onchain", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        asset: submitAsset,
        txHash,
        fromAddress: address,
      }),
    });
    const creditData = await creditRes.json().catch(() => ({}));
    if (!creditRes.ok) {
      throw new Error(creditData?.error || t("dash.fund.err_submit"));
    }

    return creditData?.transaction;
  }

  return (
    <div className="relative pb-24">
      <div className="pointer-events-none fixed right-4 top-20 z-[80] space-y-2 sm:right-6">
        <DashboardToast type="error" message={error} onClose={() => setError("")} />
        <DashboardToast type="success" message={notice} onClose={() => setNotice("")} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">{t("dash.fund.page_title")}</h1>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li className="text-slate-400">{t("dash.fund.breadcrumb_finance")}</li>
              <li className="px-1 text-slate-600" aria-hidden>
                {">"}
              </li>
              <li className="text-slate-300">{t("dash.fund.page_title")}</li>
            </ol>
          </nav>
          <DashboardNavigateDropdown />
        </div>
      </div>

      <section className="mt-8 rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6">
        <h2 className="text-lg font-semibold text-white">{t("dash.fund.deposit_title")}</h2>
        <p className="mt-2 text-xs text-slate-500">{t("dash.fund.onchain_note")}</p>
        {!isConnected ? (
          <p className="mt-2 text-sm text-amber-300">
            {t("dash.fund.err_wallet")} {" "}
            <Link href="/dashboard/wallet-connect" className="underline decoration-dotted hover:text-amber-200">
              {t("dash.fund.connect_wallet_cta")}
            </Link>
          </p>
        ) : null}

        <form
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setNotice("");
            try {
              setBusy(true);
              const tx = await handleOnchainDeposit(asset, amount.trim());
              if (tx) setRows((prev) => [tx, ...prev]);
              setAmount("");
              setNotice(t("dash.fund.ok_onchain"));
            } catch (err) {
              setError(err?.message || t("dash.fund.err_submit"));
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <label htmlFor="fund-currency" className="block text-sm text-[#a0aec0]">
              {t("dash.fund.asset_label")} <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <select
                id="fund-currency"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className={`${baseField} appearance-none pr-10`}
              >
                {ASSETS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="fund-network" className="text-sm text-[#a0aec0]">
              {t("dash.fund.network_label")}
            </label>
            <input
              id="fund-network"
              readOnly
              value="BNB Smart Chain (BEP-20)"
              className={`${baseField} cursor-not-allowed opacity-80`}
            />
          </div>

          <div>
            <label htmlFor="fund-amount" className="block text-sm text-[#a0aec0]">
              {t("dash.fund.amount_label_crypto")} <span className="text-red-500">*</span>
            </label>
            <input
              id="fund-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder={t("dash.fund.amount_placeholder_crypto")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={baseField}
            />
            <p className="mt-2 text-xs text-slate-500">{t("dash.fund.min_deposit_crypto")}</p>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy || !isConnected}
              className="rounded-[10px] bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? t("dash.fund.working_onchain") : t("dash.fund.submit_onchain")}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6">
        <h2 className="text-lg font-semibold text-white">{t("dash.fund.recent_title")}</h2>
        <div className="mt-4 overflow-x-auto rounded-[8px] border border-white/[0.06]">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#14182b]/80">
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_reference")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_asset")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_amount")}</th>
                <th className="px-4 py-3 font-medium text-[#a0aec0]">{t("dash.fund.col_status")}</th>
              </tr>
            </thead>
            <tbody>
              {!rows.length ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                    {t("dash.fund.empty")}
                  </td>
                </tr>
              ) : (
                rows.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-4 py-3 text-slate-300">{tx.txHash ? `${tx.txHash.slice(0, 10)}...` : tx.reference || "-"}</td>
                    <td className="px-4 py-3 text-slate-300">{tx.asset}</td>
                    <td className="px-4 py-3 text-emerald-300">+{Number(tx.amount || 0).toFixed(4)}</td>
                    <td className="px-4 py-3 text-slate-300">{tx.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg shadow-blue-600/35 transition hover:bg-[#1d4ed8]"
        aria-label={t("dash.chat_support")}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m9 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M9.75 21h3.75a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0013.5 4.5h-6a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 007.5 21z"
          />
        </svg>
      </button>
    </div>
  );
}
