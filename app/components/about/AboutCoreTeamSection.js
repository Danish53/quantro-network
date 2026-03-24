const columns = [
  {
    title: "Financial Modeling",
    items: ["Scenario planning", "Risk-adjusted metrics", "Portfolio-level views", "Reporting clarity"],
  },
  {
    title: "Algorithmic Trading",
    items: ["Execution logic", "Signal validation", "Live monitoring", "Iteration workflows"],
  },
  {
    title: "Data & Infrastructure",
    items: ["Connectivity", "Integrity checks", "Operational monitoring", "Scalable architecture"],
  },
  {
    title: "Member Success",
    items: ["Onboarding guidance", "Education tracks", "Support workflows", "Account transparency"],
  },
];

export default function AboutCoreTeamSection() {
  return (
    <section>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">The Core Team</h2>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300 sm:text-base">
          Expertise in Finance
        </p>
      </div>
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#0f1629]/95 p-6 shadow-xl sm:p-8 lg:mt-10 lg:p-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-base font-bold text-white sm:text-lg">{col.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald-400" aria-hidden>
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
