"use client";
import { useEffect, useMemo, useState } from "react";

import { TradingFilterBar } from "@/components/dashboard/trading-filter-bar";
import { TradingChart } from "@/components/terminal/trading-chart";
import type { LiveTradingViewProps } from "@/types";

export function LiveTradingView({
  symbol,
  compareSymbol = null,
  interval = "60",
}: LiveTradingViewProps) {
  const chartSymbol = symbol ?? "BTCUSD";

  return (
    <TradingChart
      symbol={chartSymbol}
      compareSymbol={compareSymbol}
      interval={interval}
      title={`Chart - ${chartSymbol}`}
      description={
        compareSymbol
          ? `Comparing ${chartSymbol} with ${compareSymbol} on TradingView.`
          : "TradingView chart for the selected market symbol."
      }
      className="min-h-[520px] bg-gradient-to-b from-white/5 to-white/10"
      contentClassName="min-h-[420px]"
    />
  );
}
