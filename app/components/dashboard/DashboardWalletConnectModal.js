"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { useSiteTranslation } from "../SiteTranslationProvider";
import { connectorIcon, shortenAddress } from "./web3WalletUi";

const WalletModalContext = createContext(null);

export function useDashboardWalletModal() {
  const ctx = useContext(WalletModalContext);
  if (!ctx) {
    throw new Error("useDashboardWalletModal must be used within DashboardWalletConnectProvider");
  }
  return ctx;
}

/** Safe when Fund or other views render outside the provider (falls back to null). */
export function useOptionalDashboardWalletModal() {
  return useContext(WalletModalContext);
}

export function DashboardWalletConnectProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openWalletModal = useCallback(() => setOpen(true), []);
  const closeWalletModal = useCallback(() => setOpen(false), []);

  return (
    <WalletModalContext.Provider value={{ openWalletModal, closeWalletModal }}>
      {children}
      <WalletConnectModalDialog open={open} onClose={closeWalletModal} />
    </WalletModalContext.Provider>
  );
}

function WalletConnectModalDialog({ open, onClose }) {
  const { t } = useSiteTranslation();
  const { address, chainId, isConnected, connector } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting, pendingConnector, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const [actionError, setActionError] = useState("");
  const isWrongNetwork = isConnected && chainId !== bsc.id;

  useEffect(() => {
    if (!open) setActionError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleConnect(walletConnector) {
    try {
      setActionError("");
      await connectAsync({ connector: walletConnector });
      onClose();
    } catch (error) {
      setActionError(error?.message || t("dash.wc.connect_failed"));
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0F0D2E]/80 backdrop-blur-[3px]"
        aria-label={t("dash.wc.close")}
        onClick={onClose}
      />
      <div
        className="relative z-[1] w-full max-w-[20.5rem] rounded-xl border border-white/[0.08] bg-[#141235] p-3.5 shadow-xl shadow-black/40 ring-1 ring-white/[0.04] sm:max-w-[22rem] sm:p-4"
      >
        <div className="mb-3 flex items-start justify-between gap-2 border-b border-white/[0.06] pb-3">
          <div className="min-w-0 pr-1">
            <h3 id="wallet-modal-title" className="text-[15px] font-semibold leading-snug text-slate-100">
              {isConnected ? t("dash.wc.connected") : t("dash.wc.modal_title")}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border border-white/[0.1] text-slate-400 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-slate-200"
            aria-label={t("dash.wc.close")}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {isConnected ? (
          <div className="space-y-3">
            <p className="text-xs leading-relaxed text-slate-500">{t("dash.wal.web3_connected_hint")}</p>
            <div className="rounded-[10px] border border-white/[0.08] bg-[#0F0D2E]/40 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{t("dash.wc.connected_with")}</p>
              <div className="mt-2 flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.08] ring-1 ring-white/[0.06]">
                  {connectorIcon(connector?.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{connector?.name || "—"}</p>
                  <p className="font-mono text-xs text-slate-400">{shortenAddress(address)}</p>
                </div>
              </div>
              <p className="mt-2.5 text-[11px] text-slate-500">
                <span>{t("dash.wc.network_label")}:</span> {chainId === bsc.id ? "BSC" : chainId ?? "—"}
                {isWrongNetwork ? <span className="ml-1.5 text-amber-300/95">{t("dash.wc.chain_wrong")}</span> : null}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {isWrongNetwork ? (
                <button
                  type="button"
                  onClick={() => switchChain({ chainId: bsc.id })}
                  disabled={isSwitchingChain}
                  className="rounded-[9px] bg-amber-500 px-3 py-2 text-xs font-semibold text-[#111827] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSwitchingChain ? t("dash.wc.switching") : t("dash.wc.switch_network")}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  disconnect();
                  onClose();
                }}
                className="rounded-[9px] border border-white/[0.12] bg-transparent px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05]"
              >
                {t("dash.wc.disconnect")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-3 text-[11px] leading-relaxed text-slate-500">{t("dash.wc.modal_subtitle")}</p>
            <div className="space-y-2">
              {connectors.map((walletConnector) => (
                <button
                  key={walletConnector.uid}
                  type="button"
                  disabled={isConnecting}
                  onClick={() => handleConnect(walletConnector)}
                  className="flex w-full items-center justify-between gap-2 rounded-[10px] border border-white/[0.08] bg-[#0F0D2E]/35 p-2.5 text-left transition hover:border-[#6366f1]/35 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.08] ring-1 ring-white/[0.06]">
                      {connectorIcon(walletConnector.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-100">{walletConnector.name}</p>
                      <p className="text-[11px] text-slate-500">{t("dash.wc.connect")}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-[#a5b4fc]">
                    {isConnecting && pendingConnector?.uid === walletConnector.uid ? t("dash.wc.status_loading") : "→"}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {connectError || actionError ? (
          <p className="mt-2.5 border-t border-white/[0.06] pt-2.5 text-[11px] leading-relaxed text-rose-300/95">
            {actionError || connectError?.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
