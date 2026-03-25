"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "@/app/lib/toastBus";
import AuthLogo from "./AuthLogo";
import AuthRecaptcha from "./AuthRecaptcha";
import AuthSpinner from "./AuthSpinner";
import { IconAt, IconEye, IconLock } from "./AuthIcons";
import {
  authRegisterCardClass,
  authRegisterFieldClass,
  authRegisterFormStackClass,
  authRegisterInputClass,
  authRegisterPrimaryButtonClass,
} from "./authFormStyles";

const iconClass = "h-5 w-5 shrink-0 text-[#8b92a8]";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRecaptchaChange = useCallback((token) => {
    setRecaptchaToken(token);
    setRecaptchaError(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setRecaptchaError(true);
      toast({ variant: "error", message: 'Please complete “I’m not a robot” before signing in.' });
      return;
    }
    setRecaptchaError(false);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") ?? "").toString().trim();
    const password = (fd.get("password") ?? "").toString();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, recaptchaToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          variant: "error",
          message: typeof data.error === "string" ? data.error : "Sign in failed. Try again.",
        });
        return;
      }
      toast({ variant: "success", message: "Signed in successfully. Redirecting…" });
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast({ variant: "error", message: "Network error. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={authRegisterCardClass}>
      <AuthLogo compact />
      <p className="mb-5 text-center text-[12px] leading-relaxed text-[#9aa3b8] sm:text-[13px]">
        Please enter your credentials to login
      </p>

      {searchParams.get("registered") ? (
        <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-[12px] text-emerald-200/95 sm:text-[13px]">
          Account created. You can sign in now.
        </p>
      ) : null}
      {searchParams.get("expired") ? (
        <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-[12px] text-amber-100/95 sm:text-[13px]">
          Your session expired. Please sign in again.
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className={authRegisterFormStackClass}>
        <div>
          <label htmlFor="login-email" className="sr-only">
            Email Address
          </label>
          <div className={authRegisterFieldClass}>
            <IconAt className={iconClass} />
            <input
              id="login-email"
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

        <div>
          <label htmlFor="login-password" className="sr-only">
            Password
          </label>
          <div className={authRegisterFieldClass}>
            <IconLock className={iconClass} />
            <input
              id="login-password"
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              className={authRegisterInputClass}
              required
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

        <div className="-mt-0.5 flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[12px] font-medium text-[#007bff] transition hover:underline sm:text-[13px]"
          >
            Forgot password?
          </Link>
        </div>

        <div className="pt-1">
          <AuthRecaptcha
            onChange={onRecaptchaChange}
            onExpired={() => {
              setRecaptchaToken(null);
            }}
            onErrored={() => {
              setRecaptchaToken(null);
            }}
          />
          {recaptchaError ? (
            <p className="mt-2 text-center text-[12px] text-red-400" role="alert">
              Please tick &quot;I&apos;m not a robot&quot; to continue.
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={!recaptchaToken || loading}
          className={authRegisterPrimaryButtonClass}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <AuthSpinner />
              <span>Signing in…</span>
            </>
          ) : (
            <>
              <span>Login</span>
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
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#007bff] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
