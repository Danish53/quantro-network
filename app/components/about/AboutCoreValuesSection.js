const values = [
  {
    title: "Transparency",
    body:
      "Clear processes, honest communication, and tooling that helps you understand what is happening in your account—without unnecessary noise.",
  },
  {
    title: "Security",
    body:
      "Industry-aligned practices for accounts and integrations, with controls designed to help you operate confidently as you scale.",
  },
  {
    title: "Performance",
    body:
      "Automation and analytics built for disciplined execution—so you can measure outcomes, refine parameters, and stay focused on strategy.",
  },
];

const cardClass =
  "rounded-2xl border border-white/10 bg-[#0f1629]/95 p-6 text-left shadow-lg sm:p-8";

export default function AboutCoreValuesSection() {
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">What we stand for</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-10 lg:gap-8">
        {values.map((item) => (
          <article key={item.title} className={cardClass}>
            <h3 className="text-lg font-bold text-white sm:text-xl">{item.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
