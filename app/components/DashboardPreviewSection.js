export default function DashboardPreviewSection() {
  return (
    <section className="relative rounded-[28px] bg-gradient-to-b from-[#e6f2ff] via-[#dcecff] to-[#eff4ff] p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-4 bottom-8 h-14 w-14 rounded-full bg-violet-300/50 blur-xl" />
      <div className="pointer-events-none absolute -right-4 top-8 h-16 w-16 rounded-full bg-sky-300/40 blur-xl" />

      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#8cb2ff]/40 bg-[#0b1741] shadow-[0_30px_80px_rgba(12,22,70,0.35)]">
        <div className="grid grid-cols-12 gap-0">
          <aside className="col-span-4 border-r border-white/10 bg-[#101f4d] p-4 text-white">
            <div className="h-2 w-20 rounded-full bg-white/60" />
            <div className="mt-4 space-y-2">
              <div className="h-2 rounded bg-white/30" />
              <div className="h-2 rounded bg-white/20" />
              <div className="h-2 rounded bg-white/20" />
              <div className="h-2 rounded bg-white/20" />
            </div>
          </aside>
          <div className="col-span-8 bg-[radial-gradient(circle_at_top,#2ac4ff55,transparent_45%),linear-gradient(160deg,#0f2d75,#0b1536)] p-4">
            <div className="h-40 rounded-xl border border-cyan-300/40 bg-cyan-200/10" />
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="h-16 rounded-lg border border-white/15 bg-white/5" />
              <div className="h-16 rounded-lg border border-white/15 bg-white/5" />
              <div className="h-16 rounded-lg border border-white/15 bg-white/5" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        <span className="h-1.5 w-8 rounded-full bg-violet-500" />
        <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
      </div>
    </section>
  );
}
