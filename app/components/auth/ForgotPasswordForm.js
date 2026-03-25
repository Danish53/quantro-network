"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const nextEmail = (fd.get("email") ?? "").toString().trim();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          variant: "error",
          message: typeof data.error === "string" ? data.error : "Could not send reset email.",
        });
        return;
      }
      setEmail(nextEmail);
      setSubmitted(true);
      toast({
        variant: "success",
        message: "If an account exists, we sent reset instructions to your email.",
      });
    } catch {
      toast({ variant: "error", message: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const otpHref = email ? `/verify-otp?email=${encodeURIComponent(email)}` : "/verify-otp";

    return (
      <div className={authRegisterCardClass}>
        <AuthLogo compact />
        <h1 className="mb-2 text-left text-lg font-bold text-white sm:text-xl">Check your email</h1>
        <p className="mb-5 text-left text-[12px] leading-relaxed text-[#9aa3b8] sm:text-[13px]">
          If an account exists for{" "}
          <span className="font-medium text-slate-200">{email || "that address"}</span>, we&apos;ve sent instructions
          with a verification code and a reset link. Please check your inbox and spam folder.
        </p>
        <Link href={otpHref} className={authRegisterPrimaryButtonClass}>
          <span>Enter verification code</span>
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
        <p className="mx-2 mt-3 text-center text-[11px] leading-relaxed text-[#9aa3b8] sm:text-[11px]">
          Or use the link in your email to{" "}
          <Link href="/reset-password" className="font-semibold text-[#007bff] hover:underline">
            set a new password
          </Link>
          .
        </p>
        <p className="mx-2 mt-2 text-center text-[11px] text-[#9aa3b8] sm:text-[11px]">
          <Link href="/login" className="font-semibold text-[#007bff] hover:underline">
            Back to login page
          </Link>
        </p>
        <p className="mx-2 mt-2 text-center text-[11px] text-[#9aa3b8] sm:text-[11px]">
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
      <h1 className="mb-2 text-left text-lg font-bold text-white sm:text-xl">Recover Password</h1>
      <p className="mb-5 text-left text-[12px] leading-relaxed text-[#9aa3b8] sm:text-[13px]">
        Enter your registered email address below, and we&apos;ll send you an email allowing you to reset the password.
      </p>

      <form onSubmit={handleSubmit} className={authRegisterFormStackClass}>
        <div>
          <label htmlFor="forgot-email" className="sr-only">
            Email Address
          </label>
          <div className={authRegisterFieldClass}>
            <IconAt className={iconClass} />
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              className={authRegisterInputClass}
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className={authRegisterPrimaryButtonClass} aria-busy={loading}>
          {loading ? (
            <>
              <AuthSpinner />
              <span>Sending…</span>
            </>
          ) : (
            <>
              <span>Reset Password</span>
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
      <p className="mx-2 mt-2 text-center text-[11px] text-[#9aa3b8] sm:text-[11px]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#007bff] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
