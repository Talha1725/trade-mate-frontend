import type { TradingTimeframe } from "@/types/trading-filter-bar";
import type { V2PortfolioChartRange } from "@/types/portfolio-overview";

export const PORTFOLIO_RANGE_TO_TIMEFRAMES: Record<V2PortfolioChartRange, TradingTimeframe[]> = {
  "1D": ["1m", "5m", "15m", "1H", "4H"],
  "1W": ["W"],
  "1M": ["D"],
  "3M": [],
};

export function getPortfolioChartRange(timeframe?: TradingTimeframe): V2PortfolioChartRange {
  if (timeframe === "W") {
    return "1W";
  }

  if (timeframe === "D") {
    return "1M";
  }

  return "1D";
}
