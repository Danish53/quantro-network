"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { bsc, mainnet } from "wagmi/chains";
import { useSiteTranslation } from "../SiteTranslationProvider";
import { ConnectorAvatar, shortenAddress } from "./web3WalletUi";

const DASHBOARD_CHAIN_IDS = [mainnet.id, bsc.id];

function chainLabel(chainId) {
  if (chainId === mainnet.id) return "Ethereum";
  if (chainId === bsc.id) return "BNB Chain";
  if (chainId == null) return "—";
  return String(chainId);
}

function isWalletConnectConnector(c) {
  const id = String(c?.id ?? "");
  const type = String(c?.type ?? "");
  const name = String(c?.name ?? "");
  return (
    type === "walletConnect" ||
    id === "walletConnect" ||
    id === "io.metamask.walletconnect" ||
    /wallet\s*connect/i.test(name)
  );
}

function isInjectedConnector(c) {
  return String(c?.type ?? "") === "injected";
}

function getConnectorBadge(c) {
  if (isWalletConnectConnector(c)) return "qr";
  if (isInjectedConnector(c)) return "installed";
  return null;
}

function sortConnectors(list) {
  return [...list].sort((a, b) => {
    const rank = (c) => {
      if (isWalletConnectConnector(c)) return 0;
      if (isInjectedConnector(c)) return 1;
      return 2;
    };
    const r = rank(a) - rank(b);
    if (r !== 0) return r;
    return String(a.name ?? "").localeCompare(String(b.name ?? ""));
  });
}

