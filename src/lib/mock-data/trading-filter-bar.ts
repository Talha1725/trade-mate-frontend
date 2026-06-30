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
  { id: "btcusdt", label: "BTC / USDT", symbol: "BTCUSDT" },
  { id: "ethusdt", label: "ETH / USDT", symbol: "ETHUSDT" },
  { id: "solusdt", label: "SOL / USDT", symbol: "SOLUSDT" },
  { id: "bnbusdt", label: "BNB / USDT", symbol: "BNBUSDT" },
  { id: "xrpusdt", label: "XRP / USDT", symbol: "XRPUSDT" },
  { id: "adausdt", label: "ADA / USDT", symbol: "ADAUSDT" },
  { id: "dogeusdt", label: "DOGE / USDT", symbol: "DOGEUSDT" },
  { id: "avaxusdt", label: "AVAX / USDT", symbol: "AVAXUSDT" },
  { id: "linkusdt", label: "LINK / USDT", symbol: "LINKUSDT" },
  { id: "tonusdt", label: "TON / USDT", symbol: "TONUSDT" },
  { id: "trxusdt", label: "TRX / USDT", symbol: "TRXUSDT" },
  { id: "dotusdt", label: "DOT / USDT", symbol: "DOTUSDT" },
  { id: "ltcusdt", label: "LTC / USDT", symbol: "LTCUSDT" },
  { id: "suiusdt", label: "SUI / USDT", symbol: "SUIUSDT" },
  { id: "eurusd", label: "EUR / USD", symbol: "EURUSD" },
  { id: "gbpusd", label: "GBP / USD", symbol: "GBPUSD" },
  { id: "usdjpy", label: "USD / JPY", symbol: "USDJPY" },
  { id: "usdchf", label: "USD / CHF", symbol: "USDCHF" },
  { id: "audusd", label: "AUD / USD", symbol: "AUDUSD" },
  { id: "usdcad", label: "USD / CAD", symbol: "USDCAD" },
  { id: "nzdusd", label: "NZD / USD", symbol: "NZDUSD" },
  { id: "xauusd", label: "XAU / USD", symbol: "XAUUSD" },
  { id: "eurjpy", label: "EUR / JPY", symbol: "EURJPY" },
  { id: "gbpjpy", label: "GBP / JPY", symbol: "GBPJPY" },
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
