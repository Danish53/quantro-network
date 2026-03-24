const cardClass =
  "rounded-2xl border border-white/10 bg-[#0f1629]/95 p-6 text-left shadow-lg sm:p-8";

export default function AboutMissionVision() {
  return (
    <section>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <article className={cardClass}>
          <h2 className="text-xl font-bold text-white sm:text-2xl">Our mission</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            To democratize access to professional-grade trading technology and education—giving every
            member a clear path from onboarding to execution with tools built for clarity, speed, and
            long-term performance.
          </p>
        </article>
        <article className={cardClass}>
          <h2 className="text-xl font-bold text-white sm:text-2xl">Our vision</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            A global membership ecosystem where verified data, disciplined automation, and continuous
            learning work together—so wealth creation is systematic, transparent, and accessible to
            serious operators worldwide.
          </p>
        </article>
      </div>
    </section>
  );
}
