"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  extractHashtags,
  MAX_HASHTAGS,
  normalizeTag,
  removeDuplicateHashtags,
} from "@/lib/hashtags";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { HashtagCounter } from "./HashtagCounter";
import HashtagPills, { PillTag } from "./HashtagPills";
import HashtagSuggestions from "./HashtagSuggestions";
import { Copy, Hash, Trash } from "lucide-react";

export const metadata = {
  title: "Hashtag Cleaner",
};

export default function HashtagCleanerPage() {
  const [isClient, setIsClient] = useState(false);
  // lazy init for SSR safety
  const [input, setInput] = useState<string>("#cutebaby #swag #cutebaby");

  // const [input, setInput] = useState<string>(() => {
  //   if (typeof window === "undefined") return "#cutebaby #swag #cutebaby";
  //   return localStorage.getItem("hashtag_input") || "#cutebaby #swag #cutebaby";
  // });

  const [output, setOutput] = useState<string>("");
  const [pillTags, setPillTags] = useState<PillTag[]>([]);
  const removedStack = useRef<string[]>([]); // for undo
  const bootstrappedOrder = useRef<boolean>(false);

  const { stats } = useMemo(() => extractHashtags(input), [input]);

  // compute pills in real-time
  useEffect(() => {
    if (isClient) {
      const raw = input.match(/#[\p{L}\p{N}_]+/gu) ?? [];
      const seen = new Set<string>();
      const duplicates = new Set<string>();
      const map = new Map<string, number>();

      raw.forEach((t) => {
        const n = normalizeTag(t);
        map.set(n, (map.get(n) ?? 0) + 1);
        if (seen.has(n)) duplicates.add(n);
        else seen.add(n);
      });

      // dedupe (keep first appearance order)
      const dedupedOrdered = raw.filter(
        (t, i) =>
          raw.findIndex((x) => normalizeTag(x) === normalizeTag(t)) === i
      );

      const overflowStart = MAX_HASHTAGS;

      let pills: PillTag[] = dedupedOrdered.map((t, idx) => {
        const n = normalizeTag(t);
        const isDuplicate = map.get(n)! > 1;
        const state: PillTag["state"] = isDuplicate
          ? "duplicate"
          : idx >= overflowStart
          ? "overflow"
          : "ok";
        return { value: t, state, count: map.get(n) };
      });

      // Restore order from localStorage once
      if (!bootstrappedOrder.current && typeof window !== "undefined") {
        const savedOrderRaw = localStorage.getItem("hashtag_order");
        if (savedOrderRaw) {
          try {
            const savedOrder: string[] = JSON.parse(savedOrderRaw);
            const orderMap = new Map<string, number>();
            savedOrder.forEach((v, idx) => orderMap.set(v, idx));
            pills = [...pills].sort((a, b) => {
              const ai =
                orderMap.get(a.value.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
              const bi =
                orderMap.get(b.value.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
              return ai - bi;
            });
            // console.log({ raw, dedupedOrdered, pills, savedOrder });
          } catch {}
        }
        bootstrappedOrder.current = true;
      }

      setPillTags(pills);
    }
  }, [input]);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("hashtag_input");
    if (saved) setInput(saved);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("hashtag_input", input);
    // Persist only the order (values), not the whole objects
    // localStorage.setItem(
    //   "hashtag_order",
    //   JSON.stringify(pillTags.map((p) => p.value.toLowerCase()))
    // );
  }, [input, pillTags]);

  const onClean = () => {
    // const cleaned = removeDuplicateHashtags(input);
    // const unique = cleaned.match(/#[\p{L}\p{N}_]+/gu) ?? [];
    // const unique30 = unique.slice(0, MAX_HASHTAGS);
    // const finalCleaned = unique30.join(" ");
    // setOutput(finalCleaned);

    // Use the order of pillTags

    const uniqueTags = pillTags
      // .filter((tag) => tag.state !== "duplicate" && tag.state !== "overflow")
      .map((tag) => tag.value);

    const finalCleaned = uniqueTags.join(" ");
    // console.log({ finalCleaned, uniqueTags, pillTags });
    setOutput(finalCleaned);
  };

  const onCopy = async () => {
    const toCopy = output || removeDuplicateHashtags(input);
    await navigator.clipboard.writeText(toCopy);
    toast.success("Copied to clipboard", {
      position: "top-right",
      duration: 2000,
      description: toCopy,
      descriptionClassName: "border-t border-green-300 text-gray-800 p-2",
    });
  };

  const onClear = () => {
    setInput("");
    setOutput("");
    setPillTags([]);
  };

  const removeTag = (tag: string) => {
    removedStack.current.push(tag);
    setInput((prev) =>
      prev
        .replace(new RegExp(`\\s*${escapeRegex(tag)}\\b`, "gi"), "")
        .replace(/\s{2,}/g, " ")
        .trim()
    );
    toast.info(`Removed ${tag}`, {
      classNames: {
        actionButton: "bg-purple-50 rounded-md p-2",
      },
      action: {
        label: "Undo",
        onClick: undoRemove,
      },
    });
  };

  const undoRemove = () => {
    const last = removedStack.current.pop();
    if (!last) return;
    setInput((prev) => `${prev} ${last}`.trim());
  };

  const totalUnique = pillTags.filter((p) => p.state !== "duplicate").length;
  const countForLimit = Math.min(totalUnique, MAX_HASHTAGS);

  const onReorder = (newTags: PillTag[]) => {
    setPillTags(newTags);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "hashtag_order",
        JSON.stringify(newTags.map((p) => p.value.toLowerCase()))
      );
    }
  };
  const addSuggestion = (tag: string) => {
    // avoid duplicates
    const already = new Set(
      (input.match(/#[\p{L}\p{N}_]+/gu) ?? []).map((t) => normalizeTag(t))
    );
    if (already.has(normalizeTag(tag))) {
      toast.info("Already added");
      return;
    }
    setInput((p) => (p ? `${p} ${tag}` : tag));
  };

  return (
    <main className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hashtag Cleaner</CardTitle>
          <HashtagCounter count={countForLimit} />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Enter or paste hashtags
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              placeholder="#cutebaby #swag #cutebaby"
            />

            <HashtagPills
              tags={pillTags}
              onRemove={removeTag}
              onReorder={onReorder}
            />

            <div className="flex gap-2 mt-4">
              <Button variant="secondary" onClick={onClear}>
                <Trash size={16} />
                Clear
              </Button>
              <Button onClick={onClean}>
                <Hash size={16} />
                Remove duplicate{" "}
                <span className="sm:block hidden">hashtags</span>
              </Button>
              <Button variant="outline" onClick={onCopy}>
                <Copy size={16} />
                Copy
              </Button>
              {removedStack.current.length > 0 && (
                <Button variant="ghost" onClick={undoRemove}>
                  Undo last
                </Button>
              )}
            </div>
          </div>

          {output && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold mb-2">Cleaned output</h3>
                  <Button variant="outline" onClick={onCopy}>
                    <Copy size={16} />
                    Copy
                  </Button>
                </div>
                <Textarea readOnly value={output} rows={4} />
              </div>
            </>
          )}

          <Separator />
          <HashtagSuggestions onAdd={addSuggestion} />

          <div>
            <h3 className="text-sm font-semibold mb-4">
              Hashtag count statistics
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px] text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Hashtag count</TableCell>
                  <TableCell className="text-right">{stats.total}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Unique hashtag count</TableCell>
                  <TableCell className="text-right">{stats.unique}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Duplicate hashtag count</TableCell>
                  <TableCell className="text-right">
                    {stats.duplicates}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {stats.duplicateList.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Duplicate hashtags</p>
                <div className="flex flex-wrap gap-2">
                  {stats.duplicateList.map((d) => (
                    <Badge key={d.tag} variant="destructive">
                      {d.tag} ({d.count}x)
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
