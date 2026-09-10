import type { V2PortfolioChartRange } from "@/types/portfolio-overview";
import type { PortfolioValueChartTimeframe } from "@/types/portfolio-value-chart";

export const PORTFOLIO_CHART_TIMEFRAMES: V2PortfolioChartRange[] = ["1D", "1W", "1M", "3M"];

export const PORTFOLIO_RANGE_TO_TIMEFRAMES: Record<V2PortfolioChartRange, PortfolioValueChartTimeframe[]> = {
  "1D": ["1D"],
  "1W": ["1W"],
  "1M": ["1M"],
  "3M": ["3M"],
};

export function getPortfolioChartRange(timeframe?: PortfolioValueChartTimeframe): V2PortfolioChartRange {
  return PORTFOLIO_CHART_TIMEFRAMES.includes(timeframe as V2PortfolioChartRange)
    ? timeframe as V2PortfolioChartRange
    : "1D";
}
