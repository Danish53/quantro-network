"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "@/app/lib/toastBus";
import AuthLogo from "./AuthLogo";
import AuthSpinner from "./AuthSpinner";
import { IconEye, IconLock } from "./AuthIcons";
import {
  authRegisterCardClass,
  authRegisterFieldClass,
  authRegisterFormStackClass,
  authRegisterInputClass,
  authRegisterPrimaryButtonClass,
} from "./authFormStyles";

const iconClass = "h-5 w-5 shrink-0 text-[#8b92a8]";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mismatch, setMismatch] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p = (fd.get("password") ?? "").toString();
    const p2 = (fd.get("passwordConfirm") ?? "").toString();
    if (p !== p2) {
      setMismatch(true);
      toast({ variant: "error", message: "Passwords do not match." });
      return;
    }
    setMismatch(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          password: p,
          passwordConfirm: p2,
          token: token || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          variant: "error",
          message: typeof data.error === "string" ? data.error : "Could not reset password.",
        });
        return;
      }
      toast({ variant: "success", message: "Password updated. You can sign in now." });
      setSubmitted(true);
    } catch {
      toast({ variant: "error", message: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={authRegisterCardClass}>
        <AuthLogo compact />
        <h1 className="mb-2 text-left text-lg font-bold text-white sm:text-xl">Password updated</h1>
        <p className="mb-5 text-left text-[12px] leading-relaxed text-[#9aa3b8] sm:text-[13px]">
          Your password has been changed successfully. You can now sign in with your new password.
        </p>
        <Link href="/login" className={authRegisterPrimaryButtonClass}>
          <span>Go to login</span>
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
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#007bff] hover:underline">
            Register
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={authRegisterCardClass}>
      <AuthLogo compact />
      <h1 className="mb-2 text-left text-lg font-bold text-white sm:text-xl">Reset password</h1>
      <p className="mb-5 text-left text-[12px] leading-relaxed text-[#9aa3b8] sm:text-[13px]">
        Choose a strong new password for your account.
        {token ? (
          <span className="mt-1 block text-[11px] text-[#6b728e]">
            You opened this page from your email link.
          </span>
        ) : (
          <span className="mt-1 block text-[11px] text-[#6b728e]">
            After verifying your OTP, continue here — or use the link from your email.
          </span>
        )}
      </p>

      <form onSubmit={handleSubmit} className={authRegisterFormStackClass}>
        <div>
          <label htmlFor="reset-password" className="sr-only">
            New password
          </label>
          <div className={authRegisterFieldClass}>
            <IconLock className={iconClass} />
            <input
              id="reset-password"
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              placeholder="New password"
              className={authRegisterInputClass}
              required
              minLength={8}
              disabled={loading}
            />
            <button
              type="button"
              className="shrink-0 rounded-md p-1 text-[#8b92a8] transition hover:bg-white/5 hover:text-white"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              <IconEye open={showPass} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reset-password-confirm" className="sr-only">
            Confirm new password
          </label>
          <div className={authRegisterFieldClass}>
            <IconLock className={iconClass} />
            <input
              id="reset-password-confirm"
              name="passwordConfirm"
              type={showPass2 ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm new password"
              className={authRegisterInputClass}
              required
              minLength={8}
              disabled={loading}
            />
            <button
              type="button"
              className="shrink-0 rounded-md p-1 text-[#8b92a8] transition hover:bg-white/5 hover:text-white"
              onClick={() => setShowPass2((v) => !v)}
              aria-label={showPass2 ? "Hide password" : "Show password"}
            >
              <IconEye open={showPass2} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {mismatch ? (
          <p className="text-center text-[12px] text-red-400" role="alert">
            Passwords do not match.
          </p>
        ) : null}

        <button type="submit" disabled={loading} className={authRegisterPrimaryButtonClass} aria-busy={loading}>
          {loading ? (
            <>
              <AuthSpinner />
              <span>Updating…</span>
            </>
          ) : (
            <>
              <span>Update password</span>
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

      <p className="mx-2 mt-3 text-center text-[11px] text-[#9aa3b8] sm:text-[11px]">
        <Link href="/login" className="font-semibold text-[#007bff] hover:underline">
          Back to login page
        </Link>
      </p>
    </div>
  );
}
