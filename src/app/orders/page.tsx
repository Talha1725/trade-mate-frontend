"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ActiveOrdersTable } from "@/components/orders/active-orders-table";
import { DepthChartCard } from "@/components/orders/depth-chart-card";
import { OrderBookCard } from "@/components/orders/order-book-card";
import { OrdersMetricCards } from "@/components/orders/orders-metric-cards";
import { RecentTradesTable } from "@/components/orders/recent-trades-table";
import { PageHeader } from "@/components/page-header";
import { AssetIcon } from "@/components/shared/asset-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ordersApi } from "@/lib/services/orders.api";
import { terminalApi } from "@/lib/services/terminal.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import { useMarketSelectionStore } from "@/lib/stores/market-selection-store";
import { usePriceStream } from "@/hooks/use-price-stream";
import { useUserAccounts } from "@/hooks/use-user-accounts";
import { useSyncedTradingAssets } from "@/hooks/use-synced-trading-assets";
import {
  applyLiveQuoteToOrderOverview,
  buildOrderDepthChart,
  buildOrderMetrics,
  generateEodhdOrderBook,
  sizeLabelFromSymbol,
} from "@/lib/utils/order-market";
import {
  mapPortfolioPositionToActiveOrder,
  mapPortfolioTradeToRecentTrade,
} from "@/lib/utils/trader-data";
import type { OrderOverviewResponse } from "@/types/orders";
import type { PriceSocketPortfolioMessage, PriceSocketQuote } from "@/types/price";

function AssetSelectLabel({
  symbol,
  label,
}: {
  symbol: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <AssetIcon symbol={symbol} label={label} size={20} />
      <span className="font-medium">{label}</span>
    </span>
  );
}

function resolveOrdersInterval(timeframe: string) {
  switch (timeframe) {
    case "1m":
    case "5m":
    case "15m":
      return timeframe;
    case "1H":
      return "1h";
    case "4H":
      return "4h";
    case "D":
      return "1d";
    case "W":
      return "1w";
    default:
      return "1d";
  }
}

