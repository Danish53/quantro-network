"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSiteTranslation } from "../SiteTranslationProvider";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

/** Admin area: same shell, palette, and glows as the member dashboard (indigo / violet). */
export default function AdminShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useSiteTranslation();
  const headerRef = useRef(null);
  const [headerPx, setHeaderPx] = useState(92);
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

  const mobileDrawerStyle =
    !isLg
      ? {
          top: h,
          left: 0,
          height: `calc(100dvh - ${h}px)`,
          maxHeight: `calc(100dvh - ${h}px)`,
        }
      : undefined;

  return (
    <div className="relative flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#0F0D2E] text-slate-200">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_100%_65%_at_50%_-18%,rgba(99,102,241,0.22),transparent_58%),radial-gradient(ellipse_55%_42%_at_0%_35%,rgba(92,90,255,0.12),transparent_50%),radial-gradient(ellipse_50%_38%_at_100%_85%,rgba(59,130,246,0.09),transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-[#0F0D2E] via-[#0c0a28] to-[#12104a]/90"
        aria-hidden
      />

      <div
        ref={headerRef}
        className="relative z-50 w-full shrink-0 border-b border-white/[0.08] bg-[#141235]/95 shadow-sm backdrop-blur-md"
      >
        <AdminTopBar onMenuClick={() => setMobileOpen(true)} />
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed z-[55] bg-[#0a0818]/80 lg:hidden"
          style={{ top: h, left: 0, right: 0 }}
          aria-label={t("dash.close_overlay")}
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="relative z-10 flex min-h-0 min-w-0 flex-1">
        <div
          className={`fixed z-[60] flex w-[min(100vw,280px)] max-w-[85vw] flex-col overflow-hidden overscroll-contain border-r border-white/[0.08] bg-[#141235] shadow-2xl shadow-black/40 transition-transform duration-200 ease-out will-change-transform lg:static lg:h-full lg:min-h-0 lg:w-64 lg:max-w-none lg:translate-x-0 lg:shadow-none xl:w-72 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          style={mobileDrawerStyle}
        >
          <div className="flex h-full min-h-0 min-w-0 flex-1 border-l-[3px] border-[#6366f1]/50">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>

        <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
