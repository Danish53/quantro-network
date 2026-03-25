"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavSections } from "./dashboardNav";
import { NavIcon } from "./DashboardNavIcons";
import { useSiteTranslation } from "../SiteTranslationProvider";

function ChevronRight({ className = "h-4 w-4 text-slate-600" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function DashboardSidebar({ onNavigate }) {
  const pathname = usePathname();
  const { t } = useSiteTranslation();

  const linkClass = (active) =>
    `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition ${
      active
        ? "bg-[#2a2a42] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
    }`;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-[#161625] px-3 py-5 sm:px-4">
      <nav className="dashboard-sidebar-scroll flex flex-1 flex-col gap-5 overflow-y-auto pb-6 pt-1">
        {dashboardNavSections.map((section) => (
          <div key={section.id}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500/90">{t(section.labelKey)}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group ${linkClass(isActive)}`}
                      onClick={() => onNavigate?.()}
                    >
                      <NavIcon name={item.icon} className="text-slate-500 transition group-hover:text-slate-200" />
                      <span className="flex-1 truncate">{t(item.labelKey)}</span>
                      {item.hasChevron ? <ChevronRight /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <Link
        href="/"
        className="mt-auto border-t border-white/10 pt-4 text-center text-xs text-slate-500 transition hover:text-slate-300"
        onClick={() => onNavigate?.()}
      >
        {t("dash.exit_website")}
      </Link>
    </aside>
  );
}
