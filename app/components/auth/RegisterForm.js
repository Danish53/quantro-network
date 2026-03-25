"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { COUNTRIES } from "@/app/lib/countries";
import { toast } from "@/app/lib/toastBus";
import AuthLogo from "./AuthLogo";
import AuthRecaptcha from "./AuthRecaptcha";
import AuthSpinner from "./AuthSpinner";
import {
  IconAt,
  IconFlag,
  IconLink,
  IconLock,
  IconPhone,
  IconUser,
  IconUserCircle,
  IconEye,
} from "./AuthIcons";
import {
  authRegisterCardClass,
  authRegisterFieldClass,
  authRegisterFormStackClass,
  authRegisterInputClass,
  authRegisterPrimaryButtonClass,
} from "./authFormStyles";

const iconClass = "h-5 w-5 shrink-0 text-[#8b92a8]";

function ChevronDown({ className = "h-4 w-4 shrink-0 text-[#6b728e]" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [agreed, setAgreed] = useState(false);
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
      toast({ variant: "error", message: 'Please complete “I’m not a robot” before registering.' });
      return;
    }
    setRecaptchaError(false);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      fullName: (fd.get("fullName") ?? "").toString().trim(),
      username: (fd.get("username") ?? "").toString().trim(),
      email: (fd.get("email") ?? "").toString().trim(),
      phone: (fd.get("phone") ?? "").toString().trim(),
      country: (fd.get("country") ?? "").toString().trim(),
      referral: (fd.get("referral") ?? "").toString().trim(),
      password: (fd.get("password") ?? "").toString(),
      confirmPassword: (fd.get("confirmPassword") ?? "").toString(),
      recaptchaToken,
    };
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          variant: "error",
          message: typeof data.error === "string" ? data.error : "Registration failed. Try again.",
        });
        return;
      }
      toast({ variant: "success", message: "Account created. Redirecting to sign in…" });
      router.push("/login?registered=1");
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
        Please fill in all fields to register
      </p>

      <form onSubmit={handleSubmit} className={authRegisterFormStackClass}>
        <div>
          <label htmlFor="reg-fullname" className="sr-only">
            Full Name
          </label>
          <div className={authRegisterFieldClass}>
            <IconUserCircle className={iconClass} />
            <input
              id="reg-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              className={authRegisterInputClass}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-username" className="sr-only">
            Username
          </label>
          <div className={authRegisterFieldClass}>
            <IconUser className={iconClass} />
            <input
              id="reg-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Username"
              className={authRegisterInputClass}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-email" className="sr-only">
            Email Address
          </label>
          <div className={authRegisterFieldClass}>
            <IconAt className={iconClass} />
            <input
              id="reg-email"
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
          <label htmlFor="reg-phone" className="sr-only">
            Phone Number
          </label>
          <div className={authRegisterFieldClass}>
            <IconPhone className={iconClass} />
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone Number"
              className={authRegisterInputClass}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-country" className="sr-only">
            Select Country
          </label>
          <div className={`relative ${authRegisterFieldClass} pr-2`}>
            <IconFlag className={iconClass} />
            <select
              id="reg-country"
              name="country"
              className={`${authRegisterInputClass} cursor-pointer appearance-none pr-9`}
              defaultValue=""
              required
              disabled={loading}
            >
              <option value="" disabled className="bg-[#161822] text-[#8b92a8]">
                Select Country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#161822] text-white">
                  {c.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="reg-referral" className="sr-only">
            Referral Code
          </label>
          <div className={authRegisterFieldClass}>
            <IconLink className={iconClass} />
            <input
              id="reg-referral"
              name="referral"
              type="text"
              placeholder="Referral Code *"
              className={authRegisterInputClass}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-password" className="sr-only">
            Password
          </label>
          <div className={authRegisterFieldClass}>
            <IconLock className={iconClass} />
            <input
              id="reg-password"
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
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

        <div>
          <label htmlFor="reg-password2" className="sr-only">
            Confirm Password
          </label>
          <div className={authRegisterFieldClass}>
            <IconLock className={iconClass} />
            <input
              id="reg-password2"
              name="confirmPassword"
              type={showPass2 ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm Password"
              className={authRegisterInputClass}
              required
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

        <label className="mx-2 flex cursor-pointer items-start gap-2.5 pt-0.5 text-[12px] leading-snug text-[#b8c0d0] sm:text-[13px]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#2d3348] bg-[#0c0d12] text-[#007bff] focus:ring-2 focus:ring-[#007bff]/40"
            required
            disabled={loading}
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-semibold text-[#007bff] hover:underline">
              Terms and Conditions
            </Link>
          </span>
        </label>

        <div className="pt-1">
          {/* <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[#8b92a8] sm:text-xs">Verification</p> */}
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
              Please tick “I&apos;m not a robot” to continue.
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
              <span>Creating account…</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
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

      <p className="mt-3 text-center text-[11px] mx-2 text-[#9aa3b8] sm:text-[11px]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#007bff] hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
