import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const target = body?.target;
    const texts = body?.texts;

    if (!target || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload. Expected { target, texts[] }." },
        { status: 400 }
      );
    }

    const translated = await Promise.all(
      texts.map(async (text) => {
        const query = new URLSearchParams({
          client: "gtx",
          sl: "en",
          tl: target,
          dt: "t",
          q: String(text),
        });

        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?${query.toString()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Translation provider error");
        }

        const data = await response.json();
        return data?.[0]?.map((part) => part?.[0] ?? "").join("") ?? text;
      })
    );

    return NextResponse.json({ translations: translated });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Translation failed" }, { status: 500 });
  }
}
