"use client";

import { useCallback, useEffect, useState } from "react";
import { useSiteTranslation } from "@/app/components/SiteTranslationProvider";
import AdminConfirmModal from "./AdminConfirmModal";
import { AdminUsersTableSkeleton } from "./AdminSkeletonBlocks";

function formatJoined(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "—";
  }
}

function kycBadgeClass(status) {
  switch (status) {
    case "approved":
      return "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25";
    case "pending":
      return "bg-amber-500/15 text-amber-100 ring-amber-500/25";
    case "rejected":
      return "bg-rose-500/15 text-rose-100 ring-rose-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 ring-white/10";
  }
}

export default function AdminUsersPanel() {
  const { t } = useSiteTranslation();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [modal, setModal] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  useEffect(() => {
    const tmr = setTimeout(() => setDebouncedQ(q.trim()), 320);
    return () => clearTimeout(tmr);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "15" });
      if (debouncedQ) qs.set("q", debouncedQ);
      const res = await fetch(`/api/admin/users?${qs}`, { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof json.error === "string" ? json.error : t("admin.load_error"));
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setErr(t("admin.load_error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQ, t]);

  useEffect(() => {
    load();
  }, [load]);

  async function runDeactivate(id) {
    setBusyId(id);
    setErr("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE", credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof json.error === "string" ? json.error : t("admin.load_error"));
        return false;
      }
      if (data?.users?.length === 1 && page > 1) setPage((p) => p - 1);
      else await load();
      return true;
    } catch {
      setErr(t("admin.load_error"));
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function runActivate(id) {
    setBusyId(id);
    setErr("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reactivate" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof json.error === "string" ? json.error : t("admin.load_error"));
        return false;
      }
      await load();
      return true;
    } catch {
      setErr(t("admin.load_error"));
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function handleModalConfirm() {
    if (!modal) return;
    setConfirmBusy(true);
    setErr("");
    try {
      const ok =
        modal.type === "deactivate" ? await runDeactivate(modal.user.id) : await runActivate(modal.user.id);
      if (ok) setModal(null);
    } finally {
      setConfirmBusy(false);
    }
  }

  const initialTableLoad = loading && !data;

  return (
    <div className="space-y-6 pb-10">
      <AdminConfirmModal
        open={Boolean(modal)}
        title={
          modal?.type === "activate" ? t("admin.users_confirm_activate_title") : t("admin.users_confirm_deactivate_title")
        }
        description={
          modal ? (
            <>
              <p>
                {modal.type === "activate"
                  ? t("admin.users_confirm_activate_desc")
                  : t("admin.users_confirm_deactivate_desc")}
              </p>
              <p className="mt-3 rounded-lg border border-white/[0.08] bg-[#0F0D2E]/80 px-3 py-2.5 text-xs text-slate-300">
                <span className="font-medium text-slate-200">{modal.user.fullName}</span>
                <span className="text-slate-500"> · </span>
                {modal.user.email}
              </p>
            </>
          ) : null
        }
        confirmLabel={modal?.type === "activate" ? t("admin.users_activate") : t("admin.users_deactivate")}
        cancelLabel={t("admin.modal_cancel")}
        variant={modal?.type === "activate" ? "success" : "danger"}
        pending={confirmBusy}
        onClose={() => !confirmBusy && setModal(null)}
        onConfirm={handleModalConfirm}
      />

      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">{t("admin.users_title")}</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">{t("admin.users_subtitle")}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-[10px] border border-white/[0.08] bg-[#141235]/60 p-4 ring-1 ring-white/[0.04] sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("admin.users_search_placeholder")}
          className="h-10 w-full max-w-lg rounded-[9px] border border-white/[0.1] bg-[#0F0D2E] px-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-1 ring-white/[0.04] transition focus:border-[#6366f1]/45 focus:ring-2 focus:ring-[#6366f1]/20"
          aria-label={t("admin.users_search_placeholder")}
        />
        {data ? (
          <p className="shrink-0 text-xs tabular-nums text-slate-500">
            {t("admin.users_page")} {data.page} {t("admin.users_of")} {data.totalPages}
            <span className="text-slate-600"> · </span>
            {data.total} {t("admin.users_total_members")}
          </p>
        ) : null}
      </div>

      {err ? (
        <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {err}{" "}
          <button type="button" className="ml-2 font-semibold underline" onClick={load}>
            {t("admin.retry")}
          </button>
        </div>
      ) : null}

      {initialTableLoad ? (
        <AdminUsersTableSkeleton />
      ) : (
        <div
          className={`overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#141235] shadow-sm ring-1 ring-white/[0.04] ${
            loading && data ? "pointer-events-none opacity-[0.72]" : ""
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0F0D2E]/50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.users_col_name")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.users_col_email")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.users_col_username")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.users_col_status")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.users_col_kyc")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 sm:px-5">{t("admin.users_col_joined")}</th>
                  <th className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5">{t("admin.users_col_actions")}</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {!data?.users?.length ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-14 text-center text-slate-500">
                      {t("admin.users_none")}
                    </td>
                  </tr>
                ) : (
                  data.users.map((u) => (
                    <tr
                      key={u.id}
                      className={`border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.03] ${
                        !u.isActive ? "bg-rose-950/[0.12]" : ""
                      }`}
                    >
                      <td
                        className={`max-w-[160px] truncate px-4 py-3.5 font-medium sm:max-w-[200px] sm:px-5 ${
                          !u.isActive ? "text-slate-400" : "text-slate-100"
                        }`}
                      >
                        {u.fullName}
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3.5 text-slate-400 sm:px-5">{u.email}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[13px] text-slate-400 sm:px-5">
                        @{u.username}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 sm:px-5">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${
                            u.isActive
                              ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
                              : "bg-rose-500/15 text-rose-100 ring-rose-500/25"
                          }`}
                        >
                          {u.isActive ? t("admin.status_active") : t("admin.status_inactive")}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 sm:px-5">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ${kycBadgeClass(u.kycStatus)}`}
                        >
                          {String(u.kycStatus || "").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-400 sm:px-5">
                        {formatJoined(u.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5">
                        {u.isActive ? (
                          <button
                            type="button"
                            disabled={busyId === u.id}
                            onClick={() => setModal({ type: "deactivate", user: u })}
                            className="rounded-md border border-rose-500/30 bg-rose-500/[0.12] px-3 py-1.5 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/25 disabled:opacity-50"
                          >
                            {busyId === u.id ? "…" : t("admin.users_deactivate")}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busyId === u.id}
                            onClick={() => setModal({ type: "activate", user: u })}
                            className="rounded-md border border-emerald-500/35 bg-emerald-500/[0.12] px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/25 disabled:opacity-50"
                          >
                            {busyId === u.id ? "…" : t("admin.users_activate")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data && data.totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-white/[0.1] bg-[#141235] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06] disabled:opacity-40"
          >
            {t("admin.users_prev")}
          </button>
          <button
            type="button"
            disabled={page >= data.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-white/[0.1] bg-[#141235] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06] disabled:opacity-40"
          >
            {t("admin.users_next")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
