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
import { SITE_STRING_KEYS, SITE_STRINGS, SITE_STRINGS_REVISION } from "@/app/lib/siteStrings";

const SiteTranslationContext = createContext(null);

function translationCacheKey(language) {
  return `qn_site_tr_${language}_r${SITE_STRINGS_REVISION}_${SITE_STRING_KEYS.length}`;
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

      const key = translationCacheKey(language);
      try {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            setTranslations(parsed);
            setIsTranslating(false);
            return;
          }
        }
      } catch {
        /* ignore bad cache */
      }

      setIsTranslating(true);
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: language, scope: "all" }),
        });
        if (!response.ok) throw new Error("Translation request failed");
        const data = await response.json();
        const merged = data.translations ?? {};
        if (!cancelled) {
          setTranslations(merged);
          try {
            window.localStorage.setItem(key, JSON.stringify(merged));
          } catch {
            /* quota */
          }
        }
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
