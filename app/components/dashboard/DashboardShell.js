"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSiteTranslation } from "../SiteTranslationProvider";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopBar from "./DashboardTopBar";
import LimitedAccessBanner from "./LimitedAccessBanner";

function subscribeLg(callback) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getLgSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function getLgServerSnapshot() {
  return true;
}

export default function DashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useSiteTranslation();
  const headerRef = useRef(null);
  const [headerPx, setHeaderPx] = useState(92);
  const isLg = useSyncExternalStore(subscribeLg, getLgSnapshot, getLgServerSnapshot);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setHeaderPx(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const h = Math.max(headerPx, 1);

  const mobileDrawerStyle =
    !isLg
      ? {
          top: h,
          height: `calc(100dvh - ${h}px - env(safe-area-inset-bottom, 0px))`,
          maxHeight: `calc(100dvh - ${h}px - env(safe-area-inset-bottom, 0px))`,
        }
      : undefined;

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-gradient-to-br from-[#0B0B1E] via-[#12122a] to-[#161625] text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(154,107,32,0.06),transparent)]"
        aria-hidden
      />

      <div ref={headerRef} className="relative z-50 w-full shrink-0 border-b border-white/[0.04] shadow-[0_1px_0_0_rgba(255,255,255,0.04)]">
        <DashboardTopBar onMenuClick={() => setMobileOpen(true)} />
        <LimitedAccessBanner />
      </div>

      {/* z-30: dim — below drawer (z-40) so blur does not cover the sidebar */}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed bottom-0 left-0 right-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          style={{ top: h }}
          aria-label={t("dash.close_overlay")}
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {/* No z-index on this row: if z-10, the whole column stacks under z-40 overlay and blur covers the drawer */}
      <div className="relative flex min-h-0 flex-1">
        <div
          className={`fixed left-0 z-40 flex w-[min(100%,280px)] flex-col overflow-hidden border-r border-white/[0.06] bg-[#161625] shadow-2xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:h-full lg:min-h-0 lg:w-64 lg:shrink-0 lg:translate-x-0 lg:overflow-visible lg:self-stretch lg:shadow-none xl:w-72 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          style={mobileDrawerStyle}
        >
          <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
