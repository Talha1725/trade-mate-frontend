import type { V2AnalyticsPerformanceRange } from "@/types/analytics";
import type { PortfolioValueChartTimeframe } from "@/types/portfolio-value-chart";

export const ANALYTICS_TIMEFRAMES: PortfolioValueChartTimeframe[] = ["1W", "1M", "3M"];

export const ANALYTICS_RANGES: V2AnalyticsPerformanceRange[] = ["1W", "1M", "3M"];

export const DEFAULT_ANALYTICS_RANGE: V2AnalyticsPerformanceRange = "1M";
