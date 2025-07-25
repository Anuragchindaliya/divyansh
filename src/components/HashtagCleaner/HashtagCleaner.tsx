"use client";

import { useEffect, useMemo, useState } from "react";
import { removeDuplicateHashtags, extractHashtags } from "@/lib/hashtags";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Clipboard } from "lucide-react";
import HashtagPills from "./HashtagPills";

export default function HashtagCleanerPage() {
  const [input, setInput] = useState<string>("#cutebaby #swag #cutebaby");
  const [output, setOutput] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const { stats } = useMemo(() => extractHashtags(input), [input]);

  const onClean = () => {
    const cleaned = removeDuplicateHashtags(input);
    setOutput(cleaned);
    // optionally write to clipboard:
    // navigator.clipboard.writeText(cleaned).catch(() => {});
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(output || input);
    toast.success("Copied to clipboard", {
      position: "top-right",
      duration: 2000,
    });
  };

  const onClear = () => {
    setInput("");
    setOutput("");
  };
  const removeTag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };
  useEffect(() => {
    const unique = removeDuplicateHashtags(input).split(/\s+/);
    setHashtags(unique.filter((tag) => tag.startsWith("#")));
  }, [input]);

  return (
    <main className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Remove duplicate hashtags</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Enter or paste hashtags
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              placeholder="#cutebaby #swag #cutebaby"
            />
            <HashtagPills hashtags={hashtags} onRemove={removeTag} />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClear}>
                Clear
              </Button>
              <Button onClick={onClean}>Remove duplicate hashtags</Button>
            </div>
          </div>

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
                    <Badge key={d.tag} variant="secondary">
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
