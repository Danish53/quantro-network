import Link from "next/link";

/**
 * Dark auth backdrop: layered diagonal purple/blue gradients + soft glows.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060a] text-slate-100">
      {/* Base wash */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(76,29,149,0.35),transparent_50%)]"
        aria-hidden
      />
      {/* Diagonal streaks */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.85]"
        style={{
          background: `
            linear-gradient(125deg, rgba(124,58,237,0.18) 0%, transparent 38%),
            linear-gradient(210deg, rgba(37,99,235,0.14) 0%, transparent 42%),
            linear-gradient(160deg, transparent 40%, rgba(91,33,182,0.12) 100%)
          `,
        }}
        aria-hidden
      />
      {/* Soft orbs */}
      <div
        className="pointer-events-none absolute -left-[20%] top-[-10%] h-[55vh] w-[65vw] rounded-full bg-violet-600/[0.22] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[15%] top-[25%] h-[45vh] w-[55vw] rounded-full bg-indigo-600/[0.18] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-15%] left-[20%] h-[40vh] w-[50vw] rounded-full bg-blue-600/[0.15] blur-[110px]"
        aria-hidden
      />
      {/* Subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="mb-8 text-[13px] font-medium text-slate-500 transition hover:text-slate-300 sm:absolute sm:left-6 sm:top-7 sm:mb-0 lg:left-10 lg:top-9"
        >
          ← Back to home
        </Link>
        <div className="w-full max-w-[430px]">{children}</div>
      </div>
    </div>
  );
}
