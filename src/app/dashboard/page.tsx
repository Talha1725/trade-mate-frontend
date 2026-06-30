"use client";

import * as React from "react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { TradingFilterBar } from "@/components/dashboard/trading-filter-bar";
import { LiveTradingView } from "@/components/common/live-trading-view";
import { MarketWatchCard } from "@/components/dashboard/market-watch-card";
import { MarketSnapshotCard } from "@/components/dashboard/market-snapshot-card";
import { OpenPositionsStripCard } from "@/components/dashboard/open-positions-strip-card";
import {
  mockTradingFilterAssets,
  mockTradingFilterOhlcv,
  mockTradingFilterQuote,
} from "@/lib/mock-data/trading-filter-bar";
import { DEFAULT_WATCHLIST_ASSET_IDS } from "@/lib/mock-data/market-watch-card";
import { mockOpenPositionsStrip } from "@/lib/mock-data/open-positions-strip";
import { buildWatchlistFromAssets } from "@/lib/utils/watchlist";
import { dashboardApi } from "@/lib/services/dashboard.api";
import { useMarketSelectionStore } from "@/lib/stores/market-selection-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import { mapTimeframeToTradingViewInterval } from "@/lib/utils/trading-view";
import { buildDashboardData } from "@/lib/utils/trader-data";
import type { AccountLedgerResponse, UserPortfolioResponse } from "@/types/dashboard";
import type { TradingTimeframe } from "@/types/trading-filter-bar";
import { usePriceStream } from "@/hooks/use-price-stream";
import { PriceSocketPortfolioMessage } from "@/types";

export default function DashboardPage() {
  const [snapshot, setSnapshot] = React.useState<UserPortfolioResponse | null>(null);
  const [ledger, setLedger] = React.useState<AccountLedgerResponse | null>(null);
  const selectedMarketId = useMarketSelectionStore((state) => state.selectedMarketId);
  const setSelectedMarketId = useMarketSelectionStore((state) => state.setSelectedMarketId);
  const [timeframe, setTimeframe] = React.useState<TradingTimeframe>("4H");
  const [compareAssetId, setCompareAssetId] = React.useState<string | null>(null);
  const [watchlistIds, setWatchlistIds] = React.useState<string[]>([
    ...DEFAULT_WATCHLIST_ASSET_IDS,
  ]);
  const token = useAuthStore((state) => state.session?.token ?? null);
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);

  React.useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const refreshDashboard = async () => {
      try {
        const accountSnapshot = await dashboardApi.getPortfolioSnapshot(token, selectedAccountId ?? undefined);

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
        // Keep the last successful snapshot/ledger visible if a refresh fails.
      } finally {
        if (isMounted) {
          timeoutId = setTimeout(() => {
            void refreshDashboard();
          }, 2500);
        }
      }
    };

    void refreshDashboard();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedAccountId, token]);

  const dashboardData = snapshot ? buildDashboardData(snapshot, ledger ?? undefined) : null;
  const liveSymbol = dashboardData?.positions[0]?.symbol;
  const openSymbols = React.useMemo(
    () =>
      Array.from(
        new Set(
          (dashboardData?.positions ?? [])
            .filter((position) => position.status === "OPEN")
            .map((position) => position.symbol),
        ),
      ),
    [dashboardData?.positions],
  );
  const subscriptionSymbols = React.useMemo(
    () => (openSymbols.length > 0 ? openSymbols : liveSymbol ? [liveSymbol] : []),
    [liveSymbol, openSymbols],
  );
  const accountId = snapshot?.account.id ?? selectedAccountId ?? null;

  usePriceStream({
    enabled: !!token && !!accountId,
    symbols: subscriptionSymbols,
    accountIds: accountId ? [accountId] : [],
    onPortfolio: (payload: PriceSocketPortfolioMessage) => {
      const account = payload.accounts[0];

      if (!account) {
        return;
      }

      setSnapshot({
        account: {
          ...account,
        },
        positions: payload.positions,
      });

      setLedger({
        account: {
          ...account,
        },
        positions: payload.positions,
        trades: payload.trades,
      });
    },
  });

  const watchlistItems = React.useMemo(
    () => buildWatchlistFromAssets(watchlistIds, mockTradingFilterAssets),
    [watchlistIds],
  );

  const handleWatchlistToggle = React.useCallback((assetId: string) => {
    setWatchlistIds((current) =>
      current.includes(assetId)
        ? current.filter((id) => id !== assetId)
        : [...current, assetId],
    );
  }, []);

  const initialMarketId = React.useMemo(() => {
    if (!liveSymbol) {
      return mockTradingFilterAssets[0]?.id ?? "btcusdt";
    }

    const matchedAsset = mockTradingFilterAssets.find(
      (asset) => asset.symbol.toUpperCase() === liveSymbol.toUpperCase(),
    );

    return matchedAsset?.id ?? mockTradingFilterAssets[0]?.id ?? "btcusdt";
  }, [liveSymbol]);

  React.useEffect(() => {
    setSelectedMarketId(initialMarketId);
  }, [initialMarketId]);

  React.useEffect(() => {
    if (compareAssetId && compareAssetId === selectedMarketId) {
      setCompareAssetId(null);
    }
  }, [compareAssetId, selectedMarketId]);

  const selectedWatchlistItem = watchlistItems.find(
    (item) => item.id === selectedMarketId,
  );
  const selectedFilterAsset = mockTradingFilterAssets.find(
    (asset) => asset.id === selectedMarketId,
  );
  const chartSymbol =
    selectedWatchlistItem?.symbol ??
    selectedFilterAsset?.symbol ??
    liveSymbol ??
    "BTCUSDT";
  const compareWatchlistItem = compareAssetId
    ? watchlistItems.find((item) => item.id === compareAssetId)
    : null;
  const compareFilterAsset = compareAssetId
    ? mockTradingFilterAssets.find((asset) => asset.id === compareAssetId)
    : null;
  const compareSymbol =
    compareWatchlistItem?.symbol ?? compareFilterAsset?.symbol ?? null;
  const chartInterval = mapTimeframeToTradingViewInterval(timeframe);
  const compareItems = watchlistItems.map((item) => ({
    id: item.id,
    symbol: item.symbol,
    name: item.name,
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
          watchlistAssetIds={watchlistIds}
          onWatchlistToggle={handleWatchlistToggle}
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
              items={watchlistItems}
              selectedItemId={selectedMarketId}
              onItemSelect={setSelectedMarketId}
              onWatchlistToggle={handleWatchlistToggle}
            />
            <MarketSnapshotCard />
          </div>
        </div>

        <OpenPositionsStripCard items={mockOpenPositionsStrip} />
      </div>
    </AppShell>
  );
}
