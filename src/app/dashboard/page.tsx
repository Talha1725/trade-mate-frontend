"use client";

import * as React from "react";

import { AppShell } from "@/components/app-shell";
import { LiveTradingView } from "@/components/common/live-trading-view";
import { MarketSnapshotCard } from "@/components/dashboard/market-snapshot-card";
import { MarketWatchCard } from "@/components/dashboard/market-watch-card";
import { OpenPositionsStripCard } from "@/components/dashboard/open-positions-strip-card";
import { TradingFilterBar } from "@/components/dashboard/trading-filter-bar";
import { PageHeader } from "@/components/page-header";
import { mockOpenPositionsStrip } from "@/lib/mock-data/open-positions-strip";
import { mockTradingFilterOhlcv, mockTradingFilterQuote } from "@/lib/mock-data/trading-filter-bar";
import { dashboardApi } from "@/lib/services/dashboard.api";
import { marketApi } from "@/lib/services/market.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMarketSelectionStore } from "@/lib/stores/market-selection-store";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import {
  mapTimeframeToMarketInterval,
  mapTimeframeToTradingViewInterval,
} from "@/lib/utils/trading-view";
import { buildDashboardData } from "@/lib/utils/trader-data";
import type { AccountLedgerResponse, UserPortfolioResponse } from "@/types/dashboard";
import type { MarketSnapshotChartSummary, MarketSnapshotData } from "@/types/market-snapshot";
import type { MarketWatchItem } from "@/types/market-watch-card";
import type { PriceSocketPortfolioMessage, PriceSocketQuote } from "@/types";
import { usePriceStream } from "@/hooks/use-price-stream";
import { useAccountWishlist } from "@/hooks/use-account-wishlist";
import { useResolvedAccountNumber } from "@/hooks/use-resolved-account-number";
import { useSyncedTradingAssets } from "@/hooks/use-synced-trading-assets";

