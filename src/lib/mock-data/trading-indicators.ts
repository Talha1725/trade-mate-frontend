import type { TradingIndicatorItem } from "@/types/trading-indicators";

export const DEFAULT_INDICATOR_TEMPLATE_LABEL = "EMA 20, EMA 50, VWAP, BB20";

export const DEFAULT_INDICATOR_TEMPLATE_IDS = [
  "ema-20",
  "ema-50",
  "vwap",
  "bb20",
] as const;

export const mockTradingIndicators: TradingIndicatorItem[] = [
  {
    id: "ema-20",
    title: "EMA 20",
    description: "Short momentum line",
    enabled: true,
  },
  {
    id: "ema-50",
    title: "EMA 50",
    description: "Trend baseline",
    enabled: true,
  },
  {
    id: "vwap",
    title: "VWAP",
    description: "Session fair value",
    enabled: true,
  },
  {
    id: "bb20",
    title: "BB20",
    description: "Volatility bands",
    enabled: true,
  },
  {
    id: "macd",
    title: "MACD",
    description: "Momentum panel",
    enabled: false,
  },
  {
    id: "volume",
    title: "Volume",
    description: "Volume overlay",
    enabled: false,
  },
  {
    id: "rsi",
    title: "RSI",
    description: "Relative strength panel",
    enabled: false,
  },
];

export function createDefaultIndicatorState(): TradingIndicatorItem[] {
  return mockTradingIndicators.map((indicator) => ({
    ...indicator,
    enabled: DEFAULT_INDICATOR_TEMPLATE_IDS.includes(
      indicator.id as (typeof DEFAULT_INDICATOR_TEMPLATE_IDS)[number],
    ),
  }));
}
