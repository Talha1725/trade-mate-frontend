import { ROUTES } from "@/constant/routes";
import { getPortfolioChartRange, PORTFOLIO_RANGE_TO_TIMEFRAMES } from "@/constants/portfolio-chart-ranges";
import { get } from "@/lib/utils/api";
import { buildPortfolioAllocationItem } from "@/lib/utils/portfolio";
import type {
  PortfolioAllocationItem,
  PortfolioChartResponse,
  PortfolioMetricTone,
  PortfolioOverviewResponse,
  PortfolioSummary,
  V2PortfolioAllocationResponse,
  V2PortfolioChartResponse,
  V2PortfolioSummaryResponse,
} from "@/types/portfolio-overview";

function mapRiskLabel(riskLevel: V2PortfolioSummaryResponse["riskLevel"]): PortfolioSummary["riskLabel"] {
  return riskLevel === "HIGH" ? "High" : riskLevel === "MEDIUM" ? "Medium" : "Low";
}

function mapRiskTone(riskLevel: V2PortfolioSummaryResponse["riskLevel"]): PortfolioMetricTone {
  return riskLevel === "HIGH" ? "red" : riskLevel === "MEDIUM" ? "orange" : "green";
}

function mapSummary(summary: V2PortfolioSummaryResponse): PortfolioSummary {
  const targetPercent = summary.challenge?.profitTargetPercent ?? 10;
  const targetAmount = summary.accountSize > 0 ? summary.accountSize * (targetPercent / 100) : 0;
  const currentProfit = summary.equity - summary.accountSize;

  return {
    accountSize: summary.accountSize,
    walletBalance: summary.balance,
    equity: summary.equity,
    floatingPnl: summary.floatingPnl,
    availableMargin: summary.availableMargin,
    marginUsagePercent: summary.marginUsagePercent,
    openPositionsCount: summary.openTrades,
    winningPositionsCount: summary.winningTrades,
    losingPositionsCount: summary.losingTrades,
    winRate: summary.winRate,
    riskLabel: mapRiskLabel(summary.riskLevel),
    riskTone: mapRiskTone(summary.riskLevel),
    profitTarget: {
      baseBalance: summary.accountSize,
      targetAmount,
      currentProfit,
      remaining: Math.max(0, targetAmount - Math.max(0, currentProfit)),
      progressPercent: summary.challenge?.progressPercent ?? 0,
    },
  };
}

function mapAllocation(allocation: V2PortfolioAllocationResponse): PortfolioAllocationItem[] {
  return allocation.items.map((item) => buildPortfolioAllocationItem(item.category, item.value, item.percent));
}

function mapChartPoint(point: V2PortfolioChartResponse["points"][number]) {
  const timestamp = Date.parse(point.at);

  return {
    timestamp: Number.isFinite(timestamp) ? timestamp : Date.now(),
    label: point.at,
    value: point.equity,
  };
}

function mapCharts(charts: V2PortfolioChartResponse[]): PortfolioChartResponse {
  const dataByTimeframe: PortfolioChartResponse["dataByTimeframe"] = {};

  for (const chart of charts) {
    const points = chart.points.map(mapChartPoint);

    for (const timeframe of PORTFOLIO_RANGE_TO_TIMEFRAMES[chart.range]) {
      dataByTimeframe[timeframe] = points;
    }
  }

  return {
    defaultTimeframe: "4H",
    dataByTimeframe,
  };
}

export const portfolioApi = {
  getSummary(accountId?: string): Promise<Pick<PortfolioOverviewResponse, "accountId" | "accountNumber" | "fundingType" | "generatedAt" | "summary">> {
    return get<V2PortfolioSummaryResponse>(ROUTES.PORTFOLIO.SUMMARY, {
      params: accountId ? { accountId } : undefined,
    }).then((summary) => ({
      accountId: summary.accountId,
      accountNumber: null,
      fundingType: summary.challenge?.plan ?? null,
      generatedAt: new Date().toISOString(),
      summary: mapSummary(summary),
    }));
  },

  getChart(
    accountId?: string,
    timeframe?: PortfolioOverviewResponse["chart"]["defaultTimeframe"],
  ): Promise<Pick<PortfolioOverviewResponse, "accountId" | "accountNumber" | "fundingType" | "generatedAt" | "chart">> {
    return get<V2PortfolioChartResponse>(ROUTES.PORTFOLIO.CHART, {
      params: {
        ...(accountId ? { accountId } : {}),
        range: getPortfolioChartRange(timeframe),
      },
    }).then((chart) => ({
      accountId: chart.accountId,
      accountNumber: null,
      fundingType: null,
      generatedAt: new Date().toISOString(),
      chart: mapCharts([chart]),
    }));
  },

  getAllocation(accountId?: string): Promise<Pick<PortfolioOverviewResponse, "accountId" | "accountNumber" | "fundingType" | "generatedAt" | "allocation">> {
    return get<V2PortfolioAllocationResponse>(ROUTES.PORTFOLIO.ALLOCATION, {
      params: accountId ? { accountId } : undefined,
    }).then((allocation) => ({
      accountId: allocation.accountId,
      accountNumber: null,
      fundingType: null,
      generatedAt: new Date().toISOString(),
      allocation: {
        items: mapAllocation(allocation),
      },
    }));
  },

};
