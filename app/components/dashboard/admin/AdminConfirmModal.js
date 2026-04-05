"use client";

import { useEffect } from "react";

export default function AdminConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "danger",
  pending,
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const confirmRing =
    variant === "danger"
      ? "border-rose-500/40 bg-rose-500/15 text-rose-100 hover:bg-rose-500/25"
      : "border-emerald-500/40 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25";

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        aria-label={cancelLabel}
        onClick={onClose}
      />
      <div className="relative z-10 mb-[max(1rem,env(safe-area-inset-bottom))] w-full max-w-[420px] rounded-t-2xl border border-white/[0.1] bg-[#141235] p-5 shadow-2xl ring-1 ring-black/40 sm:mb-0 sm:rounded-2xl sm:p-6">
        <h2 id="admin-confirm-title" className="text-base font-semibold text-slate-100 sm:text-lg">
          {title}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-slate-400">{description}</div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={onClose}
            className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${confirmRing}`}
          >
            {pending ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
