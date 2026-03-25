"use client";

import Link from "next/link";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function LimitedAccessBanner() {
  const { t } = useSiteTranslation();
  return (
    <div
      className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-[#9A6B20]/40 bg-[#9A6B20] px-4 py-2.5 text-center text-sm text-white sm:justify-center sm:text-left"
      role="status"
    >
      <span>
        <span className="font-semibold">{t("dash.limited_access_prefix")}</span> {t("dash.limited_access_rest")}
      </span>
      <Link href="/membership" className="font-semibold underline decoration-white/80 underline-offset-2 hover:decoration-white">
        {t("dash.upgrade_now")}
      </Link>
    </div>
  );
}
