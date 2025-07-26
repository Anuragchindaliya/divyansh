import { NextResponse } from "next/server";
import { getKeywordsFromText } from "@/lib/hashtags";

// Public, free, no-key related-words API (Datamuse)
// https://api.datamuse.com/words?ml=baby
export async function POST(req: Request) {
  const { text } = await req.json();
  const keywords = getKeywordsFromText(text || "");

  if (keywords.length === 0) {
    return NextResponse.json({ tags: [] });
  }

  const promises = keywords.map((k) => {
    const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(
      k
    )}&max=6`;
    console.log("Fetching related words from:", url);
    return fetch(url).then((r) => r.json());
  });

  const results = await Promise.all(promises);
  const words = results.flat().map((w: any) => w.word);

  // Dedup, sanitize, convert to hashtags
  const set = new Set<string>();
  words.forEach((w) => {
    const tag = `#${w.replace(/\s+/g, "")}`;
    if (/^#[a-zA-Z0-9_]+$/.test(tag)) set.add(tag.toLowerCase());
  });

  const tags = [...set].slice(0, 30);
  return NextResponse.json({ tags });
}
