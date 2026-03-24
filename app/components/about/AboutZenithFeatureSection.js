import Image from "next/image";
import { aboutImages } from "./aboutImages";

const bullets = [
  "Institutional-style execution workflows",
  "Risk-aware parameters you control",
  "Real-time monitoring and analytics",
  "Designed for consistency across market conditions",
];

export default function AboutZenithFeatureSection() {
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
        Unlocking the Future of Algorithmic Trading
      </h2>
      <div className="mt-8 grid gap-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1629]/95 p-6 shadow-xl sm:p-8 lg:mt-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10">
        <div className="text-left">
          <h3 className="text-xl font-bold text-white sm:text-2xl">Quantro Zenith</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            Zenith is our flagship automation layer—built to coordinate signals, execution logic, and
            safeguards in one cohesive system so members can deploy strategies with confidence.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-200 sm:text-base">
            {bullets.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[6/5] w-full">
            <Image
              src={aboutImages.zenithProduct}
              alt="Quantro Zenith product"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
