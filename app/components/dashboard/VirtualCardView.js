"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";
import DashboardToast from "./DashboardToast";
import PremiumPlasticCard, { demoCvvFromSeed } from "./PremiumPlasticCard";
import FundDepositSection from "./FundDepositSection";

/** Page chrome only — does not affect PremiumPlasticCard. */
const cardShell =
  "rounded-lg border border-white/[0.06] bg-[#0E0D2E] p-5 sm:p-6";
const btnPrimary =
  "inline-flex items-center justify-center rounded-md bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60";
const btnSecondary =
  "inline-flex items-center justify-center rounded-md border border-white/[0.12] bg-transparent px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/[0.18] hover:bg-white/[0.04]";

/**
 * @param {{ variant?: "generate" | "fund" | "terminate" }} props
 */
export default function VirtualCardView({ variant }) {
  const { t } = useSiteTranslation();
  const pageTitleKey =
    variant === "generate"
      ? "dash.vcard.section_generate_title"
      : variant === "fund"
        ? "dash.vcard.section_fund_title"
        : variant === "terminate"
          ? "dash.vcard.section_terminate_title"
          : "dash.vcard.title";
  const pageSubtitle =
    variant === "generate"
      ? t("dash.vcard.section_generate_subtitle")
      : variant === "fund"
        ? t("dash.vcard.section_fund_subtitle")
        : variant === "terminate"
          ? t("dash.vcard.section_terminate_subtitle")
          : t("dash.vcard.subtitle");
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

  const showActivity = variant === "fund" && hasCard;
  const showFreeze = variant === "terminate" && hasCard;
  const showFundFlow = variant === "fund" && hasCard;

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
        if (!cancelled && variant === "fund") {
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
  }, [loadCard, loadTransactions, t, variant]);

  useEffect(() => {
    if (!isPendingReview) return;
    const id = setInterval(async () => {
      try {
        await loadCard();
        if (variant === "fund") await loadTransactions();
      } catch {
        // Ignore transient polling failures.
      }
    }, 6000);
    return () => clearInterval(id);
  }, [isPendingReview, loadCard, loadTransactions, variant]);

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
      if (variant === "fund") await loadTransactions();
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

  const subtitleDisplay =
    !loading && hasCard && variant === "generate" ? t("dash.vcard.generate_has_card_body") : pageSubtitle;

  return (
    <DashboardStandardPage titleKey={pageTitleKey} breadcrumbLastKey={pageTitleKey}>
      <div className="border-b border-white/[0.05] pb-6">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-400">{subtitleDisplay}</p>
      </div>

      <div className="pointer-events-none fixed right-4 top-20 z-[80] space-y-2 sm:right-6">
        <DashboardToast type="error" message={error} onClose={() => setError("")} />
        <DashboardToast type="success" message={notice} onClose={() => setNotice("")} />
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div
            className="mx-auto w-full max-w-[415px] animate-pulse overflow-hidden rounded-lg border border-white/[0.06] bg-[#0E0D2E]"
            style={{ aspectRatio: "1.586 / 1" }}
          >
            <div className="h-full p-6">
              <div className="h-8 w-8 rounded-md bg-white/[0.06]" />
              <div className="mt-4 h-2.5 w-20 rounded bg-white/[0.06]" />
              <div className="mt-12 h-7 w-full max-w-[240px] rounded bg-white/[0.06]" />
              <div className="mt-10 h-2.5 w-28 rounded bg-white/[0.06]" />
            </div>
          </div>
          <div className={`${cardShell} animate-pulse`}>
            <div className="h-2.5 w-20 rounded bg-white/[0.06]" />
            <div className="mt-5 h-9 w-36 rounded bg-white/[0.06]" />
            <div className="mt-8 h-9 w-28 rounded bg-white/[0.06]" />
          </div>
        </div>
      ) : null}

      {!loading && !hasCard && (variant === "fund" || variant === "terminate") ? (
        <div className={`${cardShell} mt-8 max-w-lg`}>
          <p className="text-sm leading-relaxed text-slate-400">{t("dash.vcard.need_card_first")}</p>
          <Link href="/dashboard/virtual-card/generate" className={`${btnPrimary} mt-5 w-full sm:w-auto`}>
            {t("dash.vcard.section_generate_title")}
          </Link>
        </div>
      ) : null}

      {!loading && !hasCard && variant !== "fund" && variant !== "terminate" ? (
        <div className={`${cardShell} mt-8 max-w-xl`}>
          <h2 className="text-base font-semibold tracking-tight text-slate-100">{t("dash.vcard.apply_title")}</h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-500">{t("dash.vcard.apply_body")}</p>
          {kycStatus !== "approved" ? (
            <div className="mt-4 rounded-md border border-amber-500/25 bg-amber-950/25 px-3 py-2.5 text-sm text-amber-100/90">
              {t("dash.vcard.kyc_required")}
            </div>
          ) : null}
          <button
            type="button"
            onClick={handleApplyCard}
            disabled={busy || loading || kycStatus !== "approved"}
            className={`${btnPrimary} mt-6`}
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {t("dash.vcard.applying")}
              </span>
            ) : (
              t("dash.vcard.apply_btn")
            )}
          </button>
          {kycStatus !== "approved" ? (
            <div className="mt-4">
              <Link href="/dashboard/kyc" className="text-sm font-medium text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline">
                {t("dash.vcard.goto_kyc")}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      {!loading && hasCard ? (
        <>
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col items-stretch">
              <div className="relative mx-auto w-full max-w-[415px]">
                <PremiumPlasticCard
                  cardNumberDisplay={card.maskedPan || t("dash.vcard.masked")}
                  panCopyValue={card.panCopyable ?? card.panFull ?? undefined}
                  expiresValue={`${String(card.expiryMonth).padStart(2, "0")}-${String(card.expiryYear).slice(-2)}`}
                  cardholderName={t("dash.vcard.cardholder_placeholder")}
                  cvvDisplay={demoCvvFromSeed(card.id)}
                  flipHint={t("dash.vcard.flip_hint")}
                />
              </div>
            </div>

            <div className={`${cardShell} flex flex-col`}>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">{t("dash.vcard.balance_fiat")}</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-50">
                  {moneyFmt.format(card.balanceUsd || 0)}
                </p>
                <p className="mt-1.5 text-xs text-slate-500">{t("dash.vcard.balance_label")}</p>
              </div>
              <div className="my-5 h-px w-full bg-white/[0.06]" aria-hidden />
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                    isFrozen
                      ? "border-amber-500/25 bg-amber-950/30 text-amber-200"
                      : isPendingReview
                        ? "border-slate-500/25 bg-slate-900/50 text-slate-300"
                        : "border-emerald-500/20 bg-emerald-950/25 text-emerald-200"
                  }`}
                >
                  {isFrozen
                    ? t("dash.vcard.status_frozen")
                    : isPendingReview
                      ? t("dash.vcard.status_pending_review")
                      : t("dash.vcard.status_active")}
                </span>
                {showFreeze ? (
                  <button
                    type="button"
                    onClick={handleToggleFreeze}
                    disabled={busy || isPendingReview}
                    className={`rounded-md px-3.5 py-2 text-sm font-medium transition ${
                      isFrozen
                        ? "border border-emerald-500/30 bg-emerald-950/35 text-emerald-200 hover:bg-emerald-950/50"
                        : "border border-white/[0.12] bg-[#0F0D2E] text-slate-200 hover:border-white/[0.16] hover:bg-[#14122f]"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {busy ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t("dash.vcard.saving")}
                      </span>
                    ) : isPendingReview ? (
                      t("dash.vcard.pending_action")
                    ) : isFrozen ? (
                      t("dash.vcard.unfreeze")
                    ) : (
                      t("dash.vcard.freeze")
                    )}
                  </button>
                ) : null}
              </div>
              {isPendingReview ? (
                <p className="mt-3 text-xs text-amber-200">{t("dash.vcard.pending_hint")}</p>
              ) : null}
            </div>
          </div>

          {variant === "generate" ? (
            <div className={`${cardShell} mt-6`}>
              <h2 className="text-lg font-semibold text-slate-100">{t("dash.vcard.generate_has_card_title")}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{t("dash.vcard.generate_has_card_body")}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/dashboard/virtual-card/fund"
                  className="inline-flex items-center justify-center rounded-[10px] bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-[#1d4ed8]"
                >
                  {t("dash.vcard.goto_fund")}
                </Link>
                <Link
                  href="/dashboard/virtual-card/terminate"
                  className="inline-flex items-center justify-center rounded-[10px] border border-white/[0.14] bg-[#0F0D2E]/80 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/[0.22] hover:bg-[#0F0D2E]"
                >
                  {t("dash.vcard.goto_terminate")}
                </Link>
              </div>
            </div>
          ) : null}

          {showFundFlow ? (
            <div className="mt-8">
              <div className="mb-4 flex flex-col gap-2 border-b border-white/[0.06] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {t("dash.vcard.fund_embed_kicker")}
                </p>
                <Link
                  href="/dashboard/fund"
                  className="shrink-0 text-sm font-medium text-slate-400 underline-offset-4 transition hover:text-slate-200 hover:underline"
                >
                  {t("dash.vcard.section_fund_deposit_link")}
                </Link>
              </div>
              <FundDepositSection toastPlacement="inline" />
            </div>
          ) : null}

          {variant === "terminate" ? (
            <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.08] border-l-[3px] border-l-amber-500/60 bg-[#0F0D2E]/90 ring-1 ring-white/[0.04]">
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:gap-6 sm:p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/[0.08]">
                  <svg className="h-5 w-5 text-amber-200/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{t("dash.vcard.terminate_kicker")}</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-100">{t("dash.vcard.terminate_panel_title")}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{t("dash.vcard.terminate_panel_body")}</p>
                  <ul className="mt-5 space-y-3 text-sm text-slate-400">
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/80" aria-hidden />
                      <span>{t("dash.vcard.terminate_bullet_freeze")}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" aria-hidden />
                      <span>{t("dash.vcard.terminate_bullet_support")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          {showActivity ? (
            <div className={`${cardShell} mt-6`}>
              <h2 className="text-lg font-semibold text-slate-100">{t("dash.vcard.activity")}</h2>
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
                        <tr key={tx.id} className="border-b border-white/[0.06] last:border-0">
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
          ) : null}
        </>
      ) : null}
    </DashboardStandardPage>
  );
}
