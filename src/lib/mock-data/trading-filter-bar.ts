import type {
  TradingFilterBarOhlcv,
  TradingFilterBarQuote,
  TradingTimeframe,
} from "@/types/trading-filter-bar";

export const TRADING_TIMEFRAMES: TradingTimeframe[] = [
  "1m",
  "5m",
  "15m",
  "1H",
  "4H",
  "D",
  "W",
];

export const mockTradingFilterQuote: TradingFilterBarQuote = {
  price: 69102.75,
  change: 590.5,
  changePercent: 0.86,
};

export const mockTradingFilterOhlcv: TradingFilterBarOhlcv = {
  open: 68512.25,
  high: 69243.1,
  low: 68210.45,
  volume: 18420,
};
