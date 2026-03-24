import Image from "next/image";
import { aboutImages } from "./aboutImages";

const bullets = [
  "Multiple strategy profiles for different objectives",
  "Transparent connection to verified market data",
  "Built-in safeguards and configurable parameters",
  "Designed for monitoring and iterative refinement",
];

export default function AboutAlgorithmsSection() {
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
        Advanced Trading Algorithms
      </h2>
      <div className="mt-8 grid gap-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1629]/95 p-6 shadow-xl sm:p-8 lg:mt-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10">
        <div className="order-2 text-left lg:order-1">
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            Our algorithms are engineered for disciplined automation: robust logic, careful validation,
            and tooling that helps members understand performance—not chase noise.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-200 sm:text-base">
            {bullets.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
          <div className="relative aspect-[6/5] w-full">
            <Image
              src={aboutImages.zenithProduct}
              alt="Advanced algorithms product visual"
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
