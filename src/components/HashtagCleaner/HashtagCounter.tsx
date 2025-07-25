import { MAX_HASHTAGS } from "@/lib/hashtags";
import { cn } from "@/lib/utils";

export function HashtagCounter({ count }: { count: number }) {
  const left = MAX_HASHTAGS - count;
  const over = left < 0;
  return (
    <div
      className={cn(
        "text-sm font-medium",
        over ? "text-red-600" : "text-muted-foreground"
      )}
    >
      {count}/{MAX_HASHTAGS}{" "}
      {over ? `(over by ${Math.abs(left)})` : `(left: ${left})`}
    </div>
  );
}
