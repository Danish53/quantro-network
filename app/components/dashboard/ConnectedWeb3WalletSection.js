"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect, useReadContracts, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { erc20Abi, formatUnits } from "viem";
import { useSiteTranslation } from "../SiteTranslationProvider";
import { BSC_TOKENS, TokenBadge, connectorIcon, shortenAddress } from "./web3WalletUi";
import { useDashboardWalletModal } from "./DashboardWalletConnectModal";

const cardShell =
  "rounded-xl border border-white/[0.08] bg-[#141235] p-5 shadow-sm ring-1 ring-white/[0.04] sm:p-6";

export default function ConnectedWeb3WalletSection() {
  const { t } = useSiteTranslation();
  const { openWalletModal } = useDashboardWalletModal();
  const { address, chainId, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const [copied, setCopied] = useState(false);
  const isWrongNetwork = isConnected && chainId !== bsc.id;

  const tokenContracts = isConnected && address
    ? BSC_TOKENS.map((token) => ({
        abi: erc20Abi,
        address: token.address,
        functionName: "balanceOf",
        args: [address],
      }))
    : [];

  const { data: balanceResults = [], isLoading: isLoadingBalances, isFetching: isFetchingBalances } = useReadContracts({
    contracts: tokenContracts,
    allowFailure: true,
    query: { enabled: tokenContracts.length > 0 && !isWrongNetwork },
  });

  const tokenCards = useMemo(
    () =>
      BSC_TOKENS.map((token, index) => {
        const result = balanceResults[index];
        const hasError = Boolean(result?.error);
        const isBusy = isLoadingBalances || isFetchingBalances;
        const raw = typeof result?.result === "bigint" ? formatUnits(result.result, token.decimals) : "0";
        const balanceText = Number(raw).toLocaleString("en-US", { maximumFractionDigits: 6 });
        let status = t("dash.wc.status_ready");
        if (isWrongNetwork) status = t("dash.wc.status_wrong_network");
        else if (hasError) status = t("dash.wc.status_error");
        else if (isBusy) status = t("dash.wc.status_loading");
        return { ...token, balanceText, status, hasError, isBusy, isWrongNetwork };
      }),
    [balanceResults, isFetchingBalances, isLoadingBalances, isWrongNetwork, t],
  );

  useEffect(() => {
    if (!copied) return;
    const tmr = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(tmr);
  }, [copied]);

  async function copyAddress() {
    if (!address || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    } catch {
      /* ignore */
    }
  }

  if (!isConnected) {
    return (
      <div
        className={`${cardShell} mb-8 bg-gradient-to-br from-[#1a1848]/85 via-[#141235] to-[#0f0d2e] ring-1 ring-indigo-400/20 shadow-lg shadow-indigo-950/25`}
      >
        <div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300/90">{t("dash.wal.web3_badge")}</p>
              <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{t("dash.wal.web3_title")}</h2>
              <p className="mt-2 text-sm text-slate-400">{t("dash.wal.web3_subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={openWalletModal}
              className="shrink-0 rounded-[12px] bg-gradient-to-r from-[#6366f1] to-[#5C5AFF] px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)] transition hover:brightness-110"
            >
              {t("dash.topbar_connect_wallet")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardShell} mb-8`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{t("dash.wal.web3_connected_title")}</h2>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">{t("dash.wc.connected")}</span>
            {isWrongNetwork ? (
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-200">{t("dash.wc.status_wrong_network")}</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-400">{t("dash.wal.web3_connected_hint")}</p>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10">{connectorIcon(connector?.name)}</span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t("dash.wc.connected_with")}</p>
                <p className="truncate font-medium text-white">{connector?.name || "—"}</p>
              </div>
            </div>
            <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t("dash.wc.address_label")}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="font-mono text-sm text-white">{address}</p>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="rounded-md border border-white/15 px-2 py-1 text-xs font-medium text-slate-300 hover:bg-white/5"
                >
                  {copied ? t("dash.wal.copied") : t("dash.wal.copy")}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">{shortenAddress(address)} · BSC</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {isWrongNetwork ? (
              <button
                type="button"
                onClick={() => switchChain({ chainId: bsc.id })}
                disabled={isSwitchingChain}
                className="rounded-[10px] bg-amber-500 px-4 py-2 text-sm font-semibold text-[#111827] transition hover:bg-amber-400 disabled:opacity-60"
              >
                {isSwitchingChain ? t("dash.wc.switching") : t("dash.wc.switch_network")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => disconnect()}
              className="rounded-[10px] border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
            >
              {t("dash.wc.disconnect")}
            </button>
            <button
              type="button"
              onClick={openWalletModal}
              className="rounded-[10px] border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/15"
            >
              {t("dash.wal.web3_manage")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white/[0.06] pt-6">
        <h3 className="text-base font-semibold text-white">{t("dash.wc.balance")}</h3>
        <p className="mt-1 text-xs text-slate-500">{t("dash.wal.web3_onchain_note")}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tokenCards.map((token) => (
            <div
              key={token.symbol}
              className="rounded-[12px] border border-white/[0.1] bg-gradient-to-br from-[#1a1838] to-[#141235] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                    <TokenBadge symbol={token.symbol} />
                  </span>
                  <p className="font-semibold text-white">{token.symbol}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    token.isWrongNetwork
                      ? "bg-amber-500/20 text-amber-300"
                      : token.hasError
                        ? "bg-rose-500/20 text-rose-300"
                        : token.isBusy
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {token.status}
                </span>
              </div>
              <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">{t("dash.wc.balance")}</p>
              <p className="mt-1 text-2xl font-bold text-white">{token.balanceText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
