import type { PortfolioValueChartTimeframe, PortfolioValuePoint } from "@/types/portfolio-value-chart";
import { DISPLAY_TIME_ZONE } from "@/constant/timezone";

export const PORTFOLIO_TIMEFRAME_SPANS_MS: Record<PortfolioValueChartTimeframe, number> = {
  "1m": 60 * 60 * 1000,
  "5m": 6 * 60 * 60 * 1000,
  "15m": 12 * 60 * 60 * 1000,
  "1H": 24 * 60 * 60 * 1000,
  "4H": 7 * 24 * 60 * 60 * 1000,
  D: 30 * 24 * 60 * 60 * 1000,
  W: 90 * 24 * 60 * 60 * 1000,
  "1D": 24 * 60 * 60 * 1000,
  "1W": 7 * 24 * 60 * 60 * 1000,
  "1M": 30 * 24 * 60 * 60 * 1000,
  "3M": 90 * 24 * 60 * 60 * 1000,
};

const INTRADAY_TIMEFRAMES = new Set<PortfolioValueChartTimeframe>(["1m", "5m", "15m", "1H", "4H", "1D"]);

export function formatPortfolioValueTimestamp(timestamp: number, timeframe: PortfolioValueChartTimeframe) {
  const date = new Date(timestamp);

  if (INTRADAY_TIMEFRAMES.has(timeframe)) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: DISPLAY_TIME_ZONE,
      timeZoneName: "short",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: DISPLAY_TIME_ZONE,
    timeZoneName: "short",
  });
}

export function buildPortfolioValueSeries(
  values: number[],
  timeframe: PortfolioValueChartTimeframe,
  endTime = Date.now(),
): PortfolioValuePoint[] {
  const span = PORTFOLIO_TIMEFRAME_SPANS_MS[timeframe];
  const startTime = endTime - span;
  const step = span / Math.max(values.length - 1, 1);

  return values.map((value, index) => {
    const timestamp = Math.round(startTime + step * index);

    return {
      timestamp,
      label: formatPortfolioValueTimestamp(timestamp, timeframe),
      value,
    };
  });
}
