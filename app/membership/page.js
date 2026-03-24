"use client";

import Navbar from "../components/Navbar";
import { useSiteTranslation } from "../components/SiteTranslationProvider";

export default function MembershipPage() {
  const { t } = useSiteTranslation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-3xl font-bold">{t("page.membership.title")}</h1>
          <p className="mt-4 max-w-3xl text-slate-600">{t("page.membership.body")}</p>
        </section>
      </main>
    </div>
  );
}
