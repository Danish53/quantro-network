"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminNavSections, adminSettingsNavItem } from "./adminNav";
import { NavIcon } from "./DashboardNavIcons";
import { useSiteTranslation } from "../SiteTranslationProvider";

function ChevronRight({ className = "h-4 w-4 text-slate-500" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function AdminSidebar({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useSiteTranslation();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    onNavigate?.();
    router.push("/login");
    router.refresh();
  }

  const linkClass = (active) =>
    `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition ${
      active
        ? "bg-[#6366f1] text-white shadow-sm"
        : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
    }`;

  // const settingsActive =
  //   pathname === adminSettingsNavItem.href || pathname.startsWith(`${adminSettingsNavItem.href}/`);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-[#141235] px-3 py-5 sm:px-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <nav className="dashboard-sidebar-scroll flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden pb-4 pt-1">
          {adminNavSections.map((section) => (
            <div key={section.id}>
              <p className="mb-2 px-3 font-semibold uppercase tracking-wider text-slate-500" style={{ fontSize: '14px !important' }}>
                {t(section.labelKey)}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard/admin"
                      ? pathname === "/dashboard/admin"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className={`group ${linkClass(isActive)}`} onClick={() => onNavigate?.()}>
                        <NavIcon
                          name={item.icon}
                          className={
                            isActive ? "text-white" : "text-slate-400 transition group-hover:text-[#6366f1]"
                          }
                        />
                        <span className="flex-1 truncate">{t(item.labelKey)}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400 opacity-60 group-hover:opacity-100" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        {/* <div className="shrink-0 border-t border-white/[0.08] pt-3">
          <ul className="space-y-0.5">
            <li>
              <Link
                href={adminSettingsNavItem.href}
                className={`group ${linkClass(settingsActive)}`}
                onClick={() => onNavigate?.()}
              >
                <NavIcon
                  name={adminSettingsNavItem.icon}
                  className={
                    settingsActive ? "text-white" : "text-slate-400 transition group-hover:text-[#6366f1]"
                  }
                />
                <span className="flex-1 truncate">{t(adminSettingsNavItem.labelKey)}</span>
                <ChevronRight className="h-4 w-4 text-slate-400 opacity-60 group-hover:opacity-100" />
              </Link>
            </li>
          </ul>
        </div> */}
      </div>
      <div className="shrink-0 border-t border-white/[0.08] pt-4 lg:pt-3">
        <button
          type="button"
          onClick={handleLogout}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-rose-500/35 bg-rose-500/10 px-3 py-2.5 text-[13px] font-semibold text-rose-100/95 transition hover:bg-rose-500/20 lg:hidden"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 9l3 3m0 0l-3 3m3-3H9"
            />
          </svg>
          {t("dash.logout")}
        </button>
        <Link
          href="/"
          className="block text-center text-xs text-slate-400 transition hover:text-[#a5b4fc]"
          onClick={() => onNavigate?.()}
        >
          {t("dash.exit_website")}
        </Link>
      </div>
    </aside>
  );
}