function ChevronRight({ className = "h-4 w-4 shrink-0 text-indigo-300/50" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function WalletRowIcon({ walletConnector }) {
  return <ConnectorAvatar connector={walletConnector} sizeClass="h-10 w-10" roundedClass="rounded-xl" />;
}

const WalletModalContext = createContext(null);

export function useDashboardWalletModal() {
  const ctx = useContext(WalletModalContext);
  if (!ctx) {
    throw new Error("useDashboardWalletModal must be used within DashboardWalletConnectProvider");
  }
  return ctx;
}

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
  /** `null` = not scanned yet; each installed extension gets its own wagmi `injected` target + row. */
  const [injectedReadyIds, setInjectedReadyIds] = useState(null);
  const isWrongNetwork = isConnected && chainId != null && !DASHBOARD_CHAIN_IDS.includes(chainId);

  const hasWcProjectId = useMemo(
    () => Boolean(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim?.()),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let cancelled = false;
    (async () => {
      const ready = new Set();
      for (const c of connectors) {
        if (!isInjectedConnector(c)) continue;
        try {
          const p = await c.getProvider();
          if (p) ready.add(c.id);
        } catch {
          /* ignore */
        }
      }
      if (!cancelled) setInjectedReadyIds(ready);
    })();
    return () => {
      cancelled = true;
    };
  }, [connectors, open]);

  const sortedConnectors = useMemo(() => sortConnectors(connectors), [connectors]);

  /** WalletConnect (QR) + one row per detected injected target (real name/icon from connector). */
  const visibleConnectors = useMemo(() => {
    const seenInjectedId = new Set();
    return sortedConnectors.filter((c) => {
      if (isWalletConnectConnector(c)) return hasWcProjectId;
      if (isInjectedConnector(c)) {
        if (injectedReadyIds === null) return false;
        if (!injectedReadyIds.has(c.id)) return false;
        if (seenInjectedId.has(c.id)) return false;
        seenInjectedId.add(c.id);
        return true;
      }
      return false;
    });
  }, [sortedConnectors, hasWcProjectId, injectedReadyIds]);

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

  const shellClass =
    "relative z-[1] mx-auto flex w-[min(100%,22rem)] flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-[#141235] shadow-2xl shadow-indigo-950/30 ring-1 ring-white/[0.06] sm:w-[22.5rem]";

  const maxHClass = isConnected ? "max-h-[min(92dvh,560px)]" : "max-h-[min(90dvh,640px)]";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto overflow-x-hidden overscroll-contain py-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <button
        type="button"
        className="fixed inset-0 bg-[#0F0D2E]/88 backdrop-blur-[2px]"
        aria-label={t("dash.wc.close")}
        onClick={onClose}
      />
      <div className={`${shellClass} ${maxHClass}`}>
        {/* Header — Reown-style */}
        <div className="relative flex shrink-0 items-center justify-center border-b border-white/[0.06] px-3 pb-3 pt-4">
          <a
            href="https://docs.reown.com/appkit/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition hover:bg-white/[0.06] hover:text-slate-300"
            aria-label={t("dash.wc.help_aria")}
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </a>
          <h3 id="wallet-modal-title" className="text-[15px] font-semibold tracking-tight text-white">
            {isConnected ? t("dash.wc.connected") : t("dash.wc.appkit_title")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-white/[0.08] hover:text-slate-100"
            aria-label={t("dash.wc.close")}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="wallet-modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 pt-2">
          {isConnected ? (
            <div className="space-y-3 pt-1">
              <p className="text-xs leading-relaxed text-slate-500">{t("dash.wal.web3_connected_hint")}</p>
              <div className="rounded-xl border border-white/[0.08] bg-[#0F0D2E]/60 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{t("dash.wc.connected_with")}</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white/[0.08] ring-1 ring-white/[0.06]">
                    <ConnectorAvatar connector={connector} sizeClass="h-9 w-9" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-100">{connector?.name || "—"}</p>
                    <p className="font-mono text-xs text-slate-400">{shortenAddress(address)}</p>
                  </div>
                </div>
                <p className="mt-2.5 text-[11px] text-slate-500">
                  <span>{t("dash.wc.network_label")}:</span> {chainLabel(chainId)}
                  {isWrongNetwork ? <span className="ml-1.5 text-amber-300/95">{t("dash.wc.chain_wrong")}</span> : null}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {isWrongNetwork ? (
                  <button
                    type="button"
                    onClick={() => switchChain({ chainId: mainnet.id })}
                    disabled={isSwitchingChain}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-[#111827] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="rounded-lg border border-white/[0.12] bg-transparent px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05]"
                >
                  {t("dash.wc.disconnect")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {visibleConnectors.length === 0 ? (
                  <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-3 text-center text-[12px] leading-relaxed text-amber-100/90">
                    {t("dash.wc.empty_connect_options")}
                  </p>
                ) : null}
                {!hasWcProjectId && visibleConnectors.length > 0 ? (
                  <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100/85">
                    {t("dash.wc.project_hint")}
                  </p>
                ) : null}
                {visibleConnectors.map((walletConnector) => {
                  const badge = getConnectorBadge(walletConnector);
                  const displayName = walletConnector.name;
                  return (
                    <button
                      key={walletConnector.uid}
                      type="button"
                      disabled={isConnecting}
                      onClick={() => handleConnect(walletConnector)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0F0D2E]/50 px-3 py-2.5 text-left shadow-sm shadow-black/20 transition hover:border-[#6366f1]/35 hover:bg-[#141235] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#141235] ring-1 ring-white/[0.08]">
                        <WalletRowIcon walletConnector={walletConnector} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-slate-100">{displayName}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {badge === "qr" ? (
                          <span className="rounded-md border border-[#6366f1]/30 bg-[#6366f1]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#a5b4fc]">
                            {t("dash.wc.badge_qr")}
                          </span>
                        ) : null}
                        {badge === "installed" ? (
                          <span className="rounded-md border border-emerald-500/25 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300/95">
                            {t("dash.wc.badge_installed")}
                          </span>
                        ) : null}
                        {isConnecting && pendingConnector?.uid === walletConnector.uid ? (
                          <span className="text-xs font-medium text-[#818cf8]">{t("dash.wc.status_loading")}</span>
                        ) : (
                          <ChevronRight />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {connectError || actionError ? (
            <p className="mt-3 border-t border-white/[0.06] pt-3 text-[11px] leading-relaxed text-rose-300/95">
              {actionError || connectError?.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
