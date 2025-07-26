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

export const metadata = {
  title: "Hashtag Cleaner",
};

export default function HashtagCleanerPage() {
  const [input, setInput] = useState<string>(
    localStorage.getItem("hashtag_input") || "#cutebaby #swag #cutebaby"
  );
  const [output, setOutput] = useState<string>("");
  const [pillTags, setPillTags] = useState<PillTag[]>([]);
  const removedStack = useRef<string[]>([]); // for undo

  const { stats } = useMemo(() => extractHashtags(input), [input]);

  // compute pills in real-time
  useEffect(() => {
    // 1) build list (keep original order, but normalize for duplicate detection)
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

    // 2) create pill array
    const dedupedOrdered = raw.filter(
      (t, i) => raw.findIndex((x) => normalizeTag(x) === normalizeTag(t)) === i
    );

    // apply 30 limit to unique ordered
    const overflowStart = MAX_HASHTAGS;

    const pills: PillTag[] = dedupedOrdered.map((t, idx) => {
      const n = normalizeTag(t);
      // const isDuplicate = duplicates.has(n);
      const isDuplicate = map.get(n)! > 1;
      const state: PillTag["state"] = isDuplicate
        ? "duplicate"
        : idx >= overflowStart
        ? "overflow"
        : "ok";
      return { value: t, state, count: map.get(n) };
    });

    setPillTags(pills);
    localStorage.setItem("hashtag_input", input);
  }, [input]);

  const onClean = () => {
    const cleaned = removeDuplicateHashtags(input);
    // drop overflow too
    const unique = cleaned.match(/#[\p{L}\p{N}_]+/gu) ?? [];
    const unique30 = unique.slice(0, MAX_HASHTAGS);
    const finalCleaned = unique30.join(" ");
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

  const totalUnique = pillTags.filter((p) => p.state !== "duplicate").length;
  const countForLimit = Math.min(totalUnique, MAX_HASHTAGS);

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

            <HashtagPills tags={pillTags} onRemove={removeTag} />

            <div className="flex gap-2 mt-4">
              <Button variant="secondary" onClick={onClear}>
                Clear
              </Button>
              <Button onClick={onClean}>
                Remove duplicate{" "}
                <span className="sm:block hidden">hashtags</span>
              </Button>
              <Button variant="outline" onClick={onCopy}>
                Copy
              </Button>
              {removedStack.current.length > 0 && (
                <Button variant="ghost" onClick={undoRemove}>
                  Undo last
                </Button>
              )}
            </div>
          </div>

          {/* <Separator /> */}

          {/* <HashtagSuggestions onAdd={addSuggestion} /> */}

          {output && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold mb-2">Cleaned output</h3>
                  <Button variant="outline" onClick={onCopy}>
                    Copy
                  </Button>
                </div>
                <Textarea readOnly value={output} rows={4} />
              </div>
            </>
          )}

          <Separator />

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
