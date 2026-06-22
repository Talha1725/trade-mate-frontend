import type {
  TradingFilterBarAsset,
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

export const mockTradingFilterAssets: TradingFilterBarAsset[] = [
  {
    id: "btcusd",
    label: "Bit Coin / US Dollar",
    symbol: "BTCUSD",
    icon: "bitcoin",
  },
  {
    id: "ethusd",
    label: "Ethereum / US Dollar",
    symbol: "ETHUSD",
    icon: "stock",
  },
  {
    id: "solusd",
    label: "Solana / US Dollar",
    symbol: "SOLUSD",
    icon: "stock",
  },
  {
    id: "xrpusd",
    label: "Ripple / US Dollar",
    symbol: "XRPUSD",
    icon: "stock",
  },
  {
    id: "adausd",
    label: "Cardano / US Dollar",
    symbol: "ADAUSD",
    icon: "stock",
  },
  {
    id: "eurusd",
    label: "Euro / US Dollar",
    symbol: "EURUSD",
    icon: "forex",
  },
  {
    id: "gbpusd",
    label: "British Pound / US Dollar",
    symbol: "GBPUSD",
    icon: "forex",
  },
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
