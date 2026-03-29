"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavSections } from "./dashboardNav";
import { NavIcon } from "./DashboardNavIcons";
import { useSiteTranslation } from "../SiteTranslationProvider";

function ChevronRight({ className = "h-4 w-4 text-slate-500" }) {
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
        ? "bg-[#6366f1] text-white shadow-sm"
        : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
    }`;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-transparent px-3 py-5 sm:px-4">
      <nav className="dashboard-sidebar-scroll flex flex-1 flex-col gap-5 overflow-y-auto pb-6 pt-1">
        {dashboardNavSections.map((section) => (
          <div key={section.id}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t(section.labelKey)}</p>
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
                      <NavIcon
                        name={item.icon}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 transition group-hover:text-[#6366f1]"
                        }
                      />
                      <span className="flex-1 truncate">{t(item.labelKey)}</span>
                      {item.hasChevron ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
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
        className="mt-auto border-t border-white/[0.08] pt-4 text-center text-xs text-slate-400 transition hover:text-[#a5b4fc]"
        onClick={() => onNavigate?.()}
      >
        {t("dash.exit_website")}
      </Link>
    </aside>
  );
}
