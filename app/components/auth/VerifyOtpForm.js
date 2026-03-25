"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/app/lib/toastBus";
import AuthLogo from "./AuthLogo";
import AuthSpinner from "./AuthSpinner";
import { IconAt } from "./AuthIcons";
import {
  authRegisterCardClass,
  authRegisterFieldClass,
  authRegisterFormStackClass,
  authRegisterInputClass,
  authRegisterPrimaryButtonClass,
} from "./authFormStyles";

const iconClass = "h-5 w-5 shrink-0 text-[#8b92a8]";

export default function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email")?.trim() ?? "";
  const [emailInput, setEmailInput] = useState("");

  const [digits, setDigits] = useState(() => Array(6).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendSec, setResendSec] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const refs = useRef([]);

  const effectiveEmail = (emailParam || emailInput).trim();

  useEffect(() => {
    if (resendSec <= 0) return;
    const t = setInterval(() => setResendSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendSec]);

  const otp = digits.join("");

  const setDigit = useCallback((i, raw) => {
    const c = raw.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = c;
      return next;
    });
    setError(false);
    if (c && i < 5) {
      refs.current[i + 1]?.focus();
    }
  }, []);

  const onKeyDown = useCallback(
    (i, e) => {
      if (e.key === "Backspace" && !digits[i] && i > 0) {
        refs.current[i - 1]?.focus();
      }
    },
    [digits],
  );

  const onPaste = useCallback((e) => {
    e.preventDefault();
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (t.length === 6) {
      setDigits(t.split(""));
      setError(false);
      refs.current[5]?.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError(true);
      toast({ variant: "error", message: "Enter all 6 digits of the code." });
      return;
    }
    if (!effectiveEmail) {
      toast({ variant: "error", message: "Enter your email address." });
      return;
    }
    setError(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: effectiveEmail, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          variant: "error",
          message: typeof data.error === "string" ? data.error : "Verification failed.",
        });
        return;
      }
      toast({ variant: "success", message: "Code verified. You can set a new password." });
      setSubmitted(true);
    } catch {
      toast({ variant: "error", message: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendSec > 0 || resendLoading) return;
    if (!effectiveEmail) {
      toast({ variant: "error", message: "Enter your email address first." });
      return;
    }
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: effectiveEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          variant: "error",
          message: typeof data.error === "string" ? data.error : "Could not resend code.",
        });
        return;
      }
      setResendSec(60);
      toast({
        variant: "success",
        message: "If an account exists, a new code was sent to your email.",
      });
    } catch {
      toast({ variant: "error", message: "Network error. Try again." });
    } finally {
      setResendLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={authRegisterCardClass}>
        <AuthLogo compact />
        <h1 className="mb-2 text-left text-lg font-bold text-white sm:text-xl">Code verified</h1>
        <p className="mb-5 text-left text-[12px] leading-relaxed text-[#9aa3b8] sm:text-[13px]">
          Your verification code was accepted. You can now set a new password for your account.
        </p>
        <Link href="/reset-password" className={authRegisterPrimaryButtonClass}>
          <span>Continue to reset password</span>
          <svg
            className="h-5 w-5 transition group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <p className="mx-2 mt-3 text-center text-[11px] text-[#9aa3b8] sm:text-[11px]">
          <Link href="/login" className="font-semibold text-[#007bff] hover:underline">
            Back to login page
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={authRegisterCardClass}>
      <AuthLogo compact />
      <h1 className="mb-2 text-left text-lg font-bold text-white sm:text-xl">Verification code</h1>
      <p className="mb-5 text-left text-[12px] leading-relaxed text-[#9aa3b8] sm:text-[13px]">
        Enter the 6-digit code we sent
        {emailParam ? (
          <>
            {" "}
            to <span className="font-medium text-slate-200">{emailParam}</span>
          </>
        ) : (
          " to your registered email"
        )}
        .
      </p>

      {!emailParam ? (
        <div className="mb-3">
          <label htmlFor="verify-email" className="sr-only">
            Email Address
          </label>
          <div className={authRegisterFieldClass}>
            <IconAt className={iconClass} />
            <input
              id="verify-email"
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              className={authRegisterInputClass}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={loading || resendLoading}
            />
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className={authRegisterFormStackClass}>
        <div className="flex justify-center gap-1.5 sm:gap-2" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              aria-label={`Digit ${i + 1}`}
              disabled={loading}
              className="h-11 w-9 rounded-[10px] border border-[#2d3348] bg-[#0c0d12]/90 text-center text-[17px] font-semibold tracking-widest text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-[#007bff]/80 focus:ring-2 focus:ring-[#007bff]/25 disabled:opacity-50 sm:h-12 sm:w-10"
            />
          ))}
        </div>
        {error ? (
          <p className="text-center text-[12px] text-red-400" role="alert">
            Please enter all 6 digits.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={otp.length !== 6 || loading || !effectiveEmail}
          className={authRegisterPrimaryButtonClass}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <AuthSpinner />
              <span>Verifying…</span>
            </>
          ) : (
            <>
              <span>Verify</span>
              <svg
                className="h-5 w-5 transition group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </form>

      <p className="mx-2 mt-3 flex flex-wrap items-center justify-center gap-1 text-center text-[11px] text-[#9aa3b8] sm:text-[11px]">
        <span>Didn&apos;t receive a code?</span>
        <button
          type="button"
          disabled={resendSec > 0 || resendLoading}
          onClick={handleResend}
          className="inline-flex items-center gap-1.5 font-semibold text-[#007bff] hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
        >
          {resendLoading ? <AuthSpinner className="h-3.5 w-3.5" /> : null}
          {resendSec > 0 ? `Resend in ${resendSec}s` : resendLoading ? "Sending…" : "Resend OTP"}
        </button>
      </p>
      <p className="mx-2 mt-2 text-center text-[11px] text-[#9aa3b8] sm:text-[11px]">
        <Link href="/forgot-password" className="font-semibold text-[#007bff] hover:underline">
          Use a different email
        </Link>
        {" · "}
        <Link href="/login" className="font-semibold text-[#007bff] hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
