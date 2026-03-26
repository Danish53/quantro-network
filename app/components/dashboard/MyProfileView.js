"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import DashboardNavigateDropdown from "./DashboardNavigateDropdown";
import { useSiteTranslation } from "../SiteTranslationProvider";
import DashboardToast from "./DashboardToast";

const COUNTRIES = ["Pakistan", "United States", "United Kingdom", "United Arab Emirates", "India", "Canada", "Australia"];

export default function MyProfileView() {
  const { t } = useSiteTranslation();
  const fileRef = useRef(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [countryOptions, setCountryOptions] = useState(COUNTRIES);
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [copyDone, setCopyDone] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const baseField =
    "w-full rounded-[10px] border border-[#2a3558] bg-[#14182b] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#9A6B20]/50 focus:ring-1 focus:ring-[#9A6B20]/25";

  useEffect(() => {
    let cancelled = false;
    setProfileLoading(true);
    setProfileLoadError(false);
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data?.user) {
          setProfileLoadError(true);
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
        if (!cancelled) setProfileLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const base = window.location.origin;
    const ref = username.trim() || "member";
    setAffiliateUrl(`${base}/register?ref=${encodeURIComponent(ref)}`);
  }, [username]);

  const copyAffiliate = useCallback(() => {
    if (!affiliateUrl) return;
    navigator.clipboard.writeText(affiliateUrl).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  }, [affiliateUrl]);

  const handlePickAvatar = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSaveState("error");
      setSaveMessage("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveState("error");
      setSaveMessage("Image must be 5MB or smaller");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="relative pb-24">
      <div className="pointer-events-none fixed right-4 top-20 z-[80] space-y-2 sm:right-6">
        <DashboardToast type={saveState === "error" ? "error" : "success"} message={saveMessage} onClose={() => setSaveMessage("")} />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">{t("dash.profile.page_title")}</h1>
          <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/dashboard" className="transition hover:text-slate-300">
                  {t("dash.profile.breadcrumb_dashboard")}
                </Link>
              </li>
              <li className="px-1 text-slate-600" aria-hidden>
                {">"}
              </li>
              <li className="text-slate-300">{t("dash.profile.page_title")}</li>
            </ol>
          </nav>
        </div>
        <div className="flex shrink-0 justify-start sm:justify-end">
          <DashboardNavigateDropdown />
        </div>
      </div>

      {profileLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <section className="rounded-[12px] border border-white/[0.08] bg-[#161b33] p-6 animate-pulse">
            <div className="mx-auto h-28 w-28 rounded-full bg-white/10" />
            <div className="mx-auto mt-4 h-4 w-32 rounded bg-white/10" />
            <div className="mt-8 h-10 w-full rounded bg-white/10" />
          </section>
          <section className="rounded-[12px] border border-white/[0.08] bg-[#161b33] p-6 animate-pulse">
            <div className="h-5 w-36 rounded bg-white/10" />
            <div className="mt-2 h-4 w-56 rounded bg-white/10" />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-10 rounded bg-white/10" />
              <div className="h-10 rounded bg-white/10" />
              <div className="h-10 rounded bg-white/10" />
              <div className="h-10 rounded bg-white/10" />
            </div>
          </section>
        </div>
      ) : (
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Profile summary */}
        <section className="relative flex flex-col rounded-[14px] border border-[#9A6B20]/20 bg-gradient-to-b from-[#1a2140] to-[#161b33] p-6 shadow-[0_14px_35px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col items-center text-center">
            <p className="text-lg font-semibold text-white">
              {profileLoading ? "…" : username || fullName || "—"}
            </p>
            <div className="relative mt-5">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#2d3142] ring-2 ring-white/[0.08]">
                {avatarDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-16 w-16 text-slate-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
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
                className="absolute -bottom-0.5 -right-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#9A6B20] text-white shadow-lg ring-2 ring-[#161b33] transition hover:bg-[#ac7924]"
                aria-label={t("dash.profile.edit_photo")}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">JPG/PNG up to 5MB</p>
          </div>

          <div className="mt-8 w-full">
            <label htmlFor="affiliate-link" className="text-sm font-medium text-[#a0aec0]">
              {t("dash.profile.affiliate_label")}
            </label>
            <div className="relative mt-2 flex rounded-[10px] border border-[#2a3558] bg-[#14182b] focus-within:border-[#9A6B20]/50 focus-within:ring-1 focus-within:ring-[#9A6B20]/25">
              <input
                id="affiliate-link"
                readOnly
                value={affiliateUrl}
                className="min-w-0 flex-1 truncate rounded-l-[10px] bg-transparent px-3 py-2.5 text-xs text-slate-300 outline-none sm:text-sm"
              />
              <button
                type="button"
                onClick={copyAffiliate}
                className="flex shrink-0 items-center justify-center border-l border-[#2a3558] px-3 text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                aria-label={t("dash.profile.copy_link")}
              >
                {copyDone ? (
                  <span className="text-xs text-emerald-400">{t("dash.profile.copied")}</span>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v12.75c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 19.875V8.625c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v3.75c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500 sm:text-left">{t("dash.profile.affiliate_hint")}</p>
          </div>
        </section>

        {/* Personal details */}
        <section className="rounded-[12px] border border-white/[0.08] bg-[#161b33] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <h2 className="text-lg font-semibold text-white">{t("dash.profile.details_title")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("dash.profile.details_subtitle")}</p>
          {profileLoadError && (
            <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{t("dash.profile.load_error")}</p>
          )}
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
                  setSaveMessage(data?.error || t("dash.profile.save_fail"));
                  return;
                }
                if (data.user?.username) setUsername(data.user.username);
                if (typeof data.user?.avatarDataUrl === "string") setAvatarDataUrl(data.user.avatarDataUrl);
                if (typeof window !== "undefined") window.dispatchEvent(new Event("profile-updated"));
                setSaveState("success");
                setSaveMessage(t("dash.profile.save_ok"));
                setTimeout(() => {
                  setSaveState("idle");
                  setSaveMessage("");
                }, 4000);
              } catch {
                setSaveState("error");
                setSaveMessage(t("dash.profile.save_fail"));
              }
            }}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="full-name" className="text-sm text-[#a0aec0]">
                  {t("dash.profile.full_name")}
                </label>
                <input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`${baseField} mt-2`}
                  autoComplete="name"
                  disabled={profileLoading}
                />
              </div>
              <div>
                <label htmlFor="profile-username" className="text-sm text-[#a0aec0]">
                  {t("dash.profile.username")}
                </label>
                <input
                  id="profile-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`${baseField} mt-2`}
                  autoComplete="username"
                  disabled={profileLoading}
                />
              </div>
              <div>
                <label htmlFor="country" className="text-sm text-[#a0aec0]">
                  {t("dash.profile.country")}
                </label>
                <div className="relative mt-2">
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`${baseField} mt-2 appearance-none pr-10`}
                    disabled={profileLoading}
                  >
                    {countryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-sm text-[#a0aec0]">
                  {t("dash.profile.email")}
                </label>
                <input id="email" type="email" value={email} readOnly disabled className={`${baseField} mt-2 cursor-not-allowed opacity-80`} />
                <p className="mt-1 text-xs text-slate-500">{t("dash.profile.email_locked")}</p>
              </div>
              <div>
                <label htmlFor="phone" className="text-sm text-[#a0aec0]">
                  {t("dash.profile.phone")}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${baseField} mt-2`}
                  autoComplete="tel"
                  disabled={profileLoading}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={profileLoading || saveState === "saving"}
                className="rounded-[10px] bg-[#9A6B20] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#9A6B20]/20 transition hover:bg-[#ac7924] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveState === "saving" ? t("dash.profile.saving") : t("dash.profile.save")}
              </button>
            </div>
          </form>
        </section>
      </div>
      )}

      {/* Change password — full width */}
      <section className="mt-6 rounded-[12px] border border-white/[0.08] bg-[#161b33] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
        <h2 className="text-lg font-semibold text-white">{t("dash.profile.password_title")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("dash.profile.password_subtitle")}</p>
        <div className="mt-6">
          <Link
            href="/dashboard/reset-password"
            className="inline-flex items-center justify-center rounded-[10px] border-2 border-[#9A6B20] bg-transparent px-6 py-2.5 text-sm font-semibold text-[#e8c98a] transition hover:bg-[#9A6B20]/10"
          >
            {t("dash.profile.password_change")}
          </Link>
        </div>
      </section>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg shadow-blue-600/35 transition hover:bg-[#1d4ed8]"
        aria-label={t("dash.chat_support")}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m9 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M9.75 21h3.75a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0013.5 4.5h-6a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 007.5 21z"
          />
        </svg>
      </button>
    </div>
  );
}
