import type { MarketCandle, MarketSymbolRecord } from "@/types/market";
import type { MarketSnapshotChartSummary, MarketSnapshotData } from "@/types/market-snapshot";
import type { PortfolioAccount, PortfolioPosition, PortfolioTrade } from "@/types/dashboard";

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

export type OrderBookRow = {
  id: string;
  price: number;
  size: number;
  total: number;
  barPercent: number;
};

export type OrderBookSnapshot = {
  midPrice: number;
  bestBid: number;
  bestAsk: number;
  midDirection: "up" | "down";
  spread: number;
  spreadPercent: number;
  asks: OrderBookRow[];
  bids: OrderBookRow[];
  isSimulated: true;
  source: "EODHD";
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
