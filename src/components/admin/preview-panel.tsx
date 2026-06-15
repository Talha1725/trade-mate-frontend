"use client";

import { SectionCard } from "@/components/section-card";
import { CheckCircleIcon, HelpCircleIcon, BrainIcon, TimerIcon, RadarIcon, CloudLightningIcon } from "lucide-react";
import type { TradePreviewData } from "@/types/admin";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  preview: TradePreviewData | null;
  targetAccountLabel?: string;
}

export function PreviewPanel({ preview, targetAccountLabel }: PreviewPanelProps) {
  return (
    <SectionCard
      title="AI Preview"
      description="The backend interprets the prompt, checks market context, and returns a trade draft before anything is injected."
    >
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

          <div className="flex flex-wrap items-center gap-2">
            {preview.confidence != null ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                <BrainIcon className="h-3.5 w-3.5" />
                AI Confidence {Math.round(preview.confidence * 100)}%
              </div>
            ) : null}

            {preview.recommendedScope ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <RadarIcon className="h-3.5 w-3.5" />
                {preview.recommendedScope === "BULK" ? "Bulk push recommended" : "Single account recommended"}
              </div>
            ) : null}

            {preview.timeframe ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <TimerIcon className="h-3.5 w-3.5" />
                {preview.timeframe}
              </div>
            ) : null}

            {preview.source ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                <CloudLightningIcon className="h-3.5 w-3.5" />
                {preview.source}
              </div>
            ) : null}
          </div>

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

            {preview.stopLoss != null || preview.takeProfit != null ? (
              <>
                <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Stop Loss</span>
                  <span className="text-lg font-semibold">{preview.stopLoss != null ? preview.stopLoss.toFixed(4) : "—"}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Take Profit</span>
                  <span className="text-lg font-semibold">{preview.takeProfit != null ? preview.takeProfit.toFixed(4) : "—"}</span>
                </div>
              </>
            ) : null}

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

          {preview.rationale?.length ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Why this preview was generated</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {preview.rationale.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {preview.marketContext?.length ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Market context used by the backend</p>
              <div className="mt-3 grid gap-2">
                {preview.marketContext.slice(0, 5).map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{item.symbol}</span>
                      <span className="text-xs text-muted-foreground">{item.trend}</span>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div className="font-medium text-slate-800">{item.price.toFixed(item.price >= 100 ? 2 : 4)}</div>
                      <div>
                        {item.rangeLow.toFixed(item.rangeLow >= 100 ? 2 : 4)} - {item.rangeHigh.toFixed(item.rangeHigh >= 100 ? 2 : 4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <HelpCircleIcon className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="font-semibold text-sm">No Preview Generated</p>
          <p className="text-xs max-w-[280px] mt-1">
            Fill in the details in the injection form and click &quot;Preview Trade&quot; to inspect before executing.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
