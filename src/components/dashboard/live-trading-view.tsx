"use client";

import { ActivityIcon } from "lucide-react";

import { TradingChart } from "@/components/terminal/trading-chart";
import { mockPositionSummary, mockRecentActivity } from "@/lib/mock-data/dashboard";
import type { LiveTradingViewProps } from "@/types";

export function LiveTradingView({ symbol, positions, recentActivity }: LiveTradingViewProps) {
  const viewPositions = positions?.length ? positions : mockPositionSummary;
  const viewActivity = recentActivity?.length ? recentActivity : mockRecentActivity;
  const resolvedSymbol = symbol ?? viewPositions[0]?.symbol ?? viewActivity[0]?.symbol ?? "EURUSD";
  const openPositions = viewPositions.length;
  const netPnl = viewPositions.reduce((sum, position) => sum + position.profit, 0);
  const activeDirection = viewPositions[0]?.type ?? "Buy";

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Market Symbol</p>
          <p className="mt-2 text-xl font-semibold text-foreground">{resolvedSymbol}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Open Positions</p>
          <p className="mt-2 text-xl font-semibold text-foreground">{openPositions}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Demo P/L</p>
          <p className={`mt-2 text-xl font-semibold ${netPnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {netPnl >= 0 ? "+" : ""}${netPnl.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Bias</p>
          <p className="mt-2 text-xl font-semibold text-foreground">{activeDirection}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <ActivityIcon className="size-4 shrink-0" />
        <span>Public market view for traders. No login required.</span>
      </div>

      <TradingChart
        key={resolvedSymbol}
        symbol={resolvedSymbol}
        title={`Chart - ${resolvedSymbol}`}
        description="TradingView chart for the selected market symbol."
        className="min-h-[520px]"
        contentClassName="min-h-[420px]"
      />
    </div>
  );
}
