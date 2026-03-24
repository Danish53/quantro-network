import Image from "next/image";
import { aboutImages } from "./aboutImages";

const cardClass =
  "rounded-2xl border border-white/10 bg-[#0f1629]/95 p-6 text-left shadow-lg sm:p-8";

export default function AboutPlatformDetailsSection() {
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
        Who is the team behind the Platform
      </h2>
      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-8">
        <article className={cardClass}>
          <h3 className="text-lg font-bold text-white sm:text-xl">24/7 Operating Hours</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            Markets never sleep—and neither does our infrastructure. Our systems are engineered for
            continuous operation with monitoring designed to keep your workflows online when it matters
            most.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-slate-200">
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> Global uptime practices
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> Operational transparency
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span> Rapid incident response workflows
            </li>
          </ul>
        </article>
        <article className={cardClass}>
          <h3 className="text-lg font-bold text-white sm:text-xl">Scalable and Secure</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            Security and scale go hand in hand: we architect for growth without compromising the
            fundamentals—permissions, integrity, and member control.
          </p>
          <div className="relative mt-6 aspect-[16/10] w-full max-w-xs overflow-hidden rounded-lg border border-white/10">
            <Image
              src={aboutImages.scalableThumb}
              alt="Platform scalability preview"
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
