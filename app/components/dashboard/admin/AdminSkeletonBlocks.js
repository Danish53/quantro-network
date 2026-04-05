"use client";

function Shimmer({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-white/[0.07] ${className}`} />;
}

export function AdminOverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-[10px] border border-white/[0.06] bg-[#141235]/80 p-4 ring-1 ring-white/[0.04] sm:p-5"
          >
            <Shimmer className="h-11 w-11 shrink-0 rounded-[10px]" />
            <div className="min-w-0 flex-1 space-y-2">
              <Shimmer className="h-7 w-24" />
              <Shimmer className="h-3.5 w-32 max-w-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-[10px] border border-white/[0.08] bg-[#141235]/90 p-5 ring-1 ring-white/[0.04] sm:p-6">
          <Shimmer className="mb-2 h-4 w-48" />
          <Shimmer className="mb-4 h-3 w-full max-w-md" />
          <div className="rounded-lg bg-[#0b0920]/80 p-4 ring-1 ring-white/[0.05]">
            <Shimmer className="h-[220px] w-full sm:h-[260px]" />
          </div>
        </div>
        <div className="rounded-[10px] border border-white/[0.08] bg-[#141235]/90 p-5 ring-1 ring-white/[0.04] sm:p-6">
          <Shimmer className="mb-2 h-4 w-56" />
          <Shimmer className="mb-4 h-3 w-full max-w-md" />
          <div className="mb-3 flex gap-4">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-3 w-28" />
          </div>
          <div className="rounded-lg bg-[#0b0920]/80 p-4 ring-1 ring-white/[0.05]">
            <Shimmer className="h-[220px] w-full sm:h-[260px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reusable table skeleton for admin data pages (column count + min width). */
export function AdminDataTableSkeleton({ cols = 8, minWidthClass = "min-w-[900px]", rowCount = 10 }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#141235] ring-1 ring-white/[0.04]">
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse ${minWidthClass}`}>
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#0F0D2E]/50">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-4 py-3.5 sm:px-5">
                  <Shimmer className="h-3 w-14" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, r) => (
              <tr key={r} className="border-b border-white/[0.05]">
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} className="px-4 py-3.5 sm:px-5">
                    <Shimmer className={`h-4 ${c === 0 ? "w-28" : "w-full max-w-[120px]"}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminWalletTransactionsTableSkeleton() {
  const cols = 8;
  return (
    <div className="overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#141235] ring-1 ring-white/[0.04]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#0F0D2E]/50">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-4 py-3.5 sm:px-5">
                  <Shimmer className="h-3 w-14" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, r) => (
              <tr key={r} className="border-b border-white/[0.05]">
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} className="px-4 py-3.5 sm:px-5">
                    <Shimmer
                      className={`h-4 ${
                        c === 0 ? "w-24" : c === 3 ? "w-20" : c === 7 ? "w-14" : "w-full max-w-[120px]"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminUsersTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#141235] ring-1 ring-white/[0.04]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#0F0D2E]/50">
              {Array.from({ length: 7 }).map((_, i) => (
                <th key={i} className="px-4 py-3.5 sm:px-5">
                  <Shimmer className="mx-0 h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, r) => (
              <tr key={r} className="border-b border-white/[0.05]">
                {Array.from({ length: 7 }).map((_, c) => (
                  <td key={c} className="px-4 py-3.5 sm:px-5">
                    <Shimmer className={`h-4 ${c === 6 ? "ml-auto w-20" : c === 0 ? "w-28" : "w-full max-w-[140px]"}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
