"use client";

import Image from "next/image";
import image from "@/public/images/dashboard.png";
import { useSiteTranslation } from "./SiteTranslationProvider";

export default function WealthSection() {
  const { t } = useSiteTranslation();
  const titleLines = t("wealth.title").split("\n");

  return (
    <section className="w-full text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">{t("wealth.eyebrow")}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111827] sm:text-[44px]">
        {titleLines.map((line, i) => (
          <span key={i}>
            {i > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </h2>
      <p className="mx-auto mt-3 max-w-3xl text-[17px] font-[600] leading-7 text-slate-600">{t("wealth.body")}</p>

      <div className="relative mx-auto w-full max-w-9xl">
        <svg viewBox="0 0 1618 900" focusable="false" className="h-auto w-full" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M101.583 301.413C94.4517 259.209 122.883 219.215 165.087 212.083L1382.96 6.28832C1472.87 -8.9049 1512.05 115.615 1429.63 154.64L642.704 527.238L1520.96 365.296C1607.06 349.42 1650.61 465.12 1575.37 509.938L942.158 887.084C905.385 908.987 857.818 896.932 835.916 860.158C814.013 823.385 826.068 775.818 862.842 753.916L1129.5 595.09L95.0792 785.827C4.69665 802.492 -35.766 676.987 47.2513 637.679L863.283 251.3L190.913 364.917C148.709 372.048 108.715 343.617 101.583 301.413Z"
            fill="#E9E3FF"
          />
        </svg>

        <div className="absolute left-1/2 top-1/2 w-[92%] -translate-x-1/2 -translate-y-1/2">
          <Image
            src={image}
            alt={t("wealth.img_alt")}
            className="h-auto w-full object-contain"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </section>
  );
}
