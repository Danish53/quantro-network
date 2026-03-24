"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLogo from "./AuthLogo";
import { IconAt, IconEye, IconLock } from "./AuthIcons";
import {
  authCardClass,
  authFieldClass,
  authFormStackClass,
  authInputClass,
  authPrimaryButtonClass,
} from "./authFormStyles";

export default function LoginForm() {
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={authCardClass}>
      <AuthLogo />
      <p className="mb-8 text-center text-[13px] leading-relaxed text-[#9aa3b8] sm:text-sm">
        Please enter your credentials to login
      </p>

      <form onSubmit={handleSubmit} className={authFormStackClass}>
        <div>
          <label htmlFor="login-email" className="sr-only">
            Email Address
          </label>
          <div className={authFieldClass}>
            <IconAt className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <input
              id="login-email"
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
          <label htmlFor="login-password" className="sr-only">
            Password
          </label>
          <div className={authFieldClass}>
            <IconLock className="h-[22px] w-[22px] shrink-0 text-[#8b92a8]" />
            <input
              id="login-password"
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
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
          Login
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] text-[#9aa3b8] sm:text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#007bff] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
