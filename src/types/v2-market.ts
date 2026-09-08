import type { TradingTimeframe } from "@/types/trading-filter-bar";

export type V2Candle = {
  openTime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  live: boolean;
};

export type V2CandleInterval = "M1" | "M5" | "M15" | "H1" | "H4" | "D1" | "W1";

export type V2TimeframeMap = Record<TradingTimeframe, V2CandleInterval>;

export type V2MarketSnapshot = {
  symbol: string;
  label: string;
  category: string;
  quote: {
    bid: number;
    ask: number;
    last: number;
    providerTs: number;
  } | null;
  day: {
    open: number;
    high: number;
    low: number;
    volume: number;
    change: number;
    changePercent: number;
  } | null;
  candles: V2Candle[];
};
