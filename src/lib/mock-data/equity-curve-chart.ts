import { mockPortfolioValueChartData } from "@/lib/mock-data/portfolio-value-chart";
import type { TradingTimeframe } from "@/types/trading-filter-bar";
import type { PortfolioValuePoint } from "@/types/portfolio-value-chart";

export const EQUITY_CURVE_TIMEFRAMES: TradingTimeframe[] = ["1m", "5m"];

export const mockEquityCurveChartData: Partial<
  Record<TradingTimeframe, PortfolioValuePoint[]>
> = {
  "1m": mockPortfolioValueChartData["1m"],
  "5m": mockPortfolioValueChartData["5m"],
};
