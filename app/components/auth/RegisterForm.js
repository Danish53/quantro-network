"use client";

import Link from "next/link";
import { useState } from "react";
import { COUNTRIES } from "@/app/lib/countries";
import AuthLogo from "./AuthLogo";
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
  authCardClass,
  authFieldClass,
  authFormStackClass,
  authInputClass,
  authPrimaryButtonClass,
} from "./authFormStyles";

function ChevronDown({ className = "h-4 w-4 shrink-0 text-[#6b728e]" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function RegisterForm() {
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={authCardClass}>
      <AuthLogo />
      <p className="mb-8 text-center text-[13px] leading-relaxed text-[#9aa3b8] sm:text-sm">
        Please fill in all fields to register
      </p>

      <form onSubmit={handleSubmit} className={authFormStackClass}>
        <div>
          <label htmlFor="reg-fullname" className="sr-only">
            Full Name
          </label>
          <div className={authFieldClass}>
            <IconUserCircle className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <input
              id="reg-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              className={authInputClass}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-username" className="sr-only">
            Username
          </label>
          <div className={authFieldClass}>
            <IconUser className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <input
              id="reg-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Username"
              className={authInputClass}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-email" className="sr-only">
            Email Address
          </label>
          <div className={authFieldClass}>
            <IconAt className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              className={authInputClass}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-phone" className="sr-only">
            Phone Number
          </label>
          <div className={authFieldClass}>
            <IconPhone className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone Number"
              className={authInputClass}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-country" className="sr-only">
            Select Country
          </label>
          <div className={`relative ${authFieldClass} pr-2`}>
            <IconFlag className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <select
              id="reg-country"
              name="country"
              className={`${authInputClass} cursor-pointer appearance-none pr-9`}
              defaultValue=""
              required
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
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="reg-referral" className="sr-only">
            Referral Code
          </label>
          <div className={authFieldClass}>
            <IconLink className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <input
              id="reg-referral"
              name="referral"
              type="text"
              placeholder="Referral Code *"
              className={authInputClass}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-password" className="sr-only">
            Password
          </label>
          <div className={authFieldClass}>
            <IconLock className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <input
              id="reg-password"
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Password"
              className={authInputClass}
              required
            />
            <button
              type="button"
              className="shrink-0 rounded-md p-1.5 text-[#8b92a8] transition hover:bg-white/5 hover:text-white"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              <IconEye open={showPass} className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reg-password2" className="sr-only">
            Confirm Password
          </label>
          <div className={authFieldClass}>
            <IconLock className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <input
              id="reg-password2"
              name="confirmPassword"
              type={showPass2 ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm Password"
              className={authInputClass}
              required
            />
            <button
              type="button"
              className="shrink-0 rounded-md p-1.5 text-[#8b92a8] transition hover:bg-white/5 hover:text-white"
              onClick={() => setShowPass2((v) => !v)}
              aria-label={showPass2 ? "Hide password" : "Show password"}
            >
              <IconEye open={showPass2} className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 pt-0.5 text-[13px] leading-snug text-[#b8c0d0] sm:text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-[#2d3348] bg-[#0c0d12] text-[#007bff] focus:ring-2 focus:ring-[#007bff]/40"
            required
          />
          <span>
            I agree to the{" "}
            <Link href="/about-us" className="font-semibold text-[#007bff] hover:underline">
              Terms and Conditions
            </Link>
          </span>
        </label>

        <div
          className="flex gap-3 rounded-[11px] border border-amber-600/35 bg-gradient-to-br from-[#78350f]/55 to-[#451a03]/65 px-4 py-3.5 text-[13px] leading-relaxed text-amber-50/95 shadow-inner sm:text-sm"
          role="status"
        >
          <span className="mt-0.5 shrink-0 text-base" aria-hidden>
            ⚠
          </span>
          <p>reCAPTCHA failed to load. Please refresh the page or check your internet connection.</p>
        </div>

        <button type="submit" className={authPrimaryButtonClass}>
          Create Account
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] text-[#9aa3b8] sm:text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#007bff] hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
