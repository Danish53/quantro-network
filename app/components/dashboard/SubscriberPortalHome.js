"use client";

import { useMemo } from "react";
import { useSiteTranslation } from "../SiteTranslationProvider";

const CHART_MONTH_KEYS = [
  "dash.month_oct",
  "dash.month_nov",
  "dash.month_dec",
  "dash.month_jan",
  "dash.month_feb",
  "dash.month_mar",
];

/** Subscriber Portal dashboard — layout aligned with Quantro Network member UI. */
export default function SubscriberPortalHome() {
  const { t } = useSiteTranslation();

  const monthLabels = useMemo(() => CHART_MONTH_KEYS.map((k) => t(k)), [t]);

  const stats = useMemo(
    () => [
      { value: "$0.00", labelKey: "dash.stat_ea_wallet", icon: "wallet" },
      { value: "$0.00", labelKey: "dash.stat_qn_wallet", icon: "stack" },
      { value: "$0.00", labelKey: "dash.stat_subscription_total", icon: "trend" },
      { value: "$0.00", labelKey: "dash.stat_total_withdrawals", icon: "bolt" },
    ],
    []
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">{t("dash.home_title")}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <div
            key={card.labelKey}
            className="flex items-center gap-4 rounded-[10px] border border-white/[0.08] bg-[#141235] p-4 shadow-sm ring-1 ring-white/[0.04] sm:p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#6366f1]/20 text-[#a5b4fc] ring-1 ring-[#6366f1]/30">
              <StatMiniIcon name={card.icon} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">{card.value}</p>
              <p className="text-xs text-slate-400 sm:text-sm">{t(card.labelKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartPanel
          title={t("dash.chart_deposits")}
          footer={t("dash.chart_dummy_jul_dec")}
          infoLabel={t("dash.chart_info")}
          downloadLabel={t("dash.chart_download")}
          legend={
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 sm:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#3b82f6]" aria-hidden />
                {t("dash.chart_legend_deposits")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ef4444]" aria-hidden />
                {t("dash.chart_legend_withdrawals")}
              </span>
            </div>
          }
        >
          <DualLineChartPlaceholder monthLabels={monthLabels} />
        </ChartPanel>
        <ChartPanel
          title={t("dash.chart_monthly")}
          footer={t("dash.chart_dummy_bars")}
          infoLabel={t("dash.chart_info")}
          downloadLabel={t("dash.chart_download")}
          legend={
            <div className="mt-3 flex flex-wrap gap-4 border-t border-white/[0.08] pt-3 text-[11px] text-slate-400">
              <span>
                <span className="text-slate-500">{t("dash.monthly_current_label")}: </span>
                <span className="font-medium text-slate-100">$0.00</span>
              </span>
              <span>
                <span className="text-slate-500">{t("dash.monthly_total_label")}: </span>
                <span className="font-medium text-slate-100">$0.00</span>
              </span>
            </div>
          }
        >
          <BarChartPlaceholder monthLabels={monthLabels} />
        </ChartPanel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-[10px] border border-white/[0.08] bg-[#141235] p-4 shadow-sm ring-1 ring-white/[0.04] sm:p-5">
          <h2 className="text-sm font-semibold text-slate-100 sm:text-base">{t("dash.card_subscription_summary")}</h2>
          <div className="mt-4 min-h-[120px] rounded-[8px] border border-dashed border-white/[0.1] bg-[#0F0D2E]/40" />
        </section>
        <section className="rounded-[10px] border border-white/[0.08] bg-[#141235] p-4 shadow-sm ring-1 ring-white/[0.04] sm:p-5">
          <h2 className="text-sm font-semibold text-slate-100 sm:text-base">{t("dash.card_monthly_earnings_trend")}</h2>
          <div className="mt-4 min-h-[120px] rounded-[8px] border border-dashed border-white/[0.1] bg-[#0F0D2E]/40" />
        </section>
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#5C5AFF] text-white shadow-lg shadow-indigo-500/30 transition hover:bg-[#4b49eb]"
        aria-label={t("dash.chat_support")}
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

function ChartPanel({ title, footer, infoLabel, downloadLabel, legend, children }) {
  return (
    <section className="rounded-[10px] border border-white/[0.08] bg-[#141235] p-4 shadow-sm ring-1 ring-white/[0.04] sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-100 sm:text-base">{title}</h2>
        <div className="flex gap-1 text-slate-400">
          <button type="button" className="rounded p-1 hover:bg-white/[0.08] hover:text-slate-100" aria-label={infoLabel}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </button>
          <button type="button" className="rounded p-1 hover:bg-white/[0.08] hover:text-slate-100" aria-label={downloadLabel}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>
      </div>
      <div className="relative min-h-[200px] rounded-[8px] bg-[#0F0D2E]/40 p-2 sm:min-h-[240px]">{children}</div>
      {footer ? <p className="mt-2 text-[11px] text-slate-500">{footer}</p> : null}
      {legend}
    </section>
  );
}

function DualLineChartPlaceholder({ monthLabels }) {
  const n = monthLabels.length;
  const w = 400;
  const padL = 36;
  const padR = 12;
  const padT = 16;
  const padB = 28;
  const gw = w - padL - padR;
  const gh = 140;
  const xAt = (i) => padL + (i / (n - 1)) * gw;
  const yDep = [125, 118, 122, 95, 72, 88];
  const yWdr = [132, 128, 115, 102, 98, 105];
  const path = (ys) =>
    ys.map((y, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} 190`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={padL}
          y1={padT + (i * gh) / 4}
          x2={w - padR}
          y2={padT + (i * gh) / 4}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
        />
      ))}
      <text x="6" y={padT + 4} fill="#64748b" fontSize="10">
        $10
      </text>
      <text x="6" y={padT + gh * 0.25 + 4} fill="#64748b" fontSize="10">
        $5
      </text>
      <text x="6" y={padT + gh * 0.5 + 4} fill="#64748b" fontSize="10">
        $2.5
      </text>
      <text x="6" y={padT + gh * 0.75 + 4} fill="#64748b" fontSize="10">
        $1
      </text>
      <text x="6" y={padT + gh + 4} fill="#64748b" fontSize="10">
        $0
      </text>
      {monthLabels.map((m, i) => (
        <text key={m} x={xAt(i)} y="182" fill="#64748b" fontSize="10" textAnchor="middle">
          {m}
        </text>
      ))}
      <path d={path(yDep)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
      <path d={path(yWdr)} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function BarChartPlaceholder({ monthLabels }) {
  const bars = [
    { i: 0, h: 28 },
    { i: 1, h: 42 },
    { i: 2, h: 35 },
    { i: 3, h: 55 },
    { i: 4, h: 48 },
    { i: 5, h: 62 },
  ];
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <text x="8" y="16" fill="#64748b" fontSize="11">
        $1
      </text>
      <text x="8" y="100" fill="#64748b" fontSize="11">
        $0.5
      </text>
      <text x="8" y="184" fill="#64748b" fontSize="11">
        $0
      </text>
      {bars.map((b) => (
        <g key={b.i}>
          <text x={36 + b.i * 58} y="195" fill="#64748b" fontSize="10" textAnchor="middle">
            {monthLabels[b.i]}
          </text>
          <rect
            x={22 + b.i * 58}
            y={170 - b.h * 1.35}
            width="32"
            height={b.h * 1.35}
            rx="4"
            fill="#5C5AFF"
            fillOpacity="0.85"
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