export default function OrdersPage() {
  const token = useAuthStore((state) => state.session?.token ?? null);
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
  const selectedMarketId = useMarketSelectionStore((state) => state.selectedMarketId);
  const setSelectedMarketId = useMarketSelectionStore((state) => state.setSelectedMarketId);
  const timeframe = useMarketSelectionStore((state) => state.timeframe);
  const setSelectedAccountId = useSelectedAccountStore((state) => state.setSelectedAccountId);
  const { data: userAccounts } = useUserAccounts();
  const { data: tradingAssets = [], isLoading: isAssetsLoading } = useSyncedTradingAssets();
  const accountListLoaded = userAccounts !== undefined;
  const availableAccounts = React.useMemo(() => userAccounts?.accounts ?? [], [userAccounts?.accounts]);

  const selectedAsset = React.useMemo(
    () => tradingAssets.find((asset) => asset.id === selectedMarketId) ?? tradingAssets[0] ?? null,
    [selectedMarketId, tradingAssets],
  );
  const selectedSymbol = selectedAsset?.symbol ?? "BTCUSDT";
  const sizeLabel = React.useMemo(() => sizeLabelFromSymbol(selectedSymbol), [selectedSymbol]);

  const resolvedAccountId = React.useMemo(() => {
    if (!accountListLoaded) {
      return null;
    }

    if (selectedAccountId && availableAccounts.some((account) => account.id === selectedAccountId)) {
      return selectedAccountId;
    }

    return availableAccounts[0]?.id ?? null;
  }, [accountListLoaded, availableAccounts, selectedAccountId]);

  React.useEffect(() => {
    if (!accountListLoaded) {
      return;
    }

    if (resolvedAccountId !== selectedAccountId) {
      setSelectedAccountId(resolvedAccountId);
    }
  }, [accountListLoaded, resolvedAccountId, selectedAccountId, setSelectedAccountId]);

  const [overview, setOverview] = React.useState<OrderOverviewResponse | null>(null);
  const [liveQuote, setLiveQuote] = React.useState<PriceSocketQuote | null>(null);
  const streamAccountId = overview?.account.id ?? resolvedAccountId;
  const liveQuoteForSymbol = liveQuote?.symbol.toUpperCase() === selectedSymbol.toUpperCase() ? liveQuote : null;

  const refreshOverview = React.useCallback(async () => {
    if (!token || !accountListLoaded || !resolvedAccountId) {
      setOverview(null);
      return;
    }

    try {
      const nextOverview = await ordersApi.getOverview(token, {
        accountId: resolvedAccountId,
        symbol: selectedSymbol,
        interval: resolveOrdersInterval(timeframe),
      });

      setOverview(nextOverview);
    } catch (error) {
      setOverview(null);
      toast.error(error instanceof Error ? error.message : "Unable to load order overview.");
    }
  }, [accountListLoaded, resolvedAccountId, selectedSymbol, timeframe, token]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refreshOverview();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refreshOverview]);

  React.useEffect(() => {
    window.addEventListener("trade-mate:positions-changed", refreshOverview);
    return () => window.removeEventListener("trade-mate:positions-changed", refreshOverview);
  }, [refreshOverview]);

  usePriceStream({
    enabled: Boolean(token && selectedSymbol && accountListLoaded && resolvedAccountId),
    symbols: [selectedSymbol],
    accountIds: streamAccountId ? [streamAccountId] : [],
    onQuotes: (quotes) => {
      const quote = quotes.find((item) => item.symbol.toUpperCase() === selectedSymbol.toUpperCase());
      if (quote) {
        setLiveQuote(quote);
      }
    },
    onPortfolio: (payload: PriceSocketPortfolioMessage) => {
      if (!streamAccountId || !payload.accountIds.includes(streamAccountId)) {
        return;
      }

      setOverview((current) => {
        if (!current || current.account.id !== streamAccountId) {
          return current;
        }

        const nextAccount = payload.accounts.find((item) => item.id === current.account.id);
        const nextPositions = payload.positions.filter((position) => position.accountId === current.account.id);
        const nextTrades = payload.trades.filter((trade) => trade.accountId === current.account.id);

        return {
          ...current,
          account: nextAccount ?? current.account,
          positions: nextPositions,
          trades: nextTrades,
        };
      });
    },
  });

  const liveOverview = React.useMemo(
    () => (overview ? applyLiveQuoteToOrderOverview(overview, liveQuoteForSymbol) : null),
    [liveQuoteForSymbol, overview],
  );

  const currentPrice = liveOverview?.snapshot.price ?? liveOverview?.chart.close ?? 0;
  const metricCards = React.useMemo(
    () => buildOrderMetrics(liveOverview?.account ?? null, liveOverview?.positions ?? [], liveOverview?.trades ?? []),
    [liveOverview?.account, liveOverview?.positions, liveOverview?.trades],
  );
  const activeOrders = React.useMemo(
    () => liveOverview?.positions.map(mapPortfolioPositionToActiveOrder) ?? [],
    [liveOverview?.positions],
  );
  const recentTrades = React.useMemo(
    () =>
      (liveOverview?.trades ?? [])
        .filter((trade) => trade.status === "CLOSED")
        .slice(0, 8)
        .map(mapPortfolioTradeToRecentTrade),
    [liveOverview?.trades],
  );
  const depthChart = React.useMemo(
    () => buildOrderDepthChart(liveOverview?.history.candles ?? [], currentPrice),
    [currentPrice, liveOverview?.history.candles],
  );
  const orderBook = React.useMemo(() => {
    if (!liveOverview) {
      return null;
    }

    if (liveQuoteForSymbol) {
      return generateEodhdOrderBook({
        symbol: selectedSymbol,
        assetCategory: selectedAsset?.category ?? "CRYPTO",
        latestPrice: liveQuoteForSymbol.price,
        bid: liveQuoteForSymbol.bid ?? null,
        ask: liveQuoteForSymbol.ask ?? null,
        levels: 6,
      });
    }

    return liveOverview.orderBook;
  }, [liveOverview, liveQuoteForSymbol, selectedAsset?.category, selectedSymbol]);

  const handleClosePosition = React.useCallback(
    async (positionId: string) => {
      if (!token) return;

      try {
        await terminalApi.closeTrade({ positionId }, token);
        toast.success("Order closed.");
        window.dispatchEvent(new Event("trade-mate:positions-changed"));
        await refreshOverview();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to close order.");
      }
    },
    [refreshOverview, token],
  );

  const handleCloseAll = React.useCallback(async () => {
    if (!token || activeOrders.length === 0) return;

    try {
      await Promise.all(activeOrders.map((order) => terminalApi.closeTrade({ positionId: order.id }, token)));
      toast.success("All active orders closed.");
      window.dispatchEvent(new Event("trade-mate:positions-changed"));
      await refreshOverview();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to close all orders.");
    }
  }, [activeOrders, refreshOverview, token]);

  const handleExport = React.useCallback(() => {
    if (activeOrders.length === 0) return;

    const rows = activeOrders.map((order) =>
      [order.displayId, order.symbol, order.side, order.type, order.qty, order.price].join(","),
    );
    const csv = [["ID", "Symbol", "Side", "Type", "Qty", "Price"].join(","), ...rows].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "active-orders.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [activeOrders]);

  if (!overview) {
    return (
      <AppShell>
        <div className="flex h-[80vh] w-full items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex w-full min-w-0 flex-col gap-6">
        <PageHeader title="Orders" description="View and manage your open orders." />

        {/* <section className="rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-white/60">Selected Asset</p>
              <p className="text-base font-semibold text-white">
                {selectedAsset ? <AssetSelectLabel symbol={selectedAsset.symbol} label={selectedAsset.label} /> : "Loading assets..."}
              </p>
            </div>

            <Select
              value={selectedAsset?.id ?? ""}
              onValueChange={(value) => {
                if (value) {
                  setSelectedMarketId(value);
                }
              }}
              disabled={isAssetsLoading || tradingAssets.length === 0}
            >
              <SelectTrigger className="h-auto min-w-[220px] cursor-pointer border-white/20 bg-[#0C0C0C] px-3 py-2 text-left text-sm text-white shadow-none hover:bg-white/10 focus-visible:border-primary focus-visible:ring-primary/20">
                {selectedAsset ? (
                  <span className="flex items-center gap-2">
                    <AssetIcon symbol={selectedAsset.symbol} label={selectedAsset.label} size={18} />
                    <span>{selectedAsset.label}</span>
                  </span>
                ) : (
                  <span className="text-white/50">Select asset</span>
                )}
              </SelectTrigger>
              <SelectContent className="max-h-[280px] border-white/20 bg-[#0C0C0C] text-white">
                {tradingAssets.map((asset) => (
                  <SelectItem
                    key={asset.id}
                    value={asset.id}
                    className="cursor-pointer rounded-lg py-1.5 text-white focus:bg-white/10 focus:text-white data-highlighted:bg-white/10 data-highlighted:text-white data-selected:border data-selected:border-primary data-selected:bg-primary/10"
                  >
                    <span className="flex items-center gap-2">
                      <AssetIcon symbol={asset.symbol} label={asset.label} size={18} />
                      <span>{asset.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section> */}

        <OrdersMetricCards cards={metricCards} />

        <div className="grid grid-cols-1 gap-5 md:gap-6 xl:grid-cols-2">
          <RecentTradesTable trades={recentTrades} sizeLabel={sizeLabel} />

          <DepthChartCard
            dataByLevel={depthChart.dataByLevel}
            defaultLevel={depthChart.defaultLevel}
            priceMin={depthChart.priceMin}
            priceMax={depthChart.priceMax}
            centerPrice={depthChart.centerPrice}
            axisTicks={depthChart.axisTicks}
            isLoading={overview === null}
          />
        </div>

        <OrderBookCard snapshot={orderBook} sizeLabel={sizeLabel} />

        <ActiveOrdersTable
          orders={activeOrders}
          onCancel={handleClosePosition}
          onCloseAll={handleCloseAll}
          onExport={handleExport}
        />
      </div>
    </AppShell>
  );
}
