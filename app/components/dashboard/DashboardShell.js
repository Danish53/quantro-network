"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopBar from "./DashboardTopBar";

export default function DashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#061018] via-[#0a1c2e] to-[#030a12] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.08),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(160deg, rgba(6,182,212,0.12) 0%, transparent 45%), linear-gradient(220deg, rgba(59,130,246,0.1) 0%, transparent 50%)",
        }}
        aria-hidden
      />

      {/* Mobile overlay */}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar: drawer on mobile, fixed column on desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-[min(100%,280px)] transform transition-transform duration-200 ease-out lg:static lg:z-0 lg:w-64 lg:shrink-0 lg:transform-none xl:w-72 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col lg:ml-0">
          <DashboardTopBar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
