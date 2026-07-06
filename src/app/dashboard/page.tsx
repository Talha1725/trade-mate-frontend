"use client";

import * as React from "react";

import { AppShell } from "@/components/app-shell";
import { LiveTradingView } from "@/components/common/live-trading-view";
import { MarketSnapshotCard } from "@/components/dashboard/market-snapshot-card";
import { MarketWatchCard } from "@/components/dashboard/market-watch-card";
import { OpenPositionsStripCard } from "@/components/dashboard/open-positions-strip-card";
import { TradingFilterBar } from "@/components/dashboard/trading-filter-bar";
import { PageHeader } from "@/components/page-header";

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
import { mergeStablePositions } from "@/lib/utils/stable-positions";
import { resolveMarketWatchIcon } from "@/lib/utils/market-symbol-icon";
import type { AccountLedgerResponse, UserPortfolioResponse } from "@/types/dashboard";
import type { MarketSnapshotChartSummary, MarketSnapshotData } from "@/types/market-snapshot";
import type { MarketWatchItem } from "@/types/market-watch-card";
import type { OpenPositionStripItem } from "@/types/open-positions-strip";
import type { PortfolioPosition } from "@/types/dashboard";
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
  const [livePositions, setLivePositions] = React.useState<PortfolioPosition[]>([]);
  const [liveQuotes, setLiveQuotes] = React.useState<Record<string, PriceSocketQuote>>({});
  const openPositionOrderRef = React.useRef(new Map<string, number>());
  const openPositionOrderCounterRef = React.useRef(0);
  const livePositionMissingCountsRef = React.useRef(new Map<string, number>());

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

        setSnapshot((current) => {
          if (!current) {
            return accountSnapshot;
          }

          return {
            ...accountSnapshot,
            positions: mergeStablePositions(
              current.positions,
              accountSnapshot.positions,
              livePositionMissingCountsRef.current,
            ),
          };
        });

        const accountLedger = await dashboardApi.getAccountLedger(accountSnapshot.account.id, token);

        if (!isMounted) {
          return;
        }

        setLedger((current) => {
          if (!current) {
            return accountLedger;
          }

          return {
            ...accountLedger,
            positions: mergeStablePositions(
              current.positions,
              accountLedger.positions,
              livePositionMissingCountsRef.current,
            ),
          };
        });
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
  const openPortfolioPositions = React.useMemo(
    () => dashboardData?.positions.filter((position) => position.status === "OPEN") ?? [],
    [dashboardData?.positions],
  );

  React.useEffect(() => {
    if (openPortfolioPositions.length === 0) {
      setLivePositions([]);
      return;
    }

    for (const position of openPortfolioPositions) {
      if (!openPositionOrderRef.current.has(position.id)) {
        openPositionOrderRef.current.set(position.id, openPositionOrderCounterRef.current += 1);
      }
    }

    const nextPositions = [...openPortfolioPositions].sort((left, right) => {
      const leftOrder = openPositionOrderRef.current.get(left.id) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = openPositionOrderRef.current.get(right.id) ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });

    setLivePositions(nextPositions);
  }, [openPortfolioPositions]);
  const openSymbols = React.useMemo(
    () =>
      Array.from(
        new Set(
          openPortfolioPositions
            .map((position) => position.symbol),
        ),
      ),
    [openPortfolioPositions],
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
        : { price: 0, change: 0, changePercent: 0 },
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
        : { open: 0, high: 0, low: 0, volume: 0 },
    [marketChart],
  );

  function buildPositionTrend(entryPrice: number, currentPrice: number, side: "long" | "short") {
    const base = entryPrice || currentPrice || 0;
    const end = currentPrice || base;
    const delta = end - base;
    const amplitude = Math.max(Math.abs(delta) * 0.18, Math.max(base * 0.003, 0.5));

    return Array.from({ length: 8 }, (_, index) => {
      const progress = index / 7;
      const wave = Math.sin(progress * Math.PI * 1.8) * amplitude * 0.28;
      const directionBias = side === "long" ? amplitude * 0.05 : -amplitude * 0.05;
      const value = base + delta * progress + wave + directionBias;

      return { value: Number(value.toFixed(4)) };
    });
  }

  function mapPositionToOpenStripItem(position: PortfolioPosition): OpenPositionStripItem {
    const entryPrice = Number(position.entryPrice);
    const liveQuote = liveQuotes[position.symbol.toUpperCase()];
    const currentPrice = Number(liveQuote?.price ?? position.currentPrice ?? position.entryPrice);
    const lots = Number(position.lots);
    const isLong = position.direction === "BUY";
    const side = isLong ? "long" : "short";
    const pnl =
      position.floatingPnl != null && position.floatingPnl !== ""
        ? Number(position.floatingPnl)
        : (isLong ? currentPrice - entryPrice : entryPrice - currentPrice) * lots;
    const pnlPercent = entryPrice > 0
      ? ((isLong ? currentPrice - entryPrice : entryPrice - currentPrice) / entryPrice) * 100
      : 0;
    const sizeUnit = position.symbol.replace(/USD$/i, "") || position.symbol;

    return {
      id: position.id,
      symbol: position.symbol,
      icon: resolveMarketWatchIcon(position.symbol) ?? "bitcoin",
      side,
      pnl: Number(pnl.toFixed(2)),
      pnlPercent: Number(pnlPercent.toFixed(2)),
      sizeLabel: `${lots.toFixed(4)} ${sizeUnit}`,
      entryLabel: `Entry ${entryPrice.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      trend: buildPositionTrend(entryPrice, currentPrice, side),
      palette: pnl >= 0 ? "profit" : "loss",
    };
  }

  const openPositionItems = React.useMemo(
    () => livePositions.slice(0, 4).map(mapPositionToOpenStripItem),
    [livePositions, liveQuotes],
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

      setLiveQuotes((current) => {
        const nextQuotes = { ...current };

        for (const quote of quotes) {
          nextQuotes[quote.symbol.toUpperCase()] = quote;
        }

        return nextQuotes;
      });
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

  const resolvePortfolioAccount = React.useCallback(
    (payload: PriceSocketPortfolioMessage) => {
      if (accountId) {
        const matchedAccount = payload.accounts.find((item) => item.id === accountId);

        if (matchedAccount) {
          return matchedAccount;
        }

        return null;
      }

      return payload.accounts[0] ?? null;
    },
    [accountId],
  );

  usePriceStream({
    enabled: !!token && (subscriptionMarketSymbols.length > 0 || watchlistMarketSymbols.length > 0),
    symbols: Array.from(new Set([...subscriptionMarketSymbols, ...watchlistMarketSymbols])),
    accountIds: accountId ? [accountId] : [],
    onQuotes: handleMarketQuotes,
    onPortfolio: (payload: PriceSocketPortfolioMessage) => {
      const account = resolvePortfolioAccount(payload);

      if (!account) {
        return;
      }

      const closedIds = new Set(
        payload.trades
          .filter((trade) => trade.status === "CLOSED" && trade.positionId)
          .map((trade) => trade.positionId as string),
      );

      setSnapshot((current) => {
        if (!current) {
          return {
            account: {
              ...account,
            },
            positions: payload.positions,
          };
        }

        return {
          ...current,
          account: {
            ...account,
          },
          positions: mergeStablePositions(
            current.positions,
            payload.positions,
            livePositionMissingCountsRef.current,
            { closedIds },
          ),
        };
      });

      setLedger((current) => {
        if (!current) {
          return {
            account: {
              ...account,
            },
            positions: payload.positions,
            trades: payload.trades,
          };
        }

        return {
          ...current,
          account: {
            ...account,
          },
          positions: mergeStablePositions(
            current.positions,
            payload.positions,
            livePositionMissingCountsRef.current,
            { closedIds },
          ),
          trades: payload.trades,
        };
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

        <OpenPositionsStripCard items={openPositionItems} />
      </div>
    </AppShell>
  );
}
