"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { dashboardNavSections } from "./dashboardNav";
import { useSiteTranslation } from "../SiteTranslationProvider";

/** Reusable “Navigate” menu (Fund, Profile, etc.). */
export default function DashboardNavigateDropdown() {
  const { t } = useSiteTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const quickLinks = dashboardNavSections.flatMap((s) => s.items);

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-[#141235] px-3 py-2 text-sm font-medium text-slate-200 shadow-sm transition hover:border-white/20 hover:bg-white/[0.04]"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
        {t("dash.fund.navigate")}
        <svg className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
          />
        </svg>
      </button>
      {open ? (
        <ul
          className="dashboard-sidebar-scroll absolute right-0 z-30 mt-2 max-h-72 w-56 overflow-auto rounded-[10px] border border-white/[0.1] bg-[#141235] py-1 shadow-lg ring-1 ring-black/25"
          role="menu"
        >
          {quickLinks.map((item) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                role="menuitem"
                className="block px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                onClick={() => setOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
