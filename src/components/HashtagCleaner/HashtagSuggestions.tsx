"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  onAdd: (tag: string) => void;
};

export default function HashtagSuggestions({ onAdd }: Props) {
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-hashtags", {
        method: "POST",
        body: JSON.stringify({ text: inputText }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setSuggested(data.tags ?? []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        placeholder="Enter your post/text/caption to generate hashtags for free..."
        className="w-full border rounded p-3"
        rows={3}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate hashtags (free)"}
      </Button>

      {suggested.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggested.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onAdd(t)}
            >
              {t}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
