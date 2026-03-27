"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";
import { useAccount, useConnect, useDisconnect, useReadContracts, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { erc20Abi, formatUnits } from "viem";

const cardShell =
  "rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6";

const TOKENS = [
  { symbol: "USDT", decimals: 18, address: "0x55d398326f99059fF775485246999027B3197955" },
  { symbol: "USDC", decimals: 18, address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d" },
];

function shortenAddress(address) {
  if (!address) return "-";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function connectorIcon(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes("meta")) return <MetaMaskIcon />;
  if (lower.includes("walletconnect")) return <WalletConnectIcon />;
  if (lower.includes("coinbase")) return <CoinbaseIcon />;
  return <GenericWalletIcon />;
}

export default function WalletConnectView() {
  const { t } = useSiteTranslation();
  const { address, chainId, isConnected, connector } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting, pendingConnector, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const isWrongNetwork = isConnected && chainId !== bsc.id;

  useEffect(() => {
    if (isConnected) setIsModalOpen(false);
  }, [isConnected]);

  async function handleConnect(walletConnector) {
    try {
      setActionError("");
      await connectAsync({ connector: walletConnector });
    } catch (error) {
      setActionError(error?.message || t("dash.wc.connect_failed"));
    }
  }

  const tokenContracts = isConnected && address
    ? TOKENS.map((token) => ({
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
      TOKENS.map((token, index) => {
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

  return (
    <DashboardStandardPage titleKey="dash.wc.title" breadcrumbLastKey="dash.wc.title">
      <p className="mb-6 max-w-3xl text-sm text-slate-400">{t("dash.wc.subtitle")}</p>

      <div className={`${cardShell} mb-6`}>
        {!isConnected ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              {t("dash.wc.not_connected")}
            </div>
            <h3 className="text-xl font-semibold text-white">{t("dash.wc.modal_title")}</h3>
            <p className="mt-2 max-w-lg text-sm text-slate-400">{t("dash.wc.modal_subtitle")}</p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-6 rounded-[12px] bg-[#2563eb] px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] transition hover:bg-[#1d4ed8]"
            >
              {t("dash.wc.open_modal")}
            </button>
            <p className="mt-3 text-xs text-slate-500">{t("dash.wc.project_hint")}</p>
            {connectError || actionError ? <p className="text-sm text-rose-300">{actionError || connectError?.message}</p> : null}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t("dash.wc.connected_with")}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-lg">
                  {connectorIcon(connector?.name)}
                </span>
                <p className="font-medium text-white">{connector?.name || "-"}</p>
              </div>
            </div>
            <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t("dash.wc.address_label")}</p>
              <p className="mt-2 text-base font-medium text-white">{shortenAddress(address)}</p>
              <p className="mt-1 text-xs text-slate-500">{t("dash.wc.address_hidden")}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-emerald-300">{t("dash.wc.connected")}</p>
              <p className="text-sm text-slate-400">
                <span className="text-slate-500">{t("dash.wc.network_label")}:</span> {chainId || "-"}
              </p>
            </div>
            <div className="flex justify-start md:justify-end">
              <div className="flex flex-wrap gap-2">
                {isWrongNetwork ? (
                  <button
                    type="button"
                    onClick={() => switchChain({ chainId: bsc.id })}
                    disabled={isSwitchingChain}
                    className="rounded-[10px] bg-amber-500 px-4 py-2 text-sm font-semibold text-[#111827] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSwitchingChain ? t("dash.wc.switching") : t("dash.wc.switch_network")}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="rounded-[10px] border border-white/15 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
                >
                  {t("dash.wc.disconnect")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isWrongNetwork ? <p className="mb-6 text-sm text-amber-300">{t("dash.wc.chain_wrong")}</p> : null}

      <div className={cardShell}>
        <h2 className="text-lg font-semibold text-white">{t("dash.wc.balance")}</h2>
        {!isConnected ? <p className="mt-3 text-sm text-slate-500">{t("dash.wc.empty")}</p> : null}
        {isConnected ? (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {tokenCards.map((token) => (
              <div
                key={token.symbol}
                className="rounded-[12px] border border-white/[0.08] bg-gradient-to-br from-[#1f2548] to-[#151b34] p-4"
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
        ) : null}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11172b] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">{t("dash.wc.modal_title")}</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/5"
              >
                {t("dash.wc.close")}
              </button>
            </div>
            <p className="mb-5 text-sm text-slate-400">{t("dash.wc.available_wallets")}</p>
            <div className="space-y-2.5">
              {connectors.map((walletConnector) => (
                <button
                  key={walletConnector.uid}
                  type="button"
                  disabled={isConnecting}
                  onClick={() => handleConnect(walletConnector)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-left transition hover:border-blue-400/40 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                      {connectorIcon(walletConnector.name)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{walletConnector.name}</p>
                      <p className="text-xs text-slate-400">{t("dash.wc.connect")}</p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-300">
                    {isConnecting && pendingConnector?.uid === walletConnector.uid ? t("dash.wc.status_loading") : "->"}
                  </span>
                </button>
              ))}
            </div>
            {connectError || actionError ? (
              <p className="mt-3 text-xs text-rose-300">{actionError || connectError?.message}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </DashboardStandardPage>
  );
}

function GenericWalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="4" fill="#334155" />
      <rect x="14" y="10" width="6" height="4" rx="2" fill="#93C5FD" />
    </svg>
  );
}

function MetaMaskIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 3l5.3 3.9L8.4 5 4 3z" fill="#E17726" />
      <path d="M20 3l-5.2 4L15.5 5 20 3z" fill="#E27625" />
      <path d="M6 14.4l1.3 2.2-2.8.8.8-3z" fill="#E27625" />
      <path d="M18 14.4l-.7 3-2.8-.8 1.3-2.2z" fill="#E27625" />
      <path d="M16.9 9.2L16 13l3 .1-.1-2L16.9 9.2z" fill="#E27625" />
      <path d="M5.1 11.1l-.1 2L8 13l-.9-3.8-2 1.9z" fill="#E27625" />
      <path d="M8 13l.7 3.4h1.5v-2.3L8 13z" fill="#E27625" />
      <path d="M14 13l-2.2 1.1v2.3h1.5L14 13z" fill="#E27625" />
      <path d="M13.3 18.4H10.7l.3-2h2l.3 2z" fill="#F5841F" />
      <path d="M11.9 8.8l-.2.7-4.5-.2 1.2-1.9 3.5 1.4z" fill="#E27625" />
      <path d="M12.1 8.8l3.5-1.4 1.2 1.9-4.5.2-.2-.7z" fill="#E27625" />
      <path d="M7.2 9.3l1.9 4.6-.6-.9-3-.1.5-3.6 1.2 0z" fill="#F5841F" />
      <path d="M16.8 9.3l1.2 0 .5 3.6-3 .1-.6.9 1.9-4.6z" fill="#F5841F" />
      <path d="M8.9 13.9l1.2 2.4-2.7-.8 1.5-1.6z" fill="#C0AD9E" />
      <path d="M15.1 13.9l1.5 1.6-2.7.8 1.2-2.4z" fill="#C0AD9E" />
      <path d="M10.1 12.1l-.1 2.2-1-.4 1.1-1.8z" fill="#161616" />
      <path d="M13.9 12.1l1.1 1.8-1 .4-.1-2.2z" fill="#161616" />
      <path d="M10.1 16.3l.6-.1h2.6l.6.1-.3 2h-3.2l-.3-2z" fill="#161616" />
    </svg>
  );
}

function WalletConnectIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect width="24" height="24" rx="12" fill="#3B99FC" />
      <path d="M7.5 9.8c2.5-2.4 6.5-2.4 9 0l.3.3a.4.4 0 010 .6l-1 1a.4.4 0 01-.6 0l-.6-.6a3.8 3.8 0 00-5.2 0l-.7.6a.4.4 0 01-.6 0l-1-1a.4.4 0 010-.6l.4-.3z" fill="#fff" />
      <path d="M18.4 11.8l.9.9a.4.4 0 010 .6l-4.2 4.2a.4.4 0 01-.6 0l-3-3a.2.2 0 00-.3 0l-3 3a.4.4 0 01-.6 0L3.4 13.3a.4.4 0 010-.6l.9-.9a.4.4 0 01.6 0l3 3a.2.2 0 00.3 0l3-3a.4.4 0 01.6 0l3 3a.2.2 0 00.3 0l3-3a.4.4 0 01.6 0z" fill="#fff" />
    </svg>
  );
}

function CoinbaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect width="24" height="24" rx="12" fill="#0052FF" />
      <circle cx="12" cy="12" r="5" fill="#fff" />
      <circle cx="12" cy="12" r="2.3" fill="#0052FF" />
    </svg>
  );
}

function TokenBadge({ symbol }) {
  if (symbol === "USDT") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="12" fill="#26A17B" />
        <path d="M6 7.5h12v2H13v1.1c2.7.1 4.8.8 4.8 1.6s-2.1 1.5-4.8 1.6v3.7h-2v-3.7c-2.7-.1-4.8-.8-4.8-1.6s2.1-1.5 4.8-1.6V9.5H6v-2zm5 4.1c-2.2.1-3.7.6-3.7 1s1.5.9 3.7 1V11.6zm2 .1v1.9c2.2-.1 3.7-.6 3.7-1s-1.5-.9-3.7-.9z" fill="#fff" />
      </svg>
    );
  }
  if (symbol === "USDC") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="12" fill="#2775CA" />
        <circle cx="12" cy="12" r="6.8" fill="none" stroke="#fff" strokeWidth="1.6" />
        <path d="M12.9 8.5h-1.8a2 2 0 000 4h1.8a2 2 0 010 4h-1.8M12 7.2v1.3m0 7v1.3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return <span className="text-[10px] font-bold text-white">{symbol}</span>;
}
