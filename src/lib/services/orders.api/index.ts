import { ROUTES } from "@/constant/routes";
import { get, patch } from "@/lib/utils/api";
import { MARKET_INTERVAL_TO_V2_INTERVAL_MAP, V2_TIMEFRAME_INTERVAL_MAP } from "@/constants/v2-market";
import { getV2MarketCandles, getV2MarketSnapshot } from "@/lib/services/v2-market-snapshot.api";
import { buildOrderBookSnapshot, buildOrderDepthChart, generateEodhdOrderBook } from "@/lib/utils/order-market";
import { getTradesFromV2Response, mapV2Account } from "@/lib/utils/v2-dashboard-adapters";
import type { OrderOverviewResponse, TradeProtectionModification, TradeProtectionModificationResponse } from "@/types/orders";
import type { MarketCandle, MarketSymbolRecord } from "@/types/market";
import type { AssetCategory } from "@/types/asset";
import type { V2AccountListResponse, V2TradeListResponse } from "@/types/v2-dashboard";

function resolveAccount(response: V2AccountListResponse, accountId?: string) {
  const accounts = Array.isArray(response) ? response : response.accounts;
  return accountId ? accounts.find((account) => account.id === accountId) : accounts[0];
}

function mapCandles(candles: Awaited<ReturnType<typeof getV2MarketCandles>>): MarketCandle[] {
  return candles.map((candle) => ({
    time: candle.openTime,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume,
  }));
}

function mapSelectedAsset({
  symbol,
  label,
  category,
}: {
  symbol: string;
  label?: string;
  category?: string;
}): MarketSymbolRecord {
  const normalizedSymbol = symbol.toUpperCase();
  const assetClass = category === "COMMODITIES" || category === "INDICES" ? "INDEX" : category;

  return {
    id: normalizedSymbol,
    displaySymbol: normalizedSymbol,
    internalSymbol: normalizedSymbol,
    providerSymbol: normalizedSymbol,
    assetClass: assetClass === "FOREX" || assetClass === "STOCK" || assetClass === "INDEX" ? assetClass : "CRYPTO",
    name: label ?? normalizedSymbol,
    active: true,
  };
}

export const ordersApi = {
  async getOverview(
    authToken?: string,
    params?: {
      accountId?: string;
      symbol: string;
      interval?: string;
      historyLimit?: number;
    },
  ): Promise<OrderOverviewResponse> {
    const symbol = (params?.symbol ?? "BTCUSDT").toUpperCase();
    const interval = params?.interval
      ? MARKET_INTERVAL_TO_V2_INTERVAL_MAP[params.interval] ??
        Object.values(V2_TIMEFRAME_INTERVAL_MAP).find((value) => value.toLowerCase() === params.interval?.toLowerCase()) ??
        "M1"
      : "M1";
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;

    const [accountsResponse, openTradesResponse, closedTradesResponse, snapshot, candlesResponse] = await Promise.all([
      get<V2AccountListResponse>(ROUTES.ACCOUNT.LIST, { headers }),
      get<V2TradeListResponse>(ROUTES.TRADE.LIST, {
        params: {
          accountId: params?.accountId,
          status: "OPEN",
          limit: params?.historyLimit ?? 100,
        },
        headers,
      }),
      get<V2TradeListResponse>(ROUTES.TRADE.LIST, {
        params: {
          accountId: params?.accountId,
          status: "CLOSED",
          limit: 6,
          sortBy: "closedAt",
          sortDir: "desc",
        },
        headers,
      }),
      getV2MarketSnapshot({
        symbol,
        interval,
        limit: 1,
        authToken,
      }).catch(() => null),
      getV2MarketCandles({
        symbol,
        interval,
        limit: params?.historyLimit ?? 120,
        authToken,
      }).catch(() => []),
    ]);

    const account = resolveAccount(accountsResponse, params?.accountId);
    if (!account) {
      throw new Error("Account not found.");
    }

    const openTrades = getTradesFromV2Response(openTradesResponse);
    const closedTrades = getTradesFromV2Response(closedTradesResponse);
    const historyCandles = mapCandles(candlesResponse);
    const latestCandle = historyCandles.at(-1);
    const previousCandle = historyCandles.at(-2);
    const price = snapshot?.quote?.last ?? latestCandle?.close ?? 0;
    const open = snapshot?.day?.open ?? latestCandle?.open ?? price;
    const high = snapshot?.day?.high ?? latestCandle?.high ?? price;
    const low = snapshot?.day?.low ?? latestCandle?.low ?? price;
    const volume = snapshot?.day?.volume ?? latestCandle?.volume ?? 0;
    const change = snapshot?.day?.change ?? (previousCandle ? price - previousCandle.close : price - open);
    const changePercent = snapshot?.day?.changePercent ?? (open ? (change / open) * 100 : 0);
    const assetCategory = (snapshot?.category as AssetCategory | undefined) ?? "CRYPTO";

    const orderBook = snapshot?.quote
      ? generateEodhdOrderBook({
          symbol,
          assetCategory,
          latestPrice: price,
          bid: snapshot.quote.bid,
          ask: snapshot.quote.ask,
          change,
          levels: 6,
        })
      : buildOrderBookSnapshot(historyCandles, price);

    return {
      account: mapV2Account(account),
      selectedAsset: mapSelectedAsset({
        symbol,
        label: snapshot?.label,
        category: snapshot?.category,
      }),
      chart: {
        interval,
        open,
        high,
        low,
        close: price,
        volume,
        change,
        changePercent,
        time: latestCandle?.time ?? new Date().toISOString(),
        source: snapshot?.quote ? "eodhd-ws" : "eodhd-db",
      },
      snapshot: {
        price,
        changePercent,
        isLive: Boolean(snapshot?.quote),
        badges: [],
        stats: [],
        sparkline: historyCandles.slice(-48).map((candle) => ({ value: candle.close })),
      },
      history: {
        symbol,
        interval,
        candles: historyCandles,
        source: "v2-market-candles",
      },
      positions: openTrades.positions,
      trades: [...openTrades.trades, ...closedTrades.trades],
      depthChart: buildOrderDepthChart(historyCandles, price),
      orderBook,
      generatedAt: new Date().toISOString(),
    };
  },

  modifyProtection(
    payload: TradeProtectionModification,
    authToken?: string,
  ): Promise<TradeProtectionModificationResponse> {
    return patch<unknown>(`${ROUTES.TRADE.LIST}/${encodeURIComponent(payload.positionId)}`, {
      stopLoss: payload.stopLoss,
      takeProfit: payload.takeProfit,
    }, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    }).then(() => ({
      sync: {
        status: "SENT",
        eventId: null,
        lastError: null,
      },
    }));
  },
};
