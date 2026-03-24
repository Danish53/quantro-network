import Link from "next/link";

export default function RoadmapCtaBanner() {
  return (
    <section
      className="rounded-2xl border border-violet-500/25 bg-gradient-to-r from-[#151a33] via-[#1a1f3d] to-[#12172e] px-5 py-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:px-8 sm:py-10"
      aria-label="Get started call to action"
    >
      <div className="flex flex-col items-stretch justify-between gap-6 lg:flex-row lg:items-center">
        <p className="max-w-xl text-base font-medium leading-relaxed text-slate-100 sm:text-lg">
          Ready to get started? Explore our products and services for free today.
        </p>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/get-started"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-[#0f172a] transition hover:bg-slate-100"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-white/70 bg-transparent px-8 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            Open App
          </Link>
        </div>
      </div>
    </section>
  );
}
