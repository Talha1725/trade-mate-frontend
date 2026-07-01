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
  mockTradingFilterOhlcv,
  mockTradingFilterQuote,
} from "@/lib/mock-data/trading-filter-bar";
import { mockOpenPositionsStrip } from "@/lib/mock-data/open-positions-strip";
import { dashboardApi } from "@/lib/services/dashboard.api";
import { useAccountWishlist } from "@/hooks/use-account-wishlist";
import { useResolvedAccountNumber } from "@/hooks/use-resolved-account-number";
import { useSyncedTradingAssets } from "@/hooks/use-synced-trading-assets";
import { useMarketSelectionStore } from "@/lib/stores/market-selection-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import { mapTimeframeToTradingViewInterval } from "@/lib/utils/trading-view";
import { buildDashboardData } from "@/lib/utils/trader-data";
import type { AccountLedgerResponse, UserPortfolioResponse } from "@/types/dashboard";
import { usePriceStream } from "@/hooks/use-price-stream";
import { PriceSocketPortfolioMessage } from "@/types";

export default function DashboardPage() {
  const [snapshot, setSnapshot] = React.useState<UserPortfolioResponse | null>(null);
  const [ledger, setLedger] = React.useState<AccountLedgerResponse | null>(null);
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

  const accountNumber = useResolvedAccountNumber(snapshot?.account.accountNumber);
  const {
    watchlistItems,
    wishlistAssetIds,
    toggleWishlistAsset,
    isLoading: isWishlistLoading,
  } = useAccountWishlist(accountNumber, tradingAssets);

  const selectedWatchlistItem = watchlistItems.find(
    (item) => item.id === selectedMarketId,
  );
  const selectedFilterAsset = tradingAssets.find(
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
    ? tradingAssets.find((asset) => asset.id === compareAssetId)
    : null;
  const compareSymbol =
    compareWatchlistItem?.symbol ?? compareFilterAsset?.symbol ?? null;
  const chartInterval = mapTimeframeToTradingViewInterval(timeframe);

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
          accountNumber={snapshot?.account.accountNumber}
          quote={mockTradingFilterQuote}
          ohlcv={mockTradingFilterOhlcv}
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
              items={watchlistItems}
              isLoading={isWishlistLoading}
              selectedItemId={selectedMarketId}
              onItemSelect={setSelectedMarketId}
              onWatchlistToggle={toggleWishlistAsset}
            />
            <MarketSnapshotCard />
          </div>
        </div>

        <OpenPositionsStripCard items={mockOpenPositionsStrip} />
      </div>
    </AppShell>
  );
}
