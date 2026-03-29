"use client";

import { useSiteTranslation } from "../SiteTranslationProvider";

const VALUE_KEYS = [
  { titleKey: "about.values.transparency.title", bodyKey: "about.values.transparency.body" },
  { titleKey: "about.values.security.title", bodyKey: "about.values.security.body" },
  { titleKey: "about.values.performance.title", bodyKey: "about.values.performance.body" },
];

const cardClass =
  "rounded-2xl border border-white/10 bg-[#141235]/95 p-6 text-left shadow-lg sm:p-8";

export default function AboutCoreValuesSection() {
  const { t } = useSiteTranslation();
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{t("about.values.section_title")}</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-10 lg:gap-8">
        {VALUE_KEYS.map((item) => (
          <article key={item.titleKey} className={cardClass}>
            <h3 className="text-lg font-bold text-white sm:text-xl">{t(item.titleKey)}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{t(item.bodyKey)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
