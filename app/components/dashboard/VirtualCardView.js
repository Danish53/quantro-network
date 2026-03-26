"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

const cardShell = "rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 sm:p-6";

export default function VirtualCardView() {
  const { t } = useSiteTranslation();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState(null);
  const [kycStatus, setKycStatus] = useState("not_submitted");
  const [transactions, setTransactions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isFrozen = card?.status === "frozen";
  const isPendingReview = card?.status === "pending_review" || card?.status === "pending";
  const hasCard = Boolean(card);

  const moneyFmt = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }),
    [],
  );

  const loadCard = useCallback(async () => {
    const [cardRes, kycRes] = await Promise.all([
      fetch("/api/card/me", { credentials: "include" }),
      fetch("/api/kyc/me", { credentials: "include" }),
    ]);
    const cardData = await cardRes.json().catch(() => ({}));
    const kycData = await kycRes.json().catch(() => ({}));
    if (!cardRes.ok) {
      throw new Error(cardData?.error || t("dash.vcard.err_load"));
    }
    if (kycRes.ok && kycData?.kyc?.status) {
      setKycStatus(kycData.kyc.status);
    }
    setCard(cardData.card ?? null);
  }, [t]);

  const loadTransactions = useCallback(async () => {
    const res = await fetch("/api/card/transactions", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || t("dash.vcard.err_load_tx"));
    }
    setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        await loadCard();
        if (!cancelled) {
          await loadTransactions();
        }
      } catch (e) {
        if (!cancelled) setError(e.message || t("dash.vcard.err_load"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadCard, loadTransactions, t]);

  useEffect(() => {
    if (!isPendingReview) return;
    const id = setInterval(async () => {
      try {
        await loadCard();
        await loadTransactions();
      } catch {
        // Ignore transient polling failures.
      }
    }, 6000);
    return () => clearInterval(id);
  }, [isPendingReview, loadCard, loadTransactions]);

  async function handleApplyCard() {
    try {
      setBusy(true);
      setError("");
      setNotice("");
      const res = await fetch("/api/card/apply", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || t("dash.vcard.err_apply"));
      }
      setCard(data.card);
      await loadTransactions();
      setNotice(t("dash.vcard.apply_ok"));
    } catch (e) {
      setError(e.message || t("dash.vcard.err_apply"));
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleFreeze() {
    try {
      setBusy(true);
      setError("");
      setNotice("");
      const nextEndpoint = isFrozen ? "/api/card/unfreeze" : "/api/card/freeze";
      const res = await fetch(nextEndpoint, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || t("dash.vcard.err_status"));
      }
      setCard((prev) => (prev ? { ...prev, status: data.status } : prev));
      setNotice(isFrozen ? t("dash.vcard.unfreeze_ok") : t("dash.vcard.freeze_ok"));
    } catch (e) {
      setError(e.message || t("dash.vcard.err_status"));
    } finally {
      setBusy(false);
    }
  }

  function statusLabel(status) {
    if (status === "approved") return t("dash.vcard.tx_approved");
    if (status === "pending") return t("dash.vcard.tx_pending");
    if (status === "declined") return t("dash.vcard.tx_declined");
    return status;
  }

  return (
    <DashboardStandardPage titleKey="dash.vcard.title" breadcrumbLastKey="dash.vcard.title">
      <p className="mb-6 max-w-2xl text-sm text-slate-400">{t("dash.vcard.subtitle")}</p>

      <div className="mb-4 space-y-2">
        <p className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          {t("dash.vcard.mock_badge")}
        </p>
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
        )}
        {notice && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{notice}</p>
        )}
      </div>

      {loading ? (
        <div className={`${cardShell} text-sm text-slate-400`}>{t("dash.vcard.loading")}</div>
      ) : null}

      {!loading && !hasCard ? (
        <div className={`${cardShell} text-center`}>
          <h2 className="text-lg font-semibold text-white">{t("dash.vcard.apply_title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{t("dash.vcard.apply_body")}</p>
          {kycStatus !== "approved" && (
            <p className="mx-auto mt-3 max-w-md text-sm text-amber-200">{t("dash.vcard.kyc_required")}</p>
          )}
          <button
            type="button"
            onClick={handleApplyCard}
            disabled={busy || loading || kycStatus !== "approved"}
            className="mt-6 rounded-[10px] bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? t("dash.vcard.applying") : t("dash.vcard.apply_btn")}
          </button>
          {kycStatus !== "approved" && (
            <div className="mt-4">
              <Link href="/dashboard/kyc" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
                {t("dash.vcard.goto_kyc")}
              </Link>
            </div>
          )}
        </div>
      ) : !loading && hasCard ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e1b4b 100%)",
              }}
            >
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                {card.networkLabel || t("dash.vcard.network")}
              </p>
              <p className="mt-8 font-mono text-xl tracking-widest text-white">{card.maskedPan || t("dash.vcard.masked")}</p>
              <div className="mt-6 flex justify-between text-sm text-slate-300">
                <span>
                  {t("dash.vcard.expiry")} {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}
                </span>
                <span>CVV •••</span>
              </div>
            </div>

            <div className={`${cardShell} flex flex-col justify-between`}>
              <div>
                <p className="text-sm text-[#a0aec0]">{t("dash.vcard.balance_fiat")}</p>
                <p className="mt-1 text-3xl font-bold text-[#38bdf8]">{moneyFmt.format(card.balanceUsd || 0)}</p>
                <p className="mt-2 text-xs text-slate-500">{t("dash.vcard.balance_label")}</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isFrozen ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {isFrozen
                    ? t("dash.vcard.status_frozen")
                    : isPendingReview
                      ? t("dash.vcard.status_pending_review")
                      : t("dash.vcard.status_active")}
                </span>
                <button
                  type="button"
                  onClick={handleToggleFreeze}
                  disabled={busy || isPendingReview}
                  className={`rounded-[10px] px-4 py-2 text-sm font-medium transition ${
                    isFrozen
                      ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      : "border border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {busy
                    ? t("dash.vcard.saving")
                    : isPendingReview
                      ? t("dash.vcard.pending_action")
                      : isFrozen
                        ? t("dash.vcard.unfreeze")
                        : t("dash.vcard.freeze")}
                </button>
              </div>
              {isPendingReview && <p className="mt-3 text-xs text-amber-200">{t("dash.vcard.pending_hint")}</p>}
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
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-12 text-center text-slate-500">
                        {t("dash.vcard.empty_activity")}
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/[0.04] last:border-0">
                        <td className="px-3 py-3 text-slate-300">{tx.merchant}</td>
                        <td className={`px-3 py-3 ${tx.amountUsd < 0 ? "text-rose-300" : "text-emerald-300"}`}>
                          {moneyFmt.format(tx.amountUsd)}
                        </td>
                        <td className="px-3 py-3 text-slate-300">{statusLabel(tx.status)}</td>
                        <td className="px-3 py-3 text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </DashboardStandardPage>
  );
}
