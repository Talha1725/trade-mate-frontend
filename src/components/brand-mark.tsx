import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

import type { BrandMarkProps } from "@/types";

export function BrandMark({ className, showName = true }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-xl bg-[#1a1a1a] text-white shadow-sm"
      >
        <Sparkles className="size-5" />
      </span>
      {showName ? (
        <span className="font-heading text-lg font-semibold tracking-tight text-[#1a1a1a]">
          Trade Mate
        </span>
      ) : null}
    </div>
  );
}
