"use client";
import logo from "@/public/images/logo-white.png";
import Image from "next/image";

/**
 * Quantro virtual debit card — matches brand artboard:
 * dark carbon center, teal/blue/lime neon edge glow, gradient Q, QUANTRO / NETWORK,
 * gold EMV chip, OCR-style PAN, QUANTRO USER + DEBIT + VISA.
 */
export default function PremiumPlasticCard({
  cardNumberDisplay,
  cardNumberSub,
  expiresValue = "00-00",
  cardholderName = "QUANTRO USER",
  className = "",
}) {
  const pan = formatPanDisplay(cardNumberDisplay);

  return (
    <div className={`quantro-vcard-shell mx-auto w-full max-w-[440px] ${className}`.trim()}>
      <div
        className="relative overflow-hidden rounded-[20px] border border-white/[0.14] sm:rounded-[24px]"
        style={{
          aspectRatio: "1.586 / 1",
          transform: "perspective(1400px) rotateY(-6deg) rotateX(2deg)",
          transformStyle: "preserve-3d",
          // boxShadow: `
          //   0 0 0 1px rgba(45, 212, 191, 0.35),
          //   0 0 50px rgba(34, 211, 238, 0.45),
          //   0 0 90px rgba(56, 189, 248, 0.25),
          //   0 0 70px rgba(163, 230, 53, 0.2),
          //   0 32px 64px rgba(0, 0, 0, 0.75)
          // `,
        }}
      >
        {/* Deep base + carbon weave */}
        <div
          className="absolute inset-0 rounded-[20px] sm:rounded-[24px]"
          style={{
            backgroundColor: "#070708",
            backgroundImage: `
              radial-gradient(ellipse 100% 80% at 50% 50%, rgba(30, 30, 34, 0.95) 0%, transparent 62%),
              radial-gradient(ellipse 70% 50% at 20% 30%, rgba(45, 212, 191, 0.07) 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 85% 15%, rgba(56, 189, 248, 0.08) 0%, transparent 45%),
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 3px,
                rgba(255,255,255,0.04) 3px,
                rgba(255,255,255,0.04) 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.35) 3px,
                rgba(0,0,0,0.35) 4px
              ),
              linear-gradient(180deg, #0d0d10 0%, #080809 45%, #0c0c0f 100%)
            `,
            backgroundSize: "100% 100%, 100% 100%, 100% 100%, 8px 8px, 8px 8px, 100% 100%",
          }}
          aria-hidden
        />

        {/* Neon sweeps (teal / blue / lime) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full rounded-[20px] opacity-[0.95] mix-blend-screen sm:rounded-[24px]"
          viewBox="0 0 400 252"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="neon-a" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
              <stop offset="35%" stopColor="#2dd4bf" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#a3e635" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="neon-b" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
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
            stroke="url(#neon-a)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <path
            d="M20 200 C120 175 260 230 420 185"
            fill="none"
            stroke="url(#neon-b)"
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

        {/* Gloss */}
        <div
          className="pointer-events-none absolute -right-[18%] -top-[40%] h-[150%] w-[50%] rotate-[26deg] rounded-full bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/[0.08] sm:rounded-[24px]"
          aria-hidden
        />

        <div className="relative flex h-full min-h-0 flex-col px-6 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
          <span className="sr-only">
            Expires {expiresValue.replace("-", "/")}
          </span>
          {/* Top: gradient Q + QUANTRO / NETWORK */}
          {/* <div className="flex items-start gap-2.5">
            <QuantroLogoMark />
            <div className="min-w-0 pt-0.5 leading-none">
              <div className="text-[1.155rem] font-extrabold tracking-[0.04em] text-white sm:text-[1.25rem]">
                QUANTRO
              </div>
              <div className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.32em] text-[#2dd4bf] sm:text-[0.72rem]">
                NETWORK
              </div>
            </div>
          </div> */}
          <Image src={logo} alt="image" width={130} height={130} />

          {/* Gold chip — middle left */}
          <div className="mt-5 sm:mt-6">
            <EmvChipGold />
          </div>

          {/* PAN — center band, OCR-style (Share Tech Mono via CSS) */}
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-3 text-center sm:py-4">
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

          {/* Bottom: cardholder | DEBIT + VISA (reference artboard — no expiry line on front) */}
          <div className="mt-auto flex items-end justify-between gap-4 pt-2">
            <div className="min-w-0 max-w-[58%] text-[0.72rem] font-semibold uppercase leading-tight tracking-[0.22em] text-white sm:text-[0.76rem]">
              {(cardholderName || "QUANTRO USER").toUpperCase()}
            </div>
            <div className="shrink-0 text-right">
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
  );
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

function QuantroLogoMark() {
  return (
    <svg width="49" height="49" viewBox="0 0 38 30" fill="none" aria-hidden className="shrink-0 drop-shadow-[0_0_18px_rgba(45,212,191,0.55)]">
      <defs>
        <linearGradient id="qmark-grad" x1="6" y1="6" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dd4bf" />
          <stop offset="0.5" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="url(#qmark-grad)"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "31px", fontWeight: 900 }}
      >
        Q
      </text>
    </svg>
  );
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
