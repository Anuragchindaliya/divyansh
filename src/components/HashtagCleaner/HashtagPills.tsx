"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagState = "ok" | "duplicate" | "overflow";

export interface PillTag {
  value: string;
  state: TagState;
}

export default function HashtagPills({
  tags,
  onRemove,
}: {
  tags: PillTag[];
  onRemove: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t.value}
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
            t.state === "duplicate" &&
              "bg-red-100 text-red-700 border border-red-300",
            t.state === "overflow" &&
              "bg-gray-200 text-gray-600 border border-gray-300 line-through",
            t.state === "ok" &&
              "bg-green-100 text-green-700 border border-green-200"
          )}
          title={
            t.state === "overflow"
              ? "Above 30 limit – will not be copied"
              : undefined
          }
        >
          {t.value}
          <button
            className="ml-2 hover:opacity-70"
            onClick={() => onRemove(t.value)}
            aria-label={`Remove ${t.value}`}
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
}
