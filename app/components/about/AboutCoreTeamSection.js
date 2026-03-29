"use client";
import { useSiteTranslation } from "../SiteTranslationProvider";

const columnKeys = [
  { title: "about.team.c1_title", items: ["about.team.c1_i0", "about.team.c1_i1", "about.team.c1_i2", "about.team.c1_i3"] },
  { title: "about.team.c2_title", items: ["about.team.c2_i0", "about.team.c2_i1", "about.team.c2_i2", "about.team.c2_i3"] },
  { title: "about.team.c3_title", items: ["about.team.c3_i0", "about.team.c3_i1", "about.team.c3_i2", "about.team.c3_i3"] },
  { title: "about.team.c4_title", items: ["about.team.c4_i0", "about.team.c4_i1", "about.team.c4_i2", "about.team.c4_i3"] },
];

export default function AboutCoreTeamSection() {
  const { t } = useSiteTranslation();
  return (
    <section>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{t("about.team.title")}</h2>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300 sm:text-base">
          {t("about.team.subtitle")}
        </p>
      </div>
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#141235]/95 p-6 shadow-xl sm:p-8 lg:mt-10 lg:p-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {columnKeys.map((col) => (
            <div key={col.title}>
              <h3 className="text-base font-bold text-white sm:text-lg">{t(col.title)}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald-400" aria-hidden>
                      ✓
                    </span>
                    <span>{t(item)}</span>
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
