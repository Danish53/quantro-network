"use client";

import { useCallback, useId, useState } from "react";
import logo from "@/public/images/logo-white.png";
import Image from "next/image";
import { useSiteTranslation } from "../SiteTranslationProvider";

/**
 * Quantro virtual debit card — premium plastic look with hover/tap flip to show CVV on back.
 */
export default function PremiumPlasticCard({
  cardNumberDisplay,
  panCopyValue,
  cardNumberSub,
  expiresValue = "00-00",
  cardholderName = "QUANTRO USER",
  cvvDisplay = "•••",
  flipHint,
  className = "",
}) {
  const { t } = useSiteTranslation();
  const pan = formatPanDisplay(cardNumberDisplay);
  const expiryMmYy = formatExpiryMmYy(expiresValue);
  const hintText = flipHint ?? t("dash.vcard.flip_hint");
  const gid = useId().replace(/:/g, "");
  const [showBackMobile, setShowBackMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCardClick = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    setShowBackMobile((b) => !b);
  }, []);

  const resolveClipboardPanText = useCallback(() => {
    return getCopyablePanText(cardNumberDisplay, panCopyValue);
  }, [cardNumberDisplay, panCopyValue]);

  const handleCopyNumber = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(resolveClipboardPanText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [resolveClipboardPanText]);

  return (
    <div className={`group quantro-vcard-shell mx-auto w-full max-w-[440px] ${className}`.trim()}>
      <p className="mb-2 text-center font-semibold tracking-widest text-[#5C5AFF] text-xs">{hintText} <input
            type="text"
            value={pan}
            readOnly
            className="hidden h-10 w-full rounded-[10px] border border-white/[0.12] bg-[#0f1022] px-3 font-mono text-sm tracking-[0.14em] text-slate-100 outline-none"
          />
          <button
            type="button"
            onClick={handleCopyNumber}
            className="h-6 shrink-0 rounded-[10px] border border-white/[0.12] bg-[#1a1842] px-2.5 text-xs font-semibold text-slate-100 transition hover:bg-[#23205a]"
          >
            {copied ? <span className="text-white">Copied</span> : <span className="text-[#5C5AFF]">Copy</span>}
          </button></p>
      <div className="mx-auto w-full [perspective:1400px]">
        <div
          role="button"
          tabIndex={0}
          onClick={handleCardClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick();
            }
          }}
          data-flip={showBackMobile ? "on" : "off"}
          className="relative aspect-[1.586/1] w-full cursor-pointer outline-none transition-transform duration-[750ms] ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] max-md:data-[flip=on]:[transform:rotateY(180deg)] md:cursor-default md:group-hover:[transform:rotateY(180deg)]"
          aria-label={hintText}
        >
          {/* —— Front —— */}
          <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-white/[0.14] [backface-visibility:hidden] [transform:translate3d(0,0,0.1px)] sm:rounded-[24px]">
            <CardCarbonBackground />
            <NeonSvgOverlay gid={gid} />
            <div
              className="pointer-events-none absolute -right-[18%] -top-[40%] h-[150%] w-[50%] rotate-[26deg] rounded-full bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/[0.08] sm:rounded-[24px]"
              aria-hidden
            />

            <div className="relative flex h-full min-h-0 flex-col px-6 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
              <Image src={logo} alt="" width={130} height={130} className="h-auto w-[min(130px,38%)] object-contain object-left" />
              <div className="mt-5 sm:mt-6">
                <EmvChipGold />
              </div>

              <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-2 text-center sm:py-2">
                <div
                  className="quantro-vcard-pan text-[clamp(1rem,4.2vw,1.35rem)] font-normal tracking-[0.22em] text-white"
                  style={{
                    textShadow:
                      "0 0 24px rgba(34, 211, 238, 0.35), 0 0 2px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.85)",
                  }}
                >
                  {pan}
                </div>
                {cardNumberSub ? (
                  <div className="mt-2 font-mono text-[0.62rem] tracking-[0.35em] text-white/45">{cardNumberSub}</div>
                ) : null}
              </div>

              {/* Expiry + cardholder + network */}
              <div className="mt-auto pt-2 sm:pt-3">
                
              <div>
                    <div className="text-[0.45rem] font-semibold uppercase tracking-[0.28em] text-white/45">{t("dash.vcard.valid_thru")}</div>
                    <div className="font-mono text-base font-semibold tracking-[0.18em] text-white sm:text-lg">{expiryMmYy}</div>
                  </div>
                <div className="flex items-end justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-[0.72rem] font-semibold uppercase leading-tight tracking-[0.22em] text-white sm:text-[0.76rem]">
                      {(cardholderName || "QUANTRO USER").toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.52rem] font-bold uppercase tracking-[0.42em] text-white">DEBIT</div>
                    <div
                      className="mt-1 text-[1.65rem] font-black italic leading-none tracking-tight text-white sm:text-[1.85rem]"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      VISA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* —— Back —— */}
          <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-white/[0.14] [backface-visibility:hidden] [transform:rotateY(180deg)_translate3d(0,0,0.1px)] sm:rounded-[24px]">
            <CardCarbonBackground darker />
            <div className="absolute left-0 right-0 top-0 h-[14%] bg-[#0a0a0c]" aria-hidden />
            <div className="absolute left-0 right-0 top-[18%] h-px bg-white/[0.06]" aria-hidden />

            <div className="relative flex h-full flex-col px-6 pb-3 pt-[14%] sm:px-7">
              <div className="mt-auto rounded-md bg-gradient-to-b from-white/95 to-slate-200/95 px-3 py-2 shadow-inner">
                <p className="text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{t("dash.vcard.back_signature")}</p>
                <div className="mt-2 flex h-8 items-center border-b border-slate-300/80" aria-hidden>
                  <span className="font-[cursive] text-lg italic text-slate-400 opacity-80"> </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white/55">{t("dash.vcard.cvv_label")}</span>
                <div
                  className="rounded bg-white px-4 font-mono text-lg font-bold tracking-[0.35em] text-slate-900 shadow-sm"
                  style={{ minWidth: "3.5rem", textAlign: "center" }}
                >
                  {cvvDisplay}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between opacity-90">
                <Image src={logo} alt="" width={72} height={72} className="h-8 w-auto object-contain object-left brightness-0 invert" />
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/50">Debit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mt-4 rounded-[12px] border border-white/[0.1] bg-[#141235] p-3 ring-1 ring-white/[0.05]">
        <p className="mb-2 text-center text-[11px] text-slate-500 md:text-xs">{t("dash.vcard.copy_number_hint")}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={pan}
            readOnly
            className="h-10 w-full rounded-[10px] border border-white/[0.12] bg-[#0f1022] px-3 font-mono text-sm tracking-[0.14em] text-slate-100 outline-none"
          />
          <button
            type="button"
            onClick={handleCopyNumber}
            className="h-10 shrink-0 rounded-[10px] border border-white/[0.12] bg-[#1a1842] px-4 text-sm font-semibold text-slate-100 transition hover:bg-[#23205a]"
          >
            {copied ? t("dash.vcard.copy_ok") : t("dash.vcard.copy_number")}
          </button>
        </div>
      </div> */}
    </div>
  );
}

