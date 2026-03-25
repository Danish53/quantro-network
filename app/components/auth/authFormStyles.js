/** Shared Tailwind classes for login / register (match reference spacing & sizing). */

export const authCardClass =
  "w-full rounded-[20px] bg-[#161822]/[0.92] px-4 py-4 shadow-[0_32px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-xl sm:px-9 sm:py-11";

/** Tighter card + fields for long register form */
export const authRegisterCardClass =
  "w-full rounded-[18px] bg-[#161822]/[0.92] px-3 py-3 shadow-[0_24px_72px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-xl sm:px-6 sm:py-7";

export const authFieldClass =
  "flex min-h-[52px] items-center gap-2.5 rounded-[11px] border border-[#2d3348] bg-[#0c0d12]/90 px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-200 focus-within:border-[#007bff]/80 focus-within:ring-2 focus-within:ring-[#007bff]/25";

export const authRegisterFieldClass =
  "flex min-h-[44px] items-center gap-2 rounded-[10px] border border-[#2d3348] bg-[#0c0d12]/90 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-200 focus-within:border-[#007bff]/80 focus-within:ring-2 focus-within:ring-[#007bff]/25";

export const authInputClass =
  "min-w-0 flex-1 bg-transparent py-2 text-[15px] leading-snug text-white placeholder:text-[#8b92a8] outline-none";

export const authRegisterInputClass =
  "min-w-0 flex-1 bg-transparent py-1.5 text-[14px] leading-snug text-white placeholder:text-[#8b92a8] outline-none";

export const authFormStackClass = "flex flex-col gap-[12px]";

export const authRegisterFormStackClass = "flex flex-col gap-[10px]";

export const authPrimaryButtonClass =
  "mt-1 flex h-[52px] w-full items-center justify-center rounded-[11px] bg-[#007bff] text-[15px] font-semibold tracking-wide text-white shadow-[0_8px_24px_rgba(0,123,255,0.35)] transition hover:bg-[#1a86ff] hover:shadow-[0_10px_28px_rgba(0,123,255,0.42)] active:scale-[0.998]";

export const authRegisterPrimaryButtonClass =
  "group mt-0.5 flex h-[48px] w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#4f46e5] text-[15px] font-semibold tracking-wide text-white shadow-[0_8px_28px_rgba(37,99,235,0.38)] ring-1 ring-white/15 transition hover:from-[#3b82f6] hover:via-[#2563eb] hover:to-[#6366f1] hover:shadow-[0_12px_32px_rgba(37,99,235,0.45)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:from-[#2563eb] disabled:hover:via-[#1d4ed8] disabled:hover:to-[#4f46e5]";
