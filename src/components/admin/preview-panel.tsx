"use client";

import { SectionCard } from "@/components/section-card";
import { CheckCircleIcon, HelpCircleIcon } from "lucide-react";
import type { TradePreviewData } from "@/types/admin";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  preview: TradePreviewData | null;
  targetAccountLabel?: string;
}

export function PreviewPanel({ preview, targetAccountLabel }: PreviewPanelProps) {
  return (
    <SectionCard title="Trade Preview Card">
      {preview ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-emerald-600 font-medium pb-2 border-b">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Parsed Instructions Successfully</span>
          </div>

          {targetAccountLabel && (
            <div className="text-xs text-muted-foreground">
              Target Account: <span className="font-semibold text-foreground">{targetAccountLabel}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Symbol</span>
              <span className="text-lg font-bold">{preview.symbol}</span>
            </div>

            <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Direction</span>
              <span
                className={cn(
                  "text-lg font-bold",
                  preview.direction === "Buy" ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {preview.direction}
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Entry Price</span>
              <span className="text-lg font-semibold">{preview.entry.toFixed(4)}</span>
            </div>

            <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Exit Price</span>
              <span className="text-lg font-semibold">{preview.exit.toFixed(4)}</span>
            </div>

            <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Lot Size</span>
              <span className="text-lg font-semibold">{preview.lotSize.toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Estimated Profit</span>
              <span
                className={cn(
                  "text-lg font-bold",
                  preview.profit >= 0 ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {preview.profit >= 0 ? "+" : ""}${preview.profit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <HelpCircleIcon className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="font-semibold text-sm">No Preview Generated</p>
          <p className="text-xs max-w-[280px] mt-1">
            Fill in the details in the injection form and click "Preview Trade" to inspect before executing.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
