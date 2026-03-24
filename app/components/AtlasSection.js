export default function AtlasSection() {
  return (
    <section className="grid gap-5 md:grid-cols-2">
      <article className="rounded-[24px] bg-[#0b1255] p-5 text-white">
        <div className="h-64 rounded-2xl bg-[linear-gradient(160deg,#111f74,#090f3f)] p-4">
          <div className="h-full rounded-xl border border-white/20 bg-white/5 p-3">
            <div className="h-2 w-20 rounded-full bg-white/60" />
            <div className="mt-3 space-y-2">
              <div className="h-2 rounded bg-white/20" />
              <div className="h-2 rounded bg-white/20" />
              <div className="h-2 rounded bg-white/20" />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-[24px] bg-white p-7 ring-1 ring-slate-200">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">Quantro Atlas</p>
        <h3 className="text-2xl font-bold leading-tight text-[#111827]">
          Live, verifiable data streams directly from global markets
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Institutional-grade data flows with transparent monitoring and confidence scoring.
        </p>
        <button className="mt-6 rounded-full bg-[#5f5eff] px-5 py-2 text-sm font-semibold text-white">
          Explore now
        </button>
      </article>
    </section>
  );
}
