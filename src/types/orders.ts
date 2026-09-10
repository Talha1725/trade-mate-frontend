import type { MarketCandle, MarketSymbolRecord } from "@/types/market";
import type { MarketSnapshotChartSummary, MarketSnapshotData } from "@/types/market-snapshot";
import type { PortfolioAccount, PortfolioPosition, PortfolioTrade } from "@/types/dashboard";
import type { OrderBookSnapshot } from "@/types/order-book";

export type OrderDepthChartLevel = "100" | "250" | "500";

export type OrderDepthChartPoint = {
  price: number;
  bids: number | null;
  asks: number | null;
};

export type OrderDepthChartResponse = {
  dataByLevel: Record<OrderDepthChartLevel, OrderDepthChartPoint[]>;
  defaultLevel: OrderDepthChartLevel;
  priceMin: number;
  priceMax: number;
  centerPrice: number;
  axisTicks: number[];
};

export type TradeProtectionModification = {
  positionId: string;
  stopLoss: number | null;
  takeProfit: number | null;
};

export type TradeProtectionModificationResponse = {
  sync: {
    status: "PENDING" | "SENT" | "FAILED" | "SKIPPED";
    eventId: string | null;
    lastError?: string | null;
  };
};

export type OrderOverviewResponse = {
  account: PortfolioAccount;
  selectedAsset: MarketSymbolRecord;
  chart: MarketSnapshotChartSummary;
  snapshot: MarketSnapshotData;
  history: {
    symbol: string;
    interval: string;
    candles: MarketCandle[];
    source: string;
  };
  positions: PortfolioPosition[];
  trades: PortfolioTrade[];
  depthChart: OrderDepthChartResponse;
  orderBook: OrderBookSnapshot;
  generatedAt: string;
};
