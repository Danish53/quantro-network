"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { portalPathForSessionUser } from "@/lib/auth/roles";

/**
 * Marketing / navbar: logged-in admins → /dashboard/admin, members → /dashboard, guests → portalHref unused (use /login).
 */
export function usePortalLink() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [portalHref, setPortalHref] = useState("/dashboard");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data?.user) {
          setLoggedIn(true);
          setPortalHref(portalPathForSessionUser(data.user));
        } else {
          setLoggedIn(false);
          setPortalHref("/dashboard");
        }
      } catch {
        if (!cancelled) {
          setLoggedIn(false);
          setPortalHref("/dashboard");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return { loggedIn, portalHref };
}
