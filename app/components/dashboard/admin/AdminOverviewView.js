"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useSiteTranslation } from "@/app/components/SiteTranslationProvider";
import { AdminOverviewSkeleton } from "./AdminSkeletonBlocks";

function fmtUsd(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
    Number(n) || 0,
  );
}

function fmtInt(n) {
  return new Intl.NumberFormat(undefined).format(Number(n) || 0);
}

function fmtAxisUsd(n) {
  const v = Number(n) || 0;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 10_000) return `$${(v / 1000).toFixed(0)}k`;
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${Math.round(v)}`;
}

/** New members over time — area + line, grid, live data. */
function UsersTrendChart({ title, hint, labels, values }) {
  const gradId = useId().replace(/:/g, "");
  const nums = values.map((v) => Number(v) || 0);
  const n = Math.max(labels.length, 1);
  const maxVal = Math.max(1, ...nums);
  const tickMax = Math.max(1, Math.ceil(maxVal * 1.08));

  const w = 720;
  const h = 280;
  const padL = 48;
  const padR = 24;
  const padT = 20;
  const padB = 48;
  const gw = w - padL - padR;
  const gh = h - padT - padB;

  const xAt = (i) => {
    if (n <= 1) return padL + gw / 2;
    return padL + (i / (n - 1)) * gw;
  };
  const yAt = (v) => padT + gh - (v / tickMax) * gh;
  const baseY = padT + gh;

  let areaD = "";
  let lineD = "";
  if (n >= 2) {
    lineD = nums.map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(" ");
    areaD = `M ${xAt(0).toFixed(1)} ${baseY} L ${nums.map((v, i) => `${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(" L ")} L ${xAt(n - 1).toFixed(1)} ${baseY} Z`;
  } else if (n === 1) {
    const x = xAt(0);
    const y = yAt(nums[0]);
    areaD = `M ${(x - 32).toFixed(1)} ${baseY} L ${x.toFixed(1)} ${y.toFixed(1)} L ${(x + 32).toFixed(1)} ${baseY} Z`;
  }

  const gridT = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className="rounded-[10px] border border-white/[0.08] bg-[#141235] p-4 shadow-sm ring-1 ring-white/[0.04] sm:p-6">
      <div className="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-sm font-semibold text-slate-100 sm:text-base">{title}</h2>
        <p className="text-[11px] text-slate-500">{hint}</p>
      </div>
      <div className="mt-4 rounded-lg bg-[#0b0920]/80 p-2 ring-1 ring-white/[0.05] sm:p-3">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-[220px] w-full sm:h-[260px]"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id={`g-${gradId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {gridT.map((t) => {
            const y = padT + t * gh;
            return (
              <line
                key={t}
                x1={padL}
                y1={y}
                x2={padL + gw}
                y2={y}
                stroke="rgba(148,163,184,0.1)"
                strokeWidth="1"
              />
            );
          })}
          {[1, 0.75, 0.5, 0.25, 0].map((t, idx) => {
            const val = Math.round(tickMax * t);
            const y = padT + (1 - t) * gh + 4;
            return (
              <text key={idx} x="6" y={y} fill="#64748b" fontSize="11" fontFamily="system-ui,sans-serif">
                {val}
              </text>
            );
          })}
          {areaD ? <path d={areaD} fill={`url(#g-${gradId})`} /> : null}
          {lineD ? (
            <path
              d={lineD}
              fill="none"
              stroke="#a5b4fc"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          {n === 1 ? (
            <circle cx={xAt(0)} cy={yAt(nums[0])} r="7" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" />
          ) : (
            nums.map((v, i) => (
              <circle
                key={i}
                cx={xAt(i)}
                cy={yAt(v)}
                r="4.5"
                fill="#0F0D2E"
                stroke="#e0e7ff"
                strokeWidth="2"
              />
            ))
          )}
          {labels.map((lab, i) => (
            <text
              key={`${i}-${lab}`}
              x={xAt(i)}
              y={h - 14}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="middle"
              fontFamily="system-ui,sans-serif"
            >
              {lab}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}

/** Deposits vs withdrawals — dual line, shared scale. */
function FundsFlowChart({ title, hint, labels, deposits, withdrawals, legendDep, legendWdr }) {
  const dep = deposits.map((v) => Number(v) || 0);
  const wdr = withdrawals.map((v) => Number(v) || 0);
  const n = Math.max(labels.length, 1);
  const maxVal = Math.max(0.01, ...dep, ...wdr);
  const tickMax = maxVal * 1.06;

  const w = 720;
  const h = 280;
  const padL = 52;
  const padR = 24;
  const padT = 20;
  const padB = 48;
  const gw = w - padL - padR;
  const gh = h - padT - padB;

  const xAt = (i) => {
    if (n <= 1) return padL + gw / 2;
    return padL + (i / (n - 1)) * gw;
  };
  const yAt = (v) => padT + gh - (v / tickMax) * gh;

  const pathFor = (arr) => {
    if (n <= 1) return "";
    return arr.map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(" ");
  };
  const dDep = pathFor(dep);
  const dWdr = pathFor(wdr);

  const gridT = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className="rounded-[10px] border border-white/[0.08] bg-[#141235] p-4 shadow-sm ring-1 ring-white/[0.04] sm:p-6">
      <div className="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-sm font-semibold text-slate-100 sm:text-base">{title}</h2>
        <p className="text-[11px] text-slate-500">{hint}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-[#3b82f6]" />
          {legendDep}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-[#f97316]" />
          {legendWdr}
        </span>
      </div>
      <div className="mt-4 rounded-lg bg-[#0b0920]/80 p-2 ring-1 ring-white/[0.05] sm:p-3">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-[220px] w-full sm:h-[260px]"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          {gridT.map((t) => {
            const y = padT + t * gh;
            return (
              <line
                key={t}
                x1={padL}
                y1={y}
                x2={padL + gw}
                y2={y}
                stroke="rgba(148,163,184,0.1)"
                strokeWidth="1"
              />
            );
          })}
          {[1, 0.75, 0.5, 0.25, 0].map((t, idx) => {
            const val = tickMax * t;
            const y = padT + (1 - t) * gh + 4;
            return (
              <text key={idx} x="4" y={y} fill="#64748b" fontSize="10" fontFamily="system-ui,sans-serif">
                {fmtAxisUsd(val)}
              </text>
            );
          })}
          {dDep ? (
            <path
              d={dDep}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          {dWdr ? (
            <path
              d={dWdr}
              fill="none"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          {n === 1 ? (
            <>
              <circle cx={xAt(0)} cy={yAt(dep[0])} r="6" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
              <circle cx={xAt(0)} cy={yAt(wdr[0])} r="6" fill="#431407" stroke="#f97316" strokeWidth="2" />
            </>
          ) : (
            <>
              {dep.map((v, i) => (
                <circle key={`d-${i}`} cx={xAt(i)} cy={yAt(v)} r="3.5" fill="#0F0D2E" stroke="#60a5fa" strokeWidth="1.5" />
              ))}
              {wdr.map((v, i) => (
                <circle key={`w-${i}`} cx={xAt(i)} cy={yAt(v)} r="3.5" fill="#0F0D2E" stroke="#fb923c" strokeWidth="1.5" />
              ))}
            </>
          )}
          {labels.map((lab, i) => (
            <text
              key={`${i}-${lab}`}
              x={xAt(i)}
              y={h - 14}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="middle"
              fontFamily="system-ui,sans-serif"
            >
              {lab}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}

export default function AdminOverviewView() {
  const { t } = useSiteTranslation();
  const [range, setRange] = useState("7d");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/overview?range=${range}`, { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof json.error === "string" ? json.error : t("admin.load_error"));
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setErr(t("admin.load_error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [range, t]);

  useEffect(() => {
    load();
  }, [load]);

  const ranges = [
    { id: "7d", labelKey: "admin.range_7d" },
    { id: "8w", labelKey: "admin.range_8w" },
    { id: "12m", labelKey: "admin.range_12m" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">{t("admin.home_title")}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">{t("admin.home_subtitle")}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1 rounded-lg border border-white/[0.08] bg-[#141235]/80 p-1">
          {ranges.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                range === r.id ? "bg-[#6366f1] text-white" : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
              }`}
            >
              {t(r.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {err ? (
        <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {err}{" "}
          <button type="button" className="ml-2 font-semibold underline" onClick={load}>
            {t("admin.retry")}
          </button>
        </div>
      ) : null}

      {!err && loading ? <AdminOverviewSkeleton /> : null}
      {!err && !loading && data ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={t("admin.stat_total_users")} value={fmtInt(data.stats.totalUsers)} icon={<IconUsers />} />
            <StatCard label={t("admin.stat_total_deposits")} value={fmtUsd(data.stats.totalDepositsUsd)} icon={<IconDown />} />
            <StatCard label={t("admin.stat_total_withdrawals")} value={fmtUsd(data.stats.totalWithdrawalsUsd)} icon={<IconUp />} />
            <StatCard label={t("admin.stat_pending_kyc")} value={fmtInt(data.stats.pendingKyc)} icon={<IconDoc />} />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <UsersTrendChart
              title={t("admin.chart_new_users")}
              hint={t("admin.chart_new_users_hint")}
              labels={data.labels}
              values={data.series.newUsers}
            />
            <FundsFlowChart
              title={t("admin.chart_flow_title")}
              hint={t("admin.chart_flow_hint")}
              labels={data.labels}
              deposits={data.series.deposits}
              withdrawals={data.series.withdrawals}
              legendDep={t("admin.legend_deposits")}
              legendWdr={t("admin.legend_withdrawals")}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 rounded-[10px] border border-white/[0.08] bg-[#141235] p-4 shadow-sm ring-1 ring-white/[0.04] sm:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#6366f1]/20 text-[#a5b4fc] ring-1 ring-[#6366f1]/30">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold tabular-nums tracking-tight text-slate-100 sm:text-xl">{value}</p>
        <p className="text-xs text-slate-400 sm:text-sm">{label}</p>
      </div>
    </div>
  );
}

function IconUsers() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function IconDown() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  );
}

function IconUp() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}
