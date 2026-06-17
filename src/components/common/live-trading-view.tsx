"use client";

import { useEffect, useMemo, useState } from "react";

import { TradingFilterBar } from "@/components/dashboard/trading-filter-bar";
import { TradingChart } from "@/components/terminal/trading-chart";
import {
  mockTradingFilterAssets,
  mockTradingFilterOhlcv,
  mockTradingFilterQuote,
} from "@/lib/mock-data/trading-filter-bar";
import { mockPositionSummary, mockRecentActivity } from "@/lib/mock-data/dashboard";
import type { LiveTradingViewProps } from "@/types";
import type { TradingTimeframe } from "@/types/trading-filter-bar";

export function LiveTradingView({
  symbol,
  positions,
  recentActivity,
  filterAssets,
  filterQuote,
  filterOhlcv,
  filterTimeframe,
  onFilterAssetChange,
  onFilterTimeframeChange,
}: LiveTradingViewProps) {
  const viewPositions = positions?.length ? positions : mockPositionSummary;
  const viewActivity = recentActivity?.length ? recentActivity : mockRecentActivity;
  const resolvedSymbol = symbol ?? viewPositions[0]?.symbol ?? viewActivity[0]?.symbol ?? "EURUSD";

  const assets = filterAssets ?? mockTradingFilterAssets;
  const initialAssetId = useMemo(() => {
    const matchedAsset = assets.find(
      (asset) => asset.symbol.toUpperCase() === resolvedSymbol.toUpperCase(),
    );

    return matchedAsset?.id ?? assets[0]?.id ?? "btcusd";
  }, [assets, resolvedSymbol]);

  const [selectedAssetId, setSelectedAssetId] = useState(initialAssetId);
  const [timeframe, setTimeframe] = useState<TradingTimeframe>(filterTimeframe ?? "4H");

  useEffect(() => {
    setSelectedAssetId(initialAssetId);
  }, [initialAssetId]);

  const selectedAsset =
    assets.find((asset) => asset.id === selectedAssetId) ?? assets[0];
  const chartSymbol = selectedAsset?.symbol ?? resolvedSymbol;

  const handleAssetChange = (assetId: string) => {
    setSelectedAssetId(assetId);
    onFilterAssetChange?.(assetId);
  };

  const handleTimeframeChange = (nextTimeframe: TradingTimeframe) => {
    setTimeframe(nextTimeframe);
    onFilterTimeframeChange?.(nextTimeframe);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <TradingFilterBar
        assets={assets}
        selectedAssetId={selectedAssetId}
        onAssetChange={handleAssetChange}
        quote={filterQuote ?? mockTradingFilterQuote}
        ohlcv={filterOhlcv ?? mockTradingFilterOhlcv}
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
      />

      <TradingChart
        key={chartSymbol}
        symbol={chartSymbol}
        title={`Chart - ${chartSymbol}`}
        description="TradingView chart for the selected market symbol."
        className="min-h-[520px]"
        contentClassName="min-h-[420px]"
      />
    </div>
  );
}
