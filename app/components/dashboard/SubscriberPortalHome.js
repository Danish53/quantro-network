/** Dummy Subscriber Portal dashboard (stats + chart placeholders). */
export default function SubscriberPortalHome() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Subscriber Portal</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { value: "$596.80", label: "EA License Wallet", icon: "wallet" },
          { value: "$9.5K", label: "Quantro Network Wallet", icon: "stack" },
          { value: "$1.2K", label: "Monthly Earnings", icon: "trend" },
          { value: "12", label: "Active EAs", icon: "bolt" },
        ].map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-lg backdrop-blur-md sm:p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20">
              <StatMiniIcon name={card.icon} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">{card.value}</p>
              <p className="text-xs text-slate-400 sm:text-sm">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartPanel title="Deposits and Withdrawals" footer="Dummy data — Jul–Dec">
          <AreaChartPlaceholder />
        </ChartPanel>
        <ChartPanel title="Monthly Licence Earning" footer="Dummy data — bars by month">
          <BarChartPlaceholder />
        </ChartPanel>
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
        aria-label="Chat support"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m9 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M9.75 21h3.75a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0013.5 4.5h-6a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 007.5 21z"
          />
        </svg>
      </button>
    </div>
  );
}

function ChartPanel({ title, footer, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-xl backdrop-blur-md sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-white sm:text-base">{title}</h2>
        <div className="flex gap-1 text-slate-500">
          <button type="button" className="rounded p-1 hover:bg-white/10 hover:text-white" aria-label="Info">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </button>
          <button type="button" className="rounded p-1 hover:bg-white/10 hover:text-white" aria-label="Download">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>
      </div>
      <div className="relative min-h-[200px] rounded-xl bg-black/20 p-2 sm:min-h-[240px]">{children}</div>
      <p className="mt-2 text-[11px] text-slate-500">{footer}</p>
    </section>
  );
}

function AreaChartPlaceholder() {
  return (
    <svg viewBox="0 0 400 180" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <text x="8" y="16" fill="#64748b" fontSize="11">
        $800
      </text>
      <text x="8" y="90" fill="#64748b" fontSize="11">
        $400
      </text>
      <text x="8" y="164" fill="#64748b" fontSize="11">
        $0
      </text>
      {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
        <text key={m} x={48 + i * 58} y="175" fill="#64748b" fontSize="10" textAnchor="middle">
          {m}
        </text>
      ))}
      <path
        d="M 48 140 L 106 120 L 164 130 L 222 90 L 280 40 L 338 55"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
      />
      <path
        d="M 48 140 L 106 120 L 164 130 L 222 90 L 280 40 L 338 55 L 338 170 L 48 170 Z"
        fill="url(#areaFill)"
      />
    </svg>
  );
}

function BarChartPlaceholder() {
  const bars = [
    { m: "Jul", h: 40 },
    { m: "Aug", h: 55 },
    { m: "Sep", h: 35 },
    { m: "Oct", h: 70 },
    { m: "Nov", h: 95 },
    { m: "Dec", h: 88 },
  ];
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <text x="8" y="16" fill="#64748b" fontSize="11">
        $450
      </text>
      <text x="8" y="100" fill="#64748b" fontSize="11">
        $225
      </text>
      <text x="8" y="184" fill="#64748b" fontSize="11">
        $0
      </text>
      {bars.map((b, i) => (
        <g key={b.m}>
          <text x={36 + i * 58} y="195" fill="#64748b" fontSize="10" textAnchor="middle">
            {b.m}
          </text>
          <rect
            x={22 + i * 58}
            y={170 - b.h * 1.4}
            width="32"
            height={b.h * 1.4}
            rx="4"
            fill="#22d3ee"
            fillOpacity="0.75"
          />
        </g>
      ))}
    </svg>
  );
}

function StatMiniIcon({ name }) {
  if (name === "wallet") {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 003 18v-6m18 0V9M3 12V9m0 0a2.25 2.25 0 012.25-2.25H18.75A2.25 2.25 0 0121 9v3M3 9v3" />
      </svg>
    );
  }
  if (name === "stack") {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0v.878a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 7.756v-.878m-12 0V18a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 18V7.756" />
      </svg>
    );
  }
  if (name === "trend") {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    );
  }
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}
