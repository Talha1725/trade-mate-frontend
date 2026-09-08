import type { TradingTimeframe } from "@/types/trading-filter-bar";
import type { V2CandleInterval } from "@/types/v2-market";

export const V2_TIMEFRAME_INTERVAL_MAP = {
  "1m": "M1",
  "5m": "M5",
  "15m": "M15",
  "1H": "H1",
  "4H": "H4",
  D: "D1",
  W: "W1",
} satisfies Record<TradingTimeframe, V2CandleInterval>;

export const MARKET_INTERVAL_TO_V2_INTERVAL_MAP: Record<string, V2CandleInterval> = {
  "1m": "M1",
  "5m": "M5",
  "15m": "M15",
  "1h": "H1",
  "4h": "H4",
  "1d": "D1",
  "1w": "W1",
};
