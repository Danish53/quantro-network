"use client";

export default function DashboardToast({ type = "info", message, onClose }) {
  if (!message) return null;

  const tone =
    type === "error"
      ? "border-red-500/35 bg-red-500/15 text-red-100"
      : type === "success"
        ? "border-emerald-500/35 bg-emerald-500/15 text-emerald-100"
        : "border-cyan-500/35 bg-cyan-500/15 text-cyan-100";

  return (
    <div className={`pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${tone}`}>
      <div className="flex items-start gap-3">
        <p className="flex-1 text-sm leading-5">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label="Close notification"
        >
          x
        </button>
      </div>
    </div>
  );
}