function CardCarbonBackground({ darker = false }) {
  return (
    <div
      className="absolute inset-0 rounded-[20px] sm:rounded-[24px]"
      style={{
        backgroundColor: darker ? "#050506" : "#070708",
        backgroundImage: `
          radial-gradient(ellipse 100% 80% at 50% 50%, rgba(30, 30, 34, 0.95) 0%, transparent 62%),
          radial-gradient(ellipse 70% 50% at 20% 30%, rgba(45, 212, 191, ${darker ? 0.04 : 0.07}) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 85% 15%, rgba(56, 189, 248, ${darker ? 0.05 : 0.08}) 0%, transparent 45%),
          repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px),
          repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(0,0,0,0.35) 3px, rgba(0,0,0,0.35) 4px),
          linear-gradient(180deg, ${darker ? "#080809" : "#0d0d10"} 0%, #080809 45%, #0c0c0f 100%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 8px 8px, 8px 8px, 100% 100%",
      }}
      aria-hidden
    />
  );
}

function NeonSvgOverlay({ gid }) {
  const neonAId = `neon-a-${gid}`;
  const neonBId = `neon-b-${gid}`;
  const glowId = `glow-${gid}`;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full rounded-[20px] opacity-[0.95] mix-blend-screen sm:rounded-[24px]"
      viewBox="0 0 400 252"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={neonAId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
          <stop offset="35%" stopColor="#2dd4bf" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={neonBId} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M-10 38 C90 12 200 28 410 20"
        fill="none"
        stroke={`url(#${neonAId})`}
        strokeWidth="3"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />
      <path
        d="M20 200 C120 175 260 230 420 185"
        fill="none"
        stroke={`url(#${neonBId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M-5 120 C100 90 220 140 405 95"
        fill="none"
        stroke="#a3e635"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

/**
 * Copy helper:
 * - prefer full digits from `rawFullPan` when available (13-19 digits)
 * - otherwise fall back to displayed PAN (can be masked)
 */
export function getCopyablePanText(rawDisplayPan, rawFullPan) {
  const fullDigits = String(rawFullPan || "").replace(/\D/g, "");
  if (fullDigits.length >= 13 && fullDigits.length <= 19) return fullDigits;
  return formatPanDisplay(rawDisplayPan);
}

function formatExpiryMmYy(expiresValue) {
  if (!expiresValue || typeof expiresValue !== "string") return "—/—";
  const s = expiresValue.trim();
  const parts = s.split(/[-/]/).filter(Boolean);
  if (parts.length >= 2) {
    const mm = String(parts[0]).replace(/\D/g, "").padStart(2, "0").slice(-2);
    let yy = String(parts[1]).replace(/\D/g, "");
    if (yy.length === 4) yy = yy.slice(-2);
    if (yy.length === 1) yy = yy.padStart(2, "0");
    return `${mm}/${yy}`;
  }
  return s;
}

/** Match reference spacing: 4321 9876 5432 1098 */
function formatPanDisplay(raw) {
  if (!raw || typeof raw !== "string") return "4321 9876 5432 1098";
  const trimmed = raw.trim();
  if (/^[•\d\s]+$/.test(trimmed) || trimmed.includes("•")) return trimmed;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 16) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12, 16)}`;
  }
  return trimmed;
}

/** First contiguous 4-digit group from masked PAN */
export function firstFourDigitsFromMaskedPan(maskedPan) {
  if (!maskedPan || typeof maskedPan !== "string") return "";
  const m = maskedPan.match(/\d{4}/);
  return m ? m[0] : "";
}

export function demoCvvFromSeed(seed) {
  const s = String(seed ?? "quantro");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  const n = 100 + (Math.abs(h) % 900);
  return String(n).padStart(3, "0").slice(0, 3);
}

function EmvChipGold() {
  return (
    <div
      className="relative h-[44px] w-[56px] shrink-0 rounded-lg p-[2px] shadow-[inset_0_2px_0_rgba(255,255,255,0.55),0_4px_14px_rgba(0,0,0,0.55)]"
      style={{
        background: "linear-gradient(145deg, #f0d78c 0%, #c9a227 45%, #8b6914 100%)",
      }}
    >
      <div
        className="flex h-full w-full flex-col justify-between rounded-[6px] p-1.5"
        style={{
          background: "linear-gradient(165deg, #d4af37 0%, #a67c1a 55%, #6b4a0e 100%)",
        }}
      >
        <div className="h-px w-full bg-black/35" />
        <div className="grid grid-cols-3 gap-px">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-[4px] bg-black/25" />
          ))}
        </div>
        <div className="h-px w-full bg-black/35" />
      </div>
    </div>
  );
}
