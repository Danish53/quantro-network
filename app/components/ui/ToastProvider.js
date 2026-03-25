"use client";

import { useCallback, useEffect, useState } from "react";
import { registerToastDispatch } from "@/app/lib/toastBus";

let idSeq = 0;

function ToastItem({ toast: t, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(t.id), 4500);
    return () => clearTimeout(timer);
  }, [t.id, onDismiss]);

  const styles = {
    success:
      "border-emerald-500/35 bg-[#052e1f]/95 text-emerald-50 shadow-[0_12px_40px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/20",
    error:
      "border-red-500/35 bg-[#2a0a0c]/95 text-red-50 shadow-[0_12px_40px_rgba(239,68,68,0.18)] ring-1 ring-red-400/20",
    info: "border-white/15 bg-[#12141c]/95 text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10",
  };

  return (
    <div
      role="status"
      className={`pointer-events-auto flex max-w-[min(100%,360px)] items-start gap-3 rounded-xl border px-4 py-3 text-[13px] leading-snug backdrop-blur-md sm:text-sm ${styles[t.variant] ?? styles.info}`}
    >
      <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden>
        {t.variant === "success" ? "✓" : t.variant === "error" ? "!" : "i"}
      </span>
      <p className="min-w-0 flex-1">{t.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(t.id)}
        className="shrink-0 rounded-md p-1 text-current/70 transition hover:bg-white/10 hover:text-current"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((payload) => {
    const id = ++idSeq;
    setToasts((prev) => [...prev, { id, variant: payload.variant ?? "info", message: payload.message }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    return registerToastDispatch(pushToast);
  }, [pushToast]);

  return (
    <>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-[min(100%,380px)] flex-col items-end gap-2 px-3 sm:bottom-6 sm:right-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </>
  );
}
