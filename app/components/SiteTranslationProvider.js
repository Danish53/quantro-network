"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { languageOptions } from "@/app/lib/languages";
import { SITE_STRING_KEYS, SITE_STRINGS } from "@/app/lib/siteStrings";

const SiteTranslationContext = createContext(null);

const CHUNK_SIZE = 35;

async function translateTexts(target, texts) {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target, texts }),
  });
  if (!response.ok) throw new Error("Translation request failed");
  const data = await response.json();
  return data.translations ?? [];
}

export function SiteTranslationProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("app_language");
    if (stored && languageOptions.some((l) => l.code === stored)) {
      setLanguageState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
  }, [language, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;

    async function run() {
      if (language === "en") {
        setTranslations({});
        setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      try {
        const keys = SITE_STRING_KEYS;
        const merged = {};
        for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
          const batchKeys = keys.slice(i, i + CHUNK_SIZE);
          const batchTexts = batchKeys.map((k) => SITE_STRINGS[k]);
          const translated = await translateTexts(language, batchTexts);
          batchKeys.forEach((key, j) => {
            merged[key] = translated[j] ?? SITE_STRINGS[key];
          });
        }
        if (!cancelled) setTranslations(merged);
      } catch {
        if (!cancelled) setTranslations({});
      } finally {
        if (!cancelled) setIsTranslating(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [language, hydrated]);

  const setLanguage = useCallback((code) => {
    setLanguageState(code);
    window.localStorage.setItem("app_language", code);
  }, []);

  const t = useCallback(
    (key) => {
      if (language === "en") return SITE_STRINGS[key] ?? key;
      return translations[key] ?? SITE_STRINGS[key] ?? key;
    },
    [language, translations]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, isTranslating, hydrated }),
    [language, setLanguage, t, isTranslating, hydrated]
  );

  return (
    <SiteTranslationContext.Provider value={value}>{children}</SiteTranslationContext.Provider>
  );
}

export function useSiteTranslation() {
  const ctx = useContext(SiteTranslationContext);
  if (!ctx) {
    throw new Error("useSiteTranslation must be used within SiteTranslationProvider");
  }
  return ctx;
}
