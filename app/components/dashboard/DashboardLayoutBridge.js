"use client";

import { usePathname } from "next/navigation";
import AdminShell from "./AdminShell";
import DashboardShell from "./DashboardShell";

/**
 * Picks shell by route: `/dashboard/admin/*` uses AdminShell; everything else under /dashboard uses member DashboardShell.
 */
export default function DashboardLayoutBridge({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/dashboard/admin") ?? false;

  if (isAdmin) {
    return <AdminShell>{children}</AdminShell>;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
