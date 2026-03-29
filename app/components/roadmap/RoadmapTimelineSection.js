"use client";

import { useSiteTranslation } from "../SiteTranslationProvider";
import { ROADMAP_PHASE_COUNT } from "./roadmapPhases";
import RoadmapPhaseCard from "./RoadmapPhaseCard";

export default function RoadmapTimelineSection() {
  const { t } = useSiteTranslation();
  const roadmapPhases = Array.from({ length: ROADMAP_PHASE_COUNT }, (_, i) => {
    const phase = i + 1;
    return {
      id: `phase-${phase}`,
      label: t(`roadmap.phase${phase}.label`),
      title: t(`roadmap.phase${phase}.title`),
      description: t(`roadmap.phase${phase}.desc`),
      bullets: [0, 1, 2, 3].map((b) => t(`roadmap.phase${phase}.b${b}`)),
      footer: t(`roadmap.phase${phase}.footer`),
    };
  });
  return (
    <section aria-labelledby="roadmap-timeline-heading">
      <h2 id="roadmap-timeline-heading" className="sr-only">
        {t("roadmap.timeline_sr")}
      </h2>
      <div className="relative">
        {/* Mobile + desktop: vertical guide; centered on large screens */}
        <div
          className="pointer-events-none absolute bottom-0 left-[13px] top-0 w-px bg-gradient-to-b from-violet-500/80 via-indigo-500/70 to-violet-600/80 lg:left-1/2 lg:-translate-x-1/2"
          aria-hidden
        />

        <div className="space-y-10 sm:space-y-12 lg:space-y-16">
          {roadmapPhases.map((phase, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={phase.id}
                className="relative grid grid-cols-1 items-center gap-4 pl-9 lg:grid-cols-2 lg:gap-10 lg:pl-0"
              >
                {/* Node on the timeline */}
                <div
                  className="absolute left-[13px] top-8 z-10 size-3.5 -translate-x-1/2 rounded-full border-[3px] border-[#0D0B29] bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)] lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2"
                  aria-hidden
                />

                {isLeft ? (
                  <>
                    <div className="lg:flex lg:justify-end lg:pr-8 xl:pr-12">
                      <RoadmapPhaseCard
                        label={phase.label}
                        title={phase.title}
                        description={phase.description}
                        bullets={phase.bullets}
                        footer={phase.footer}
                        side="left"
                      />
                    </div>
                    <div className="hidden min-h-[1px] lg:block" aria-hidden />
                  </>
                ) : (
                  <>
                    <div className="hidden min-h-[1px] lg:block" aria-hidden />
                    <div className="lg:flex lg:justify-start lg:pl-8 xl:pl-12">
                      <RoadmapPhaseCard
                        label={phase.label}
                        title={phase.title}
                        description={phase.description}
                        bullets={phase.bullets}
                        footer={phase.footer}
                        side="right"
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
