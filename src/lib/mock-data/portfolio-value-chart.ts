import type { TradingTimeframe } from "@/types/trading-filter-bar";
import { buildPortfolioValueSeries } from "@/lib/utils/portfolio-chart";
import type { PortfolioValuePoint } from "@/types/portfolio-value-chart";

function buildPoints(values: number[], timeframe: TradingTimeframe): PortfolioValuePoint[] {
  return buildPortfolioValueSeries(values, timeframe);
}

const oneMinuteValues = [
  41, 44, 47, 50, 53, 55, 52, 54, 57, 60, 58, 61, 64, 62, 65, 63, 66, 69, 67, 70, 72,
  74, 75,
];

const fiveMinuteValues = [42, 46, 49, 52, 50, 55, 58, 56, 61, 64, 62, 67, 70, 68, 73, 75];
const fifteenMinuteValues = [43, 48, 52, 49, 54, 58, 55, 60, 63, 61, 66, 69, 72, 75];
const oneHourValues = [44, 49, 53, 57, 54, 60, 63, 61, 66, 70, 68, 73, 75];
const fourHourValues = [45, 50, 55, 52, 58, 62, 59, 65, 68, 72, 75];
const dailyValues = [46, 52, 49, 56, 61, 58, 64, 69, 72, 75];
const weeklyValues = [48, 54, 51, 58, 63, 60, 67, 72, 75];

export const mockPortfolioValueChartData: Record<TradingTimeframe, PortfolioValuePoint[]> = {
  "1m": buildPoints(oneMinuteValues, "1m"),
  "5m": buildPoints(fiveMinuteValues, "5m"),
  "15m": buildPoints(fifteenMinuteValues, "15m"),
  "1H": buildPoints(oneHourValues, "1H"),
  "4H": buildPoints(fourHourValues, "4H"),
  D: buildPoints(dailyValues, "D"),
  W: buildPoints(weeklyValues, "W"),
};

export function getPortfolioValueYAxisTicks(values: number[]) {
  const min = Math.floor(Math.min(...values) / 5) * 5;
  const max = Math.ceil(Math.max(...values) / 5) * 5;
  const ticks: number[] = [];

  for (let tick = min; tick <= max; tick += 5) {
    ticks.push(tick);
  }

  return { domain: [min, max] as [number, number], ticks };
}
