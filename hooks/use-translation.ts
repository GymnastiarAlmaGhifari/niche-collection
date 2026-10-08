"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLangStore } from "@/store/lang-store";
import { t as staticT } from "@/lib/translate";

// Client-side translation cache (persists in-memory during session)
const translationCache = new Map<string, string>();

/**
 * Hook: useTranslation
 * Provides `t()` for static dictionary keys and `td()` for dynamic content.
 */
export function useTranslation() {
  const { lang } = useLangStore();

  /**
   * Static translation from the UI dictionary.
   */
  const t = useCallback(
    (key: string): string => {
      return staticT(key, lang);
    },
    [lang]
  );

  /**
   * Dynamic translation — translates arbitrary text from Indonesian to English.
   * Returns Indonesian text immediately, then auto-translates to English via API
   * when lang is 'en'.
   */
  const useDynamicTranslation = (originalText: string): string => {
    const [translated, setTranslated] = useState(originalText);

    useEffect(() => {
      if (lang === "id" || !originalText) {
        setTranslated(originalText);
        return;
      }

      const cacheKey = `id:en:${originalText}`;
      if (translationCache.has(cacheKey)) {
        setTranslated(translationCache.get(cacheKey)!);
        return;
      }

      // Translate via server API
      let cancelled = false;
      fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText, from: "id", to: "en" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled && data.translated) {
            translationCache.set(cacheKey, data.translated);
            setTranslated(data.translated);
          }
        })
        .catch(() => {
          // Fallback: keep original text
        });

      return () => {
        cancelled = true;
      };
    }, [originalText, lang]);

    return translated;
  };

  return { t, lang, useDynamicTranslation };
}
