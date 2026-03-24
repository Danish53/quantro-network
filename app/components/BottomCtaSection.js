export default function BottomCtaSection() {
  return (
    <section
      id="get-started"
      className="rounded-[24px] bg-[radial-gradient(circle_at_top,#6b63ff,#2f2f8d_70%)] p-8 text-center text-white sm:p-10"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Start Today</p>
      <h3 className="mt-2 text-3xl font-extrabold sm:text-4xl">Join Global AI Era Now</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
        Need help building your strategy stack? Our team is here to guide your onboarding and
        growth.
      </p>
      <button className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#2d2d82]">
        Contact support
      </button>
    </section>
  );
}
