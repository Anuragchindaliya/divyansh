// lib/hashtags.ts
export type HashtagStats = {
  total: number;
  unique: number;
  duplicates: number;
  duplicateList: Array<{ tag: string; count: number }>;
};
export const MAX_HASHTAGS = 30;
const HASHTAG_REGEX = /#[\p{L}\p{N}_]+/gu; // supports unicode letters

export function extractHashtags(text: string) {
  const matches = text.match(HASHTAG_REGEX) ?? [];
  const lower = matches.map((t) => t.toLowerCase());
  const map = new Map<string, number>();

  lower.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1));

  const duplicateList = [...map.entries()]
    .filter(([, c]) => c > 1)
    .map(([tag, count]) => ({ tag, count }));

  const stats: HashtagStats = {
    total: matches.length,
    unique: map.size,
    duplicates: duplicateList.reduce((a, b) => a + (b.count - 1), 0),
    duplicateList,
  };

  return { matches, map, stats };
}

export function removeDuplicateHashtags(input: string): string {
  const seen = new Set<string>();
  return input
    .replace(HASHTAG_REGEX, (m) => {
      const low = m.toLowerCase();
      if (seen.has(low)) return ""; // drop duplicates
      seen.add(low);
      return m;
    })
    .replace(/\s{2,}/g, " ")
    .trim();
}
export function normalizeTag(tag: string) {
  return tag.toLowerCase();
}

export function getKeywordsFromText(text: string) {
  // crude keyword extractor: remove hashtags, emojis, punctuation, numbers
  const cleaned = text
    .replace(HASHTAG_REGEX, "")
    .replace(/[^\p{L}\s]/gu, " ")
    .toLowerCase();
  const words = cleaned.split(/\s+/).filter((w) => w.length > 2);
  const stop = new Set([
    "the",
    "and",
    "for",
    "with",
    "you",
    "your",
    "this",
    "that",
    "are",
    "was",
  ]);
  return [...new Set(words.filter((w) => !stop.has(w)))].slice(0, 5);
}
export const SUGGESTION_SEED: Record<string, string[]> = {
  baby: ["#cutebaby", "#babylove", "#babyboy", "#babyfashion"],
  cute: ["#cutekids", "#cute", "#cutenessoverload"],
  fashion: ["#kidsfashion", "#babyfashion", "#minimodel"],
};
