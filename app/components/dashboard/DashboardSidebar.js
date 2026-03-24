"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavSections } from "./dashboardNav";
import { NavIcon } from "./DashboardNavIcons";
import Image from "next/image";
import logoImage from "@/public/images/logo-white.png";

function SidebarLogo() {
  return (
    <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-1">
      <Image src={logoImage} alt="logo auth" className="w-40" />
    </Link>
  );
}

function ChevronRight({ className = "h-4 w-4 text-slate-500" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function DashboardSidebar({ onNavigate }) {
  const pathname = usePathname();

  const linkClass = (active) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
      active
        ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#071018]/75 px-4 py-6 backdrop-blur-xl">
      <SidebarLogo />
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto pb-6">
        {dashboardNavSections.map((section) => (
          <div key={section.id}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{section.label}</p>
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
                      <NavIcon name={item.icon} className="text-slate-400 transition group-hover:text-white" />
                      <span className="flex-1 truncate">{item.label}</span>
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
        ← Exit to website
      </Link>
    </aside>
  );
}
