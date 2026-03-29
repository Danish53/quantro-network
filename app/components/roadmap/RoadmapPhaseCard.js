export default function RoadmapPhaseCard({ label, title, description, bullets, footer, side = "left" }) {
  return (
    <article
      className={`w-full max-w-xl rounded-2xl border border-white/10 bg-[#141235]/95 p-6 text-left shadow-xl sm:p-8 ${
        side === "left" ? "lg:mr-auto" : "lg:ml-auto"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400 sm:text-[13px]">{label}</p>
      <h3 className="mt-3 text-lg font-bold leading-snug text-white sm:text-xl">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{description}</p>
      <ul className="mt-5 space-y-2.5 text-sm text-slate-200 sm:text-[15px]">
        {bullets.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm font-bold leading-relaxed text-white sm:text-base">{footer}</p>
    </article>
  );
}
