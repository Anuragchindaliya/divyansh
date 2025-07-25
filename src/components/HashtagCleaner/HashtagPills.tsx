"use client";

import { X } from "lucide-react";

interface HashtagPillsProps {
  hashtags: string[];
  onRemove: (tag: string) => void;
}

export default function HashtagPills({
  hashtags,
  onRemove,
}: HashtagPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {hashtags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
        >
          {tag}
          <button
            onClick={() => onRemove(tag)}
            className="ml-2 bg-purple-50 text-pink-600 hover:text-pink-900"
            aria-label={`Remove ${tag}`}
          >
            <X size={14} className="bg-purple-50" />
          </button>
        </span>
      ))}
    </div>
  );
}
