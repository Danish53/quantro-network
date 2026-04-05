"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSiteTranslation } from "@/app/components/SiteTranslationProvider";
import DashboardToast from "../DashboardToast";

const COUNTRIES = ["Pakistan", "United States", "United Kingdom", "United Arab Emirates", "India", "Canada", "Australia"];

export default function AdminProfilePanel() {
  const { t } = useSiteTranslation();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [countryOptions, setCountryOptions] = useState(COUNTRIES);
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwStatus, setPwStatus] = useState("idle");
  const [pwMessage, setPwMessage] = useState("");

  const fieldClass =
    "mt-2 w-full rounded-[10px] border border-white/[0.1] bg-[#0F0D2E] px-3.5 py-2.5 text-sm text-slate-100 outline-none ring-1 ring-white/[0.04] transition placeholder:text-slate-500 focus:border-[#6366f1]/45 focus:ring-2 focus:ring-[#6366f1]/20 disabled:cursor-not-allowed disabled:opacity-60";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data?.user) {
          setLoadError(true);
          return;
        }
        const u = data.user;
        setUsername(u.username || "");
        setFullName(u.fullName || "");
        setEmail(u.email || "");
        setPhone(u.phone || "");
        setAvatarDataUrl(u.avatarDataUrl || "");
        if (u.country) {
          setCountry(u.country);
          if (!COUNTRIES.includes(u.country)) {
            setCountryOptions([u.country, ...COUNTRIES]);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePickAvatar = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSaveState("error");
      setSaveMessage(t("admin.profile_image_invalid"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveState("error");
      setSaveMessage(t("admin.profile_image_size"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatarDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }, [t]);

  if (loading) {
    return (
      <div className="space-y-6 pb-10">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-md bg-white/[0.07]" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-white/[0.05]" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="animate-pulse rounded-[14px] border border-white/[0.08] bg-[#141235]/80 p-6 ring-1 ring-white/[0.04] lg:col-span-4">
            <div className="mx-auto h-28 w-28 rounded-full bg-white/[0.08]" />
            <div className="mx-auto mt-5 h-4 w-32 rounded bg-white/[0.08]" />
            <div className="mx-auto mt-2 h-3 w-24 rounded bg-white/[0.06]" />
            <div className="mt-8 space-y-3 border-t border-white/[0.06] pt-6">
              <div className="h-3 w-full rounded bg-white/[0.06]" />
              <div className="h-3 w-4/5 rounded bg-white/[0.06]" />
            </div>
          </div>
          <div className="animate-pulse rounded-[14px] border border-white/[0.08] bg-[#141235]/80 p-6 ring-1 ring-white/[0.04] lg:col-span-8">
            <div className="h-5 w-40 rounded bg-white/[0.08]" />
            <div className="mt-2 h-3 w-56 rounded bg-white/[0.06]" />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-11 rounded-[10px] bg-white/[0.06]" />
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <div className="h-10 w-36 rounded-[10px] bg-white/[0.08]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pb-10">
      <div className="pointer-events-none fixed right-4 top-24 z-[80] space-y-2 sm:right-6">
        <DashboardToast
          type={saveState === "error" ? "error" : "success"}
          message={saveMessage}
          onClose={() => setSaveMessage("")}
        />
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">{t("admin.settings_title")}</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">{t("admin.settings_subtitle")}</p>
      </div>

      {loadError ? (
        <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {t("admin.profile_load_error")}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <aside className="lg:col-span-4">
              <div className="relative overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#141235] p-6 shadow-sm ring-1 ring-white/[0.04]">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366f1]/50 to-transparent"
                  aria-hidden
                />
                <div className="flex flex-col items-center text-center">
                  <p className="text-lg font-semibold text-slate-100">{fullName || username || "—"}</p>
                  {username ? <p className="mt-1 font-mono text-sm text-slate-500">@{username}</p> : null}
                  <div className="relative mt-6">
                    <div className="flex h-[7.25rem] w-[7.25rem] items-center justify-center overflow-hidden rounded-full bg-[#0F0D2E] ring-2 ring-[#6366f1]/25">
                      {avatarDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarDataUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <svg className="h-16 w-16 text-slate-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      aria-hidden
                      onChange={(e) => handlePickAvatar(e.target.files?.[0])}
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 ring-2 ring-[#141235] transition hover:bg-[#4f46e5]"
                      aria-label={t("dash.profile.edit_photo")}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{t("admin.profile_avatar_hint")}</p>
                </div>

                <div className="mt-8 border-t border-white/[0.06] pt-6 text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t("admin.profile_card_identity")}</p>
                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="text-xs text-slate-500">{t("admin.profile_role_label")}</dt>
                      <dd className="mt-1.5">
                        <span className="inline-flex items-center rounded-lg border border-[#6366f1]/35 bg-[#6366f1]/15 px-2.5 py-1 text-xs font-semibold text-[#a5b4fc]">
                          {t("admin.profile_role_admin")}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">{t("dash.profile.email")}</dt>
                      <dd className="mt-1.5 break-all font-mono text-sm text-slate-300">{email || "—"}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <section className="rounded-[14px] border border-white/[0.08] bg-[#141235] p-6 shadow-sm ring-1 ring-white/[0.04]">
                <h2 className="text-lg font-semibold text-slate-100">{t("admin.profile_details_title")}</h2>
                <p className="mt-1 text-sm text-slate-500">{t("admin.profile_details_subtitle")}</p>

                <form
                  className="mt-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSaveMessage("");
                    setSaveState("saving");
                    try {
                      const res = await fetch("/api/auth/me", {
                        method: "PATCH",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          fullName: fullName.trim(),
                          username: username.trim(),
                          phone: phone.trim(),
                          country: country.trim(),
                          avatarDataUrl,
                        }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        setSaveState("error");
                        setSaveMessage(typeof data.error === "string" ? data.error : t("admin.profile_save_fail"));
                        return;
                      }
                      if (data.user?.username) setUsername(data.user.username);
                      if (typeof data.user?.avatarDataUrl === "string") setAvatarDataUrl(data.user.avatarDataUrl);
                      if (typeof window !== "undefined") window.dispatchEvent(new Event("profile-updated"));
                      setSaveState("success");
                      setSaveMessage(t("admin.profile_saved"));
                      setTimeout(() => {
                        setSaveState("idle");
                        setSaveMessage("");
                      }, 4000);
                    } catch {
                      setSaveState("error");
                      setSaveMessage(t("admin.profile_save_fail"));
                    }
                  }}
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label htmlFor="admin-profile-name" className="text-sm font-medium text-slate-400">
                        {t("dash.profile.full_name")}
                      </label>
                      <input
                        id="admin-profile-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={fieldClass}
                        autoComplete="name"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label htmlFor="admin-profile-username" className="text-sm font-medium text-slate-400">
                        {t("dash.profile.username")}
                      </label>
                      <input
                        id="admin-profile-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`${fieldClass} font-mono text-[13px]`}
                        autoComplete="username"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label htmlFor="admin-profile-country" className="text-sm font-medium text-slate-400">
                        {t("dash.profile.country")}
                      </label>
                      <div className="relative">
                        <select
                          id="admin-profile-country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className={`${fieldClass} appearance-none bg-[#0F0D2E] pr-10`}
                        >
                          {countryOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <span
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                          aria-hidden
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <label htmlFor="admin-profile-email" className="text-sm font-medium text-slate-400">
                        {t("dash.profile.email")}
                      </label>
                      <input
                        id="admin-profile-email"
                        type="email"
                        value={email}
                        readOnly
                        disabled
                        className={`${fieldClass} cursor-not-allowed opacity-75`}
                      />
                      <p className="mt-1.5 text-xs text-slate-500">{t("dash.profile.email_locked")}</p>
                    </div>
                    <div className="sm:col-span-2 sm:max-w-md">
                      <label htmlFor="admin-profile-phone" className="text-sm font-medium text-slate-400">
                        {t("dash.profile.phone")}
                      </label>
                      <input
                        id="admin-profile-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={fieldClass}
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-white/[0.06] pt-6">
                    <button
                      type="submit"
                      disabled={saveState === "saving"}
                      className="rounded-[10px] bg-[#6366f1] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#6366f1]/20 transition hover:bg-[#4f46e5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saveState === "saving" ? t("admin.profile_saving") : t("admin.profile_save")}
                    </button>
                  </div>
                </form>
              </section>

            </div>
          </div>
          
              <section className="mt-6 rounded-[14px]  border border-white/[0.08] bg-[#141235] p-6 shadow-sm ring-1 ring-white/[0.04]">
                <h2 className="text-lg font-semibold text-slate-100">{t("admin.profile_security_title")}</h2>
                <p className="mt-1 text-sm text-slate-500">{t("admin.profile_security_subtitle")}</p>
                <form
                  className="mt-6 w-full max-w-lg space-y-5"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setPwMessage("");
                    setPwStatus("saving");
                    try {
                      const res = await fetch("/api/auth/change-password", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          currentPassword: pwCurrent,
                          newPassword: pwNew,
                          confirmPassword: pwConfirm,
                        }),
                      });
                      const raw = await res.text();
                      let data = {};
                      try {
                        data = raw ? JSON.parse(raw) : {};
                      } catch {
                        data = {};
                      }
                      if (!res.ok) {
                        setPwStatus("error");
                        const apiErr =
                          (typeof data?.error === "string" && data.error) ||
                          (typeof data?.message === "string" && data.message) ||
                          (raw && !raw.trimStart().startsWith("{") ? raw.slice(0, 200) : "");
                        setPwMessage(apiErr || t("dash.dpw.error"));
                        return;
                      }
                      setPwCurrent("");
                      setPwNew("");
                      setPwConfirm("");
                      setPwStatus("success");
                      setPwMessage(t("dash.dpw.success"));
                      setTimeout(() => {
                        setPwStatus("idle");
                        setPwMessage("");
                      }, 5000);
                    } catch {
                      setPwStatus("error");
                      setPwMessage(t("dash.dpw.error"));
                    }
                  }}
                >
                  <div className="w-full">
                    <label htmlFor="admin-pw-current" className="text-sm font-medium text-slate-400">
                      {t("dash.dpw.current")}
                    </label>
                    <input
                      id="admin-pw-current"
                      type="password"
                      autoComplete="current-password"
                      value={pwCurrent}
                      onChange={(e) => setPwCurrent(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="admin-pw-new" className="text-sm font-medium text-slate-400">
                      {t("dash.dpw.new")}
                    </label>
                    <input
                      id="admin-pw-new"
                      type="password"
                      autoComplete="new-password"
                      value={pwNew}
                      onChange={(e) => setPwNew(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="admin-pw-confirm" className="text-sm font-medium text-slate-400">
                      {t("dash.dpw.confirm")}
                    </label>
                    <input
                      id="admin-pw-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={pwConfirm}
                      onChange={(e) => setPwConfirm(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  {pwMessage ? (
                    <p
                      className={`text-sm ${pwStatus === "success" ? "text-emerald-400" : "text-rose-300"}`}
                      role="status"
                    >
                      {pwMessage}
                    </p>
                  ) : null}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={pwStatus === "saving"}
                      className="rounded-[10px] border border-[#6366f1]/35 bg-[#6366f1] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#6366f1]/15 transition hover:bg-[#4f46e5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {pwStatus === "saving" ? t("dash.dpw.saving") : t("dash.dpw.submit")}
                    </button>
                  </div>
                </form>
              </section>
        </>
      )}
    </div>
  );
}
