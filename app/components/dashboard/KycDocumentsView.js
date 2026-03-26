"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import DashboardNavigateDropdown from "./DashboardNavigateDropdown";
import { useSiteTranslation } from "../SiteTranslationProvider";
import DashboardToast from "./DashboardToast";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/gif"];
const ACCEPT_ATTR = "image/jpeg,image/png,image/gif";

const DOC_TYPES = [
  { value: "national_id", labelKey: "dash.kyc.type_national" },
  { value: "passport", labelKey: "dash.kyc.type_passport" },
  { value: "license", labelKey: "dash.kyc.type_license" },
];

function validateFile(file) {
  if (!file) return "error_format";
  if (!ACCEPTED.includes(file.type)) return "error_format";
  if (file.size > MAX_BYTES) return "error_size";
  return null;
}

function FileDropZone({ variant, preview, onFile, onClear, uploadKey, required }) {
  const { t } = useSiteTranslation();
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const labelKey = variant === "front" ? "dash.kyc.front_label" : "dash.kyc.back_label";

  return (
    <div>
      <label className="text-sm text-[#a0aec0]">
        {t(labelKey)}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <p className="mt-0.5 text-xs text-slate-500">{t("dash.kyc.max_size_hint")}</p>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={`relative mt-2 flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[12px] border-2 border-dashed bg-white px-4 py-8 transition ${
          drag ? "border-cyan-500 ring-2 ring-cyan-400/40" : "border-slate-300/80"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="sr-only"
          aria-label={t(uploadKey)}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        {preview ? (
          <>
            <div className="relative h-52 w-full max-w-lg">
              <Image src={preview} alt="" fill className="object-contain" unoptimized sizes="(max-width:32rem) 100vw, 32rem" />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (inputRef.current) inputRef.current.value = "";
                onClear();
              }}
              className="mt-3 text-sm font-medium text-[#2563eb] underline hover:text-[#60a5fa]"
            >
              {t("dash.kyc.remove_file")}
            </button>
          </>
        ) : (
          <>
            <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-13.5l1.409 1.409a2.25 2.25 0 010 3.182l-7.5 7.5a2.25 2.25 0 01-3.182 0l-7.5-7.5a2.25 2.25 0 010-3.182l1.409-1.409"
              />
            </svg>
            <p className="mt-3 text-center text-sm font-medium text-slate-700">{t(uploadKey)}</p>
            <p className="mt-1 text-xs text-slate-500">{t("dash.kyc.drag_hint")}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function KycDocumentsView() {
  const { t } = useSiteTranslation();
  const [kycStatus, setKycStatus] = useState("not_submitted");
  const [docType, setDocType] = useState("national_id");
  const [docNumber, setDocNumber] = useState("");
  const [country, setCountry] = useState("United States");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ssnLast4, setSsnLast4] = useState("");
  const [usResident, setUsResident] = useState(true);
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const pullStatus = () =>
      fetch("/api/kyc/me", { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data?.kyc?.status) {
            setKycStatus(data.kyc.status);
          }
          if (!hydratedRef.current && !isEditing) {
            hydratedRef.current = true;
            setCountry(data?.kyc?.country || "United States");
            setStateName(data?.kyc?.state || "");
            setCity(data?.kyc?.city || "");
            setAddressLine1(data?.kyc?.addressLine1 || "");
            setPostalCode(data?.kyc?.postalCode || "");
            setDateOfBirth(data?.kyc?.dateOfBirth || "");
            setSsnLast4(data?.kyc?.ssnLast4 || "");
            setUsResident(Boolean(data?.kyc?.usResident ?? true));
          }
        })
        .catch(() => {});

    pullStatus();
    const id = setInterval(pullStatus, 5000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isEditing]);

  const revoke = useCallback((url) => {
    if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
  }, []);

  const setFront = useCallback(
    (file) => {
      const err = validateFile(file);
      if (err) {
        setFormError(t(`dash.kyc.${err}`));
        return;
      }
      setFormError("");
      setFrontPreview((prev) => {
        revoke(prev);
        return URL.createObjectURL(file);
      });
      setFrontFile(file);
    },
    [revoke, t]
  );

  const setBack = useCallback(
    (file) => {
      const err = validateFile(file);
      if (err) {
        setFormError(t(`dash.kyc.${err}`));
        return;
      }
      setFormError("");
      setBackPreview((prev) => {
        revoke(prev);
        return URL.createObjectURL(file);
      });
      setBackFile(file);
    },
    [revoke, t]
  );

  const clearFront = useCallback(() => {
    setFrontPreview((prev) => {
      revoke(prev);
      return "";
    });
    setFrontFile(null);
  }, [revoke]);

  const clearBack = useCallback(() => {
    setBackPreview((prev) => {
      revoke(prev);
      return "";
    });
    setBackFile(null);
  }, [revoke]);

  useEffect(() => {
    return () => {
      revoke(frontPreview);
      revoke(backPreview);
    };
  }, [frontPreview, backPreview, revoke]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setNotice("");
    const nextFieldErrors = {};
    if (!docType) {
      nextFieldErrors.docType = t("dash.kyc.error_doc_type");
    }
    if (!frontFile) {
      nextFieldErrors.frontFile = t("dash.kyc.error_front");
    }
    if (!stateName.trim() || !city.trim() || !addressLine1.trim() || !postalCode.trim()) {
      if (!stateName.trim()) nextFieldErrors.state = t("dash.kyc.error_required");
      if (!city.trim()) nextFieldErrors.city = t("dash.kyc.error_required");
      if (!addressLine1.trim()) nextFieldErrors.addressLine1 = t("dash.kyc.error_required");
      if (!postalCode.trim()) nextFieldErrors.postalCode = t("dash.kyc.error_required");
    }
    if (!dateOfBirth.trim()) {
      nextFieldErrors.dateOfBirth = t("dash.kyc.error_dob");
    }
    if (!/^\d{4}$/.test(ssnLast4.trim())) {
      nextFieldErrors.ssnLast4 = t("dash.kyc.error_ssn_last4");
    }
    if (!usResident) {
      nextFieldErrors.usResident = t("dash.kyc.error_us_resident");
    }
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setFormError(t("dash.kyc.fix_errors"));
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          docNumber: docNumber.trim(),
          country: country.trim(),
          state: stateName.trim(),
          city: city.trim(),
          addressLine1: addressLine1.trim(),
          postalCode: postalCode.trim(),
          dateOfBirth: dateOfBirth.trim(),
          ssnLast4: ssnLast4.trim(),
          usResident,
          hasFrontImage: Boolean(frontFile),
          hasBackImage: Boolean(backFile),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data?.error || t("dash.kyc.submit_error"));
        return;
      }
      setKycStatus(data?.kyc?.status || "pending");
      setNotice(t("dash.kyc.submit_ok"));
      setIsEditing(false);
    } catch {
      setFormError(t("dash.kyc.submit_error"));
    } finally {
      setSubmitting(false);
    }
  };

  const baseField =
    "w-full rounded-[10px] border border-[#2a3558] bg-[#14182b] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#2563eb]/50 focus:ring-1 focus:ring-[#2563eb]/25";

  return (
    <div className="relative pb-24">
      <div className="pointer-events-none fixed right-4 top-20 z-[80] space-y-2 sm:right-6">
        <DashboardToast type="error" message={formError} onClose={() => setFormError("")} />
        <DashboardToast type="success" message={notice} onClose={() => setNotice("")} />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{t("dash.kyc.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">{t("dash.kyc.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/dashboard" className="transition hover:text-slate-300">
                  {t("dash.kyc.breadcrumb_dashboard")}
                </Link>
              </li>
              <li className="px-1 text-slate-600" aria-hidden>
                {">"}
              </li>
              <li className="text-slate-300">{t("dash.nav_kyc")}</li>
            </ol>
          </nav>
          <DashboardNavigateDropdown />
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-[12px] border border-white/[0.08] bg-[#161b33] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-8"
        >
          <div className="mb-4">
            {kycStatus === "approved" ? (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{t("dash.kyc.status_approved")}</p>
            ) : kycStatus === "pending" ? (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{t("dash.kyc.status_pending")}</p>
            ) : (
              <p className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{t("dash.kyc.status_not_submitted")}</p>
            )}
          </div>
          <div className="flex gap-3 rounded-[10px] border border-cyan-500/35 bg-cyan-950/40 px-4 py-3 text-sm text-cyan-50">
            <span className="mt-0.5 shrink-0 text-cyan-300" aria-hidden>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </span>
            <ul className="list-inside list-disc space-y-1 text-cyan-100/95">
              <li>{t("dash.kyc.info_size")}</li>
              <li>{t("dash.kyc.info_formats")}</li>
              <li>{t("dash.kyc.info_review")}</li>
            </ul>
          </div>

          <div className="mt-8 space-y-7">
            <section className="rounded-[14px] border border-[#9A6B20]/20 bg-gradient-to-b from-[#1a2140] to-[#14182b] p-4 sm:p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{t("dash.kyc.section_identity")}</h3>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="kyc-doc-type" className="text-sm text-[#a0aec0]">
                {t("dash.kyc.doc_type")} <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <select
                  id="kyc-doc-type"
                  value={docType}
                  onChange={(e) => {
                    setIsEditing(true);
                    setDocType(e.target.value);
                  }}
                  className={`${baseField} appearance-none pr-10`}
                >
                  {DOC_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {t(d.labelKey)}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </div>
              {fieldErrors.docType ? <p className="mt-1 text-xs text-red-400">{fieldErrors.docType}</p> : null}
            </div>

            <div>
              <label htmlFor="kyc-doc-number" className="text-sm text-[#a0aec0]">
                {t("dash.kyc.doc_number")}
              </label>
              <input
                id="kyc-doc-number"
                value={docNumber}
                onChange={(e) => {
                  setIsEditing(true);
                  setDocNumber(e.target.value);
                }}
                placeholder={t("dash.kyc.doc_number_placeholder")}
                className={`${baseField} mt-2`}
                autoComplete="off"
              />
            </div>
              </div>
            </section>

            <section className="rounded-[14px] border border-[#9A6B20]/20 bg-gradient-to-b from-[#1a2140] to-[#14182b] p-4 sm:p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{t("dash.kyc.section_address")}</h3>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="kyc-country" className="text-sm text-[#a0aec0]">
                    {t("dash.kyc.country")}
                  </label>
                  <input
                    id="kyc-country"
                    value={country}
                    onChange={(e) => {
                      setIsEditing(true);
                      setCountry(e.target.value);
                    }}
                    className={`${baseField} mt-2`}
                  />
                </div>
            <div>
              <label htmlFor="kyc-state" className="text-sm text-[#a0aec0]">
                {t("dash.kyc.state")}
              </label>
              <input
                id="kyc-state"
                value={stateName}
                onChange={(e) => {
                  setIsEditing(true);
                  setStateName(e.target.value);
                }}
                className={`${baseField} mt-2`}
              />
              {fieldErrors.state ? <p className="mt-1 text-xs text-red-400">{fieldErrors.state}</p> : null}
            </div>
            <div>
              <label htmlFor="kyc-city" className="text-sm text-[#a0aec0]">
                {t("dash.kyc.city")}
              </label>
              <input
                id="kyc-city"
                value={city}
                onChange={(e) => {
                  setIsEditing(true);
                  setCity(e.target.value);
                }}
                className={`${baseField} mt-2`}
              />
              {fieldErrors.city ? <p className="mt-1 text-xs text-red-400">{fieldErrors.city}</p> : null}
            </div>
            <div>
              <label htmlFor="kyc-postal" className="text-sm text-[#a0aec0]">
                {t("dash.kyc.postal_code")}
              </label>
              <input
                id="kyc-postal"
                value={postalCode}
                onChange={(e) => {
                  setIsEditing(true);
                  setPostalCode(e.target.value);
                }}
                className={`${baseField} mt-2`}
              />
              {fieldErrors.postalCode ? <p className="mt-1 text-xs text-red-400">{fieldErrors.postalCode}</p> : null}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="kyc-address1" className="text-sm text-[#a0aec0]">
                {t("dash.kyc.address_line1")}
              </label>
              <input
                id="kyc-address1"
                value={addressLine1}
                onChange={(e) => {
                  setIsEditing(true);
                  setAddressLine1(e.target.value);
                }}
                className={`${baseField} mt-2`}
              />
              {fieldErrors.addressLine1 ? <p className="mt-1 text-xs text-red-400">{fieldErrors.addressLine1}</p> : null}
            </div>
            <div>
              <label htmlFor="kyc-dob" className="text-sm text-[#a0aec0]">
                {t("dash.kyc.dob")}
              </label>
              <input
                id="kyc-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => {
                  setIsEditing(true);
                  setDateOfBirth(e.target.value);
                }}
                className={`${baseField} mt-2`}
              />
              {fieldErrors.dateOfBirth ? <p className="mt-1 text-xs text-red-400">{fieldErrors.dateOfBirth}</p> : null}
            </div>
            <div>
              <label htmlFor="kyc-ssn4" className="text-sm text-[#a0aec0]">
                {t("dash.kyc.ssn_last4")}
              </label>
              <input
                id="kyc-ssn4"
                value={ssnLast4}
                onChange={(e) => {
                  setIsEditing(true);
                  setSsnLast4(e.target.value.replace(/\D/g, "").slice(0, 4));
                }}
                className={`${baseField} mt-2`}
                inputMode="numeric"
                placeholder="1234"
              />
              {fieldErrors.ssnLast4 ? <p className="mt-1 text-xs text-red-400">{fieldErrors.ssnLast4}</p> : null}
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={usResident}
                onChange={(e) => {
                  setIsEditing(true);
                  setUsResident(e.target.checked);
                }}
              />
              {t("dash.kyc.us_resident_confirm")}
            </label>
            {fieldErrors.usResident ? <p className="-mt-3 text-xs text-red-400">{fieldErrors.usResident}</p> : null}
              </div>
            </section>

            <section className="rounded-[14px] border border-[#9A6B20]/20 bg-gradient-to-b from-[#1a2140] to-[#14182b] p-4 sm:p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{t("dash.kyc.section_documents")}</h3>
              <div className="mt-4 space-y-5">

            <FileDropZone variant="front" preview={frontPreview} onFile={setFront} onClear={clearFront} uploadKey="dash.kyc.upload_front" required />
            {fieldErrors.frontFile ? <p className="-mt-3 text-xs text-red-400">{fieldErrors.frontFile}</p> : null}

            <FileDropZone variant="back" preview={backPreview} onFile={setBack} onClear={clearBack} uploadKey="dash.kyc.upload_back" required={false} />
              </div>
            </section>
          </div>

          <div className="mt-8 flex justify-start">
            <button
              type="submit"
              disabled={submitting || kycStatus === "approved"}
              className="rounded-[10px] bg-[#9A6B20] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#9A6B20]/20 transition hover:bg-[#ac7924] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t("dash.kyc.submitting") : t("dash.kyc.submit")}
            </button>
          </div>
        </form>
      </div>

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
