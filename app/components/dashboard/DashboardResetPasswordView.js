"use client";

import { useState } from "react";
import DashboardStandardPage from "./DashboardStandardPage";
import { useSiteTranslation } from "../SiteTranslationProvider";

export default function DashboardResetPasswordView() {
  const { t } = useSiteTranslation();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const baseField =
    "mt-2 w-full rounded-[10px] border border-[#2a3558] bg-[#14182b] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/25";

  return (
    <DashboardStandardPage titleKey="dash.dpw.title" breadcrumbLastKey="dash.dpw.title">
      <p className="mb-6 text-sm text-slate-400">{t("dash.dpw.subtitle")}</p>

      <div className="mx-auto max-w-lg rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 sm:p-8">
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setMessage("");
            setStatus("saving");
            try {
              const res = await fetch("/api/auth/change-password", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  currentPassword: current,
                  newPassword: next,
                  confirmPassword: confirm,
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) {
                setStatus("error");
                setMessage(data?.error || t("dash.dpw.error"));
                return;
              }
              setCurrent("");
              setNext("");
              setConfirm("");
              setStatus("success");
              setMessage(t("dash.dpw.success"));
              setTimeout(() => {
                setStatus("idle");
                setMessage("");
              }, 5000);
            } catch {
              setStatus("error");
              setMessage(t("dash.dpw.error"));
            }
          }}
        >
          <div>
            <label htmlFor="dpw-cur" className="text-sm text-[#a0aec0]">
              {t("dash.dpw.current")}
            </label>
            <input
              id="dpw-cur"
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className={baseField}
            />
          </div>
          <div>
            <label htmlFor="dpw-new" className="text-sm text-[#a0aec0]">
              {t("dash.dpw.new")}
            </label>
            <input
              id="dpw-new"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className={baseField}
            />
          </div>
          <div>
            <label htmlFor="dpw-conf" className="text-sm text-[#a0aec0]">
              {t("dash.dpw.confirm")}
            </label>
            <input
              id="dpw-conf"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={baseField}
            />
          </div>
          {message && (
            <p
              className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-300"}`}
              role="status"
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full rounded-[10px] bg-[#2563eb] py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
          >
            {status === "saving" ? t("dash.dpw.saving") : t("dash.dpw.submit")}
          </button>
        </form>
      </div>
    </DashboardStandardPage>
  );
}
