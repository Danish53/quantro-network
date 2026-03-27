"use client";

/**
 * Premium physical-style card (ISO 7810 ID-1 ratio ~1.586:1).
 * Visual: deep blue → indigo gradient, gloss, EMV chip, contactless, hologram strip.
 */
export default function PremiumPlasticCard({
  bankName = "QUANTRO NETWORK",
  cardNumberDisplay,
  cardNumberSub,
  expiresTitle = "EXPIRES END",
  expiresMidLabel = "MONTH / YEAR",
  expiresValue = "00-00",
  cardholderName = "CARDHOLDER NAME",
  cvvHint = "CVV •••",
  className = "",
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[22px] border border-white/[0.12] shadow-[0_24px_48px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)_inset] ${className}`.trim()}
      style={{ aspectRatio: "1.586 / 1" }}
    >
      {/* Base — #0047AB → #4B0082 style gradient */}
      <div
        className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-[#0047AB] via-[#312e81] to-[#4B0082]"
        aria-hidden
      />
      {/* Wavy depth */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full rounded-[22px] opacity-35" aria-hidden>
        <defs>
          <linearGradient id="pp-wave" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path fill="url(#pp-wave)" d="M-20 80 Q80 40 180 90 T380 70 L400 200 L-40 220 Z" />
        <path fill="#312e81" fillOpacity="0.4" d="M200 -10 Q320 20 420 100 L440 280 L0 300 L-20 40 Z" />
      </svg>
      {/* Diagonal gloss */}
      <div
        className="pointer-events-none absolute -right-1/4 -top-1/2 h-[200%] w-1/2 rotate-[32deg] bg-gradient-to-b from-white/[0.22] via-white/[0.07] to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-white/[0.08]" aria-hidden />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* <BankMark /> */}
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white sm:text-xs">{bankName}</span>
          </div>
          <ContactlessIcon />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <EmvChip />
          <HologramPlate />
        </div>

        <div className="mt-6 min-w-0 flex-1">
          <p
            className="font-mono text-[clamp(0.95rem,3.8vw,1.35rem)] font-medium tracking-[0.14em] text-white tabular-nums"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
          >
            {cardNumberDisplay}
          </p>
          {cardNumberSub ? (
            <p className="mt-1 font-mono text-xs tracking-wider text-white/80">{cardNumberSub}</p>
          ) : null}
        </div>

        {/* <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-1">
          <div className="min-w-0 max-w-[45%]">
            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/95">{cardholderName}</p>
          </div>
          <div className="flex flex-1 flex-col items-center text-center">
            <p className="text-[9px] font-medium uppercase tracking-widest text-white/55">{expiresTitle}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/70">{expiresMidLabel}</p>
            <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-white">{expiresValue}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium tracking-wide text-white/80">{cvvHint}</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

/** First contiguous 4-digit group from masked PAN (e.g. 4532 from "4532 •••• •••• 1048"). */
export function firstFourDigitsFromMaskedPan(maskedPan) {
  if (!maskedPan || typeof maskedPan !== "string") return "";
  const m = maskedPan.match(/\d{4}/);
  return m ? m[0] : "";
}

function BankMark() {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" aria-hidden className="shrink-0">
      <path d="M8 4h6l4 10 4-10h6v20h-5V12l-3 7h-4l-3-7v12H8V4z" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

function ContactlessIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden className="shrink-0 text-white">
      <path d="M8 22c4-4 12-4 16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
      <path d="M10 18c3-3 9-3 12 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
      <path d="M12 14c2-2 6-2 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
      <path d="M14 10h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EmvChip() {
  return (
    <div className="relative h-11 w-14 shrink-0 rounded-md bg-gradient-to-br from-[#d4af37] via-[#f5e6a8] to-[#b8860b] p-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_8px_rgba(0,0,0,0.35)]">
      <div className="flex h-full w-full flex-col justify-between rounded-[5px] bg-gradient-to-br from-[#c9a227] to-[#8b6914] p-1">
        <div className="h-px w-full bg-black/25" />
        <div className="grid grid-cols-3 gap-px">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-1 bg-black/15" />
          ))}
        </div>
        <div className="h-px w-full bg-black/25" />
      </div>
    </div>
  );
}

function HologramPlate() {
  return (
    <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded border border-white/30 bg-gradient-to-br from-slate-200/90 via-slate-400/80 to-slate-500/90 shadow-inner">
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 64 44" aria-hidden>
        <path
          fill="none"
          stroke="#475569"
          strokeWidth="0.4"
          d="M8 28c6-10 18-14 28-8s14 14 10 22M12 12c10 4 14 16 8 24"
        />
      </svg>
      <svg className="absolute inset-1 opacity-50" viewBox="0 0 100 60" aria-hidden>
        <path
          fill="currentColor"
          className="text-slate-600"
          d="M50 8c-12 4-20 14-18 24 2 12 16 18 28 14 10-3 16-12 14-22-2-10-12-18-24-16z"
        />
      </svg>
    </div>
  );
}
