"use client";

import dynamic from "next/dynamic";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[78px] items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] py-2">
      <span className="text-[12px] text-[#8b92a8]">Loading verification…</span>
    </div>
  ),
});

/** Google test key (always passes) — set NEXT_PUBLIC_RECAPTCHA_SITE_KEY for production. */
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

export default function AuthRecaptcha({ onChange, onExpired, onErrored }) {
  return (
    <div className="flex justify-center overflow-x-auto">
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        theme="dark"
        onChange={onChange}
        onExpired={onExpired}
        onErrored={onErrored}
      />
    </div>
  );
}
