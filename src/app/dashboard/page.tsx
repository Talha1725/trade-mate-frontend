"use client";

import * as React from "react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { TradingFilterBar } from "@/components/dashboard/trading-filter-bar";
import { LiveTradingView } from "@/components/dashboard/live-trading-view";
import { MarketWatchCard } from "@/components/dashboard/market-watch-card";
import { MarketSnapshotCard } from "@/components/dashboard/market-snapshot-card";
import { OpenPositionsStripCard } from "@/components/dashboard/open-positions-strip-card";
import { EquityChart } from "@/components/dashboard/equity-chart";
import { BreakdownWidgets } from "@/components/dashboard/breakdown-widgets";
import { StatCards } from "@/components/dashboard/stat-cards";
import { OpenPositionsSummary } from "@/components/dashboard/open-positions-summary";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  mockTradingFilterAssets,
  mockTradingFilterOhlcv,
  mockTradingFilterQuote,
} from "@/lib/mock-data/trading-filter-bar";
import { mockOpenPositionsStrip } from "@/lib/mock-data/open-positions-strip";
import { mockWatchlistItems } from "@/lib/mock-data/market-watch-card";
import { dashboardApi } from "@/lib/services/dashboard.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { mapTimeframeToTradingViewInterval } from "@/lib/utils/trading-view";
import { buildDashboardData } from "@/lib/utils/trader-data";
import type { AccountLedgerResponse, UserPortfolioResponse } from "@/types/dashboard";
import type { TradingTimeframe } from "@/types/trading-filter-bar";

export default function DashboardPage() {
  const [snapshot, setSnapshot] = React.useState<UserPortfolioResponse | null>(null);
  const [ledger, setLedger] = React.useState<AccountLedgerResponse | null>(null);
  const [selectedMarketId, setSelectedMarketId] = React.useState(
    mockWatchlistItems[0]?.id ?? "btcusd",
  );
  const [timeframe, setTimeframe] = React.useState<TradingTimeframe>("4H");
  const [compareAssetId, setCompareAssetId] = React.useState<string | null>(null);
  const token = useAuthStore((state) => state.session?.token ?? null);

  React.useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const accountSnapshot = await dashboardApi.getPortfolioSnapshot(token);

        if (!isMounted) {
          return;
        }

        setSnapshot(accountSnapshot);

        const accountLedger = await dashboardApi.getAccountLedger(accountSnapshot.account.id, token);

        if (!isMounted) {
          return;
        }

        setLedger(accountLedger);
      } catch {
        if (isMounted) {
          setSnapshot(null);
          setLedger(null);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const dashboardData = snapshot ? buildDashboardData(snapshot, ledger ?? undefined) : null;
  const liveSymbol = dashboardData?.positions[0]?.symbol;

  const initialMarketId = React.useMemo(() => {
    if (!liveSymbol) {
      return mockWatchlistItems[0]?.id ?? "btcusd";
    }

    const matchedItem = mockWatchlistItems.find(
      (item) => item.symbol.toUpperCase() === liveSymbol.toUpperCase(),
    );

    return matchedItem?.id ?? mockWatchlistItems[0]?.id ?? "btcusd";
  }, [liveSymbol]);

  React.useEffect(() => {
    setSelectedMarketId(initialMarketId);
  }, [initialMarketId]);

  React.useEffect(() => {
    if (compareAssetId && compareAssetId === selectedMarketId) {
      setCompareAssetId(null);
    }
  }, [compareAssetId, selectedMarketId]);

  const selectedWatchlistItem = mockWatchlistItems.find(
    (item) => item.id === selectedMarketId,
  );
  const selectedFilterAsset = mockTradingFilterAssets.find(
    (asset) => asset.id === selectedMarketId,
  );
  const chartSymbol =
    selectedWatchlistItem?.symbol ??
    selectedFilterAsset?.symbol ??
    liveSymbol ??
    "BTCUSD";
  const compareWatchlistItem = compareAssetId
    ? mockWatchlistItems.find((item) => item.id === compareAssetId)
    : null;
  const compareFilterAsset = compareAssetId
    ? mockTradingFilterAssets.find((asset) => asset.id === compareAssetId)
    : null;
  const compareSymbol =
    compareWatchlistItem?.symbol ?? compareFilterAsset?.symbol ?? null;
  const chartInterval = mapTimeframeToTradingViewInterval(timeframe);
  const compareItems = mockWatchlistItems.map((item) => ({
    id: item.id,
    symbol: item.symbol,
    name: item.name,
    icon: item.icon,
  }));

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="Account overview, equity curve, and trading performance."
        />

        <TradingFilterBar
          assets={mockTradingFilterAssets}
          selectedAssetId={selectedMarketId}
          onAssetChange={setSelectedMarketId}
          quote={mockTradingFilterQuote}
          ohlcv={mockTradingFilterOhlcv}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          compareItems={compareItems}
          compareAssetId={compareAssetId}
          onCompareChange={setCompareAssetId}
        />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            <LiveTradingView
              symbol={chartSymbol}
              compareSymbol={compareSymbol}
              interval={chartInterval}
            />
          </div>
          <div className="col-span-12 flex flex-col gap-6 xl:col-span-4">
            <MarketWatchCard
              items={mockWatchlistItems}
              selectedItemId={selectedMarketId}
              onItemSelect={setSelectedMarketId}
            />
            <MarketSnapshotCard />
          </div>
        </div>

        <OpenPositionsStripCard items={mockOpenPositionsStrip} />
      </div>
    </AppShell>
  );
}
