import { NextResponse } from "next/server";
import { SITE_STRINGS } from "@/app/lib/siteStrings";

export const runtime = "nodejs";
/** Allow long full-site translation on serverless (when supported). */
export const maxDuration = 60;

const CONCURRENCY = 22;

async function translateOne(target, text) {
  const query = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: target,
    dt: "t",
    q: String(text),
  });

  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${query.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Translation provider error");
  }

  const data = await response.json();
  return data?.[0]?.map((part) => part?.[0] ?? "").join("") ?? text;
}

/**
 * Parallel pool: many concurrent requests to Google (faster than sequential batches from the client).
 */
async function translateWithPool(target, texts, concurrency = CONCURRENCY) {
  const results = new Array(texts.length);
  let nextIndex = 0;

  async function worker() {
    for (;;) {
      const i = nextIndex;
      nextIndex += 1;
      if (i >= texts.length) break;
      try {
        results[i] = await translateOne(target, texts[i]);
      } catch {
        results[i] = texts[i];
      }
    }
  }

  const n = Math.min(concurrency, Math.max(1, texts.length));
  await Promise.all(Array.from({ length: n }, () => worker()));
  return results;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const target = body?.target;
    const texts = body?.texts;
    const scopeAll = body?.scope === "all" || body?.all === true;

    if (!target || typeof target !== "string") {
      return NextResponse.json({ error: "Invalid payload. Expected { target }." }, { status: 400 });
    }

    if (target === "en") {
      return NextResponse.json({ translations: {}, keys: [] });
    }

    /** Full site: one round-trip from the browser; translate on the server. */
    if (scopeAll || (!Array.isArray(texts) && !texts)) {
      const keys = Object.keys(SITE_STRINGS);
      const sourceTexts = keys.map((k) => SITE_STRINGS[k]);
      const translated = await translateWithPool(target, sourceTexts);
      const translations = {};
      keys.forEach((key, i) => {
        translations[key] = translated[i] ?? SITE_STRINGS[key];
      });
      return NextResponse.json({ translations, keys });
    }

    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload. Expected { target, scope: \"all\" } or { target, texts[] }." },
        { status: 400 }
      );
    }

    const translated = await translateWithPool(target, texts);
    return NextResponse.json({ translations: translated });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Translation failed" }, { status: 500 });
  }
}