export default function DashboardPage() {
  const [snapshot, setSnapshot] = React.useState<UserPortfolioResponse | null>(null);
  const [ledger, setLedger] = React.useState<AccountLedgerResponse | null>(null);
  const [marketSnapshot, setMarketSnapshot] = React.useState<MarketSnapshotData | null>(null);
  const [marketChart, setMarketChart] = React.useState<MarketSnapshotChartSummary | null>(null);

  const selectedMarketId = useMarketSelectionStore((state) => state.selectedMarketId);
  const setSelectedMarketId = useMarketSelectionStore((state) => state.setSelectedMarketId);
  const compareAssetId = useMarketSelectionStore((state) => state.compareAssetId);
  const setCompareAssetId = useMarketSelectionStore((state) => state.setCompareAssetId);
  const timeframe = useMarketSelectionStore((state) => state.timeframe);
  const setTimeframe = useMarketSelectionStore((state) => state.setTimeframe);

  const token = useAuthStore((state) => state.session?.token ?? null);
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
  const { data: tradingAssets = [] } = useSyncedTradingAssets();

  React.useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const refreshDashboard = async () => {
      try {
        const accountSnapshot = await dashboardApi.getPortfolioSnapshot(
          token,
          selectedAccountId ?? undefined,
        );

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
  const accountId = snapshot?.account.id ?? selectedAccountId ?? null;

  const accountNumber = useResolvedAccountNumber(snapshot?.account.accountNumber);
  const {
    watchlistItems: accountWatchlistItems,
    toggleWishlistAsset,
    isLoading: isWishlistLoading,
  } = useAccountWishlist(accountNumber, tradingAssets);
  const [liveWatchlistItems, setLiveWatchlistItems] = React.useState<MarketWatchItem[]>([]);

  React.useEffect(() => {
    setLiveWatchlistItems(accountWatchlistItems);
  }, [accountWatchlistItems]);

  const selectedWatchlistItem = liveWatchlistItems.find((item) => item.id === selectedMarketId);
  const selectedFilterAsset = tradingAssets.find((asset) => asset.id === selectedMarketId);
  const chartSymbol =
    selectedWatchlistItem?.symbol ?? selectedFilterAsset?.symbol ?? liveSymbol ?? "BTCUSDT";
  const compareWatchlistItem = compareAssetId
    ? liveWatchlistItems.find((item) => item.id === compareAssetId)
    : null;
  const compareFilterAsset = compareAssetId
    ? tradingAssets.find((asset) => asset.id === compareAssetId)
    : null;
  const compareSymbol = compareWatchlistItem?.symbol ?? compareFilterAsset?.symbol ?? null;
  const chartInterval = mapTimeframeToTradingViewInterval(timeframe);
  const marketInterval = mapTimeframeToMarketInterval(timeframe);

  React.useEffect(() => {
    if (compareAssetId && compareAssetId === selectedMarketId) {
      setCompareAssetId(null);
    }
  }, [compareAssetId, selectedMarketId]);

  React.useEffect(() => {
    if (!token || !chartSymbol) {
      return;
    }

    let isMounted = true;
    setMarketSnapshot(null);
    setMarketChart(null);

    const refreshMarketSnapshot = async () => {
      try {
        const response = await marketApi.getSnapshot(chartSymbol, marketInterval);

        if (!isMounted) {
          return;
        }

        setMarketSnapshot(response.snapshot);
        setMarketChart(response.chart);
      } catch {
        if (!isMounted) {
          return;
        }
      }
    };

    void refreshMarketSnapshot();

    return () => {
      isMounted = false;
    };
  }, [chartSymbol, marketInterval, token]);

  const filterBarQuote = React.useMemo(
    () =>
      marketChart
        ? {
            price: marketSnapshot?.price ?? marketChart.close,
            change:
              marketSnapshot?.price != null
                ? marketSnapshot.price * ((marketSnapshot.changePercent ?? 0) / 100)
                : marketChart.change,
            changePercent: marketSnapshot?.changePercent ?? marketChart.changePercent,
          }
        : mockTradingFilterQuote,
    [marketChart, marketSnapshot?.changePercent, marketSnapshot?.price],
  );
  const filterBarOhlcv = React.useMemo(
    () =>
      marketChart
        ? {
            open: marketChart.open,
            high: marketChart.high,
            low: marketChart.low,
            volume: marketChart.volume,
          }
        : mockTradingFilterOhlcv,
    [marketChart],
  );

  const handleMarketQuotes = React.useCallback(
    (quotes: PriceSocketQuote[]) => {
      const liveQuote =
        quotes.find((quote) => quote.symbol.toUpperCase() === chartSymbol.toUpperCase()) ?? quotes[0];

      if (!liveQuote) {
        return;
      }

      setMarketSnapshot((current) => {
        if (!current) {
          return current;
        }

        const nextSparkline =
          current.sparkline.length > 0
            ? [...current.sparkline.slice(1), { value: liveQuote.price }]
            : current.sparkline;

        return {
          ...current,
          price: liveQuote.price,
          changePercent: liveQuote.changePercent ?? current.changePercent,
          sparkline: nextSparkline,
        };
      });

      setMarketChart((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          close: liveQuote.price,
        };
      });

      setLiveWatchlistItems((current) =>
        current.map((item) => {
          const quote = quotes.find((candidate) => candidate.symbol.toUpperCase() === item.symbol.toUpperCase());

          if (!quote) {
            return item;
          }

          return {
            ...item,
            price: quote.price,
            changePercent: quote.changePercent ?? item.changePercent,
          };
        }),
      );
    },
    [chartSymbol],
  );

  const subscriptionMarketSymbols = React.useMemo(
    () => Array.from(new Set([chartSymbol, ...openSymbols].filter(Boolean))),
    [chartSymbol, openSymbols],
  );
  const watchlistMarketSymbols = React.useMemo(
    () => liveWatchlistItems.map((item) => item.symbol),
    [liveWatchlistItems],
  );

  usePriceStream({
    enabled: !!token && (subscriptionMarketSymbols.length > 0 || watchlistMarketSymbols.length > 0),
    symbols: Array.from(new Set([...subscriptionMarketSymbols, ...watchlistMarketSymbols])),
    accountIds: accountId ? [accountId] : [],
    onQuotes: handleMarketQuotes,
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

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="Account overview, equity curve, and trading performance."
        />

        <TradingFilterBar
          assets={tradingAssets}
          selectedAssetId={selectedMarketId}
          onAssetChange={setSelectedMarketId}
          quote={filterBarQuote}
          ohlcv={filterBarOhlcv}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
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
              items={liveWatchlistItems}
              selectedItemId={selectedMarketId}
              onItemSelect={setSelectedMarketId}
              onWatchlistToggle={toggleWishlistAsset}
            />
            <MarketSnapshotCard data={marketSnapshot ?? undefined} />
          </div>
        </div>

        <OpenPositionsStripCard items={mockOpenPositionsStrip} />
      </div>
    </AppShell>
  );
}
