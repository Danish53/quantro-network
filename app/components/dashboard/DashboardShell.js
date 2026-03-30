"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSiteTranslation } from "../SiteTranslationProvider";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopBar from "./DashboardTopBar";
import LimitedAccessBanner from "./LimitedAccessBanner";
import DashboardWagmiProvider from "./DashboardWagmiProvider";
import { DashboardWalletConnectProvider } from "./DashboardWalletConnectModal";

export default function DashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useSiteTranslation();
  const headerRef = useRef(null);
  const [headerPx, setHeaderPx] = useState(92);
  /** Same value on server + first client paint avoids hydration mismatch; real breakpoint after mount. */
  const [isLg, setIsLg] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  /** Mobile: anchor drawer between header and viewport bottom — avoids gap / wrong color strip below */
  const mobileDrawerStyle =
    !isLg
      ? {
          top: h,
          bottom: 0,
          left: 0,
        }
      : undefined;

  return (
    <DashboardWagmiProvider>
      <DashboardWalletConnectProvider>
      <div className="dashboard-theme relative flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#0F0D2E] text-slate-200">
        {/* Mostly #0F0D2E with soft logo-inspired indigo / violet / blue glows */}
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_100%_65%_at_50%_-18%,rgba(99,102,241,0.22),transparent_58%),radial-gradient(ellipse_55%_42%_at_0%_35%,rgba(92,90,255,0.12),transparent_50%),radial-gradient(ellipse_50%_38%_at_100%_85%,rgba(59,130,246,0.09),transparent_52%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-[#0F0D2E] via-[#0c0a28] to-[#12104a]/90"
          aria-hidden
        />

        <div ref={headerRef} className="relative z-50 w-full shrink-0 border-b border-white/[0.08] bg-[#141235]/95 shadow-sm backdrop-blur-md">
        <DashboardTopBar onMenuClick={() => setMobileOpen(true)} />
        <LimitedAccessBanner />
        </div>

        {/* Dim layer z-[55], drawer z-[60] — full-bleed below header; tap outside closes */}
        {mobileOpen ? (
          <button
            type="button"
            className="fixed right-0 bg-[#0a0818]/80 lg:hidden"
            style={{ top: h, bottom: 0, left: 0 }}
            aria-label={t("dash.close_overlay")}
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        {/* Content row: main stays z-10; fixed drawer/overlay paint above via their own z-index */}
        <div className="relative z-10 flex min-h-0 flex-1">
          <div
            className={`fixed z-[60] flex w-[min(100%,280px)] flex-col overflow-hidden border-r border-white/[0.08] bg-[#141235] shadow-2xl transition-transform duration-200 ease-out lg:static lg:inset-auto lg:z-auto lg:h-full lg:min-h-0 lg:w-64 lg:shrink-0 lg:translate-x-0 lg:overflow-visible lg:self-stretch lg:shadow-none xl:w-72 ${
              mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
            style={mobileDrawerStyle}
          >
            <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
          </div>

          <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      </DashboardWalletConnectProvider>
    </DashboardWagmiProvider>
  );
}
