"use client";

import Link from "next/link";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function LimitedAccessBanner() {
  const { t } = useSiteTranslation();
  return (
    <div
      className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-amber-400/25 bg-amber-500/[0.12] px-4 py-2.5 text-center text-sm text-amber-100 sm:justify-center sm:text-left"
      role="status"
    >
      <span>
        <span className="font-semibold">{t("dash.limited_access_prefix")}</span> {t("dash.limited_access_rest")}
      </span>
      <Link href="/membership" className="font-semibold text-[#5C5AFF] underline decoration-[#5C5AFF]/50 underline-offset-2 hover:decoration-[#5C5AFF]">
        {t("dash.upgrade_now")}
      </Link>
    </div>
  );
}
