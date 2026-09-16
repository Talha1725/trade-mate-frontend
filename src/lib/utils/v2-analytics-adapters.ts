import type { AnalyticsOverviewResponse, V2AnalyticsOverviewResponse, V2AnalyticsPerformanceRange, V2AnalyticsPerformanceResponse } from "@/types/analytics";
import { mockAnalyticsMetricCards } from "@/lib/mock-data/analytics-metrics";
import { formatSignedCurrency } from "@/components/shared/trading-table-cells";
import type { PortfolioMetricCard } from "@/types/portfolio-metric-card";
import type { PortfolioValuePoint } from "@/types/portfolio-value-chart";
import type { StrategyPerformanceRow } from "@/types/strategy-performance";
import type { TradingCalendarDay, TradingCalendarCardProps } from "@/components/analytics/types";
import { ANALYTICS_RANGES } from "@/constants/analytics";

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function valueTone(value: number) {
  return value > 0 ? "positive" : value < 0 ? "negative" : "default";
}

function pnlTone(value: number) {
  return value > 0 ? "positive" : value < 0 ? "negative" : "muted";
}

function dateKey(value: string) {
  const directDate = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (directDate) {
    return directDate;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function timestampForCalendarDate(value: string) {
  const key = dateKey(value);
  if (key) {
    const [year, month, day] = key.split("-").map(Number);
    return Date.UTC(year, month - 1, day, 12);
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : Date.now();
}

function startOfCalendarGrid(referenceDate: Date) {
  const first = new Date(Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1));
  first.setUTCDate(first.getUTCDate() - first.getUTCDay());
  return first;
}

function buildStatsCards(
  overview: V2AnalyticsOverviewResponse,
  performance: V2AnalyticsPerformanceResponse,
): PortfolioMetricCard[] {
  const currency = overview.currency || "USD";
  const chartValues = performance.points.map((point) => point.equity);
  const profitFactor = overview.trades.profitFactor ?? 0;
  const profitFactorTarget = overview.trades.profitFactorTarget ?? 2;
  const winRateTarget = overview.trades.winRateTarget ?? 50;
  const consistencyScore = overview.days?.consistency ?? Math.min(10, Math.max(0, overview.trades.winRate / 10));
  const breachCount = overview.challenge?.breaches.count ?? 0;
  const maxDrawdown = overview.challenge?.maxDrawdown;
  const maxDrawdownUsed = maxDrawdown?.used ?? overview.drawdown.max;
  const maxDrawdownUsedPercent = maxDrawdown?.usedPercent ?? overview.drawdown.maxPercent;
  const maxDrawdownRemaining = maxDrawdown?.remaining ?? 0;
  const bestDayPnl = overview.days?.bestDay?.pnl ?? 0;
  const avgDayPnl = overview.days?.avgDay ?? 0;
  const isAboveProfitFactorTarget = profitFactor >= profitFactorTarget;
  const isAboveWinRateTarget = overview.trades.winRate >= winRateTarget;

  return mockAnalyticsMetricCards.map((card) => {
    if (card.id === "net-pnl" && card.variant === "icon-stats") {
      return {
        ...card,
        value: formatSignedCurrency(overview.trades.netPnl),
        valueTone: valueTone(overview.trades.netPnl),
        subtitle: `${overview.trades.closed} closed trade${overview.trades.closed === 1 ? "" : "s"}`,
        subtitleTone: "default",
        iconTone: overview.trades.netPnl >= 0 ? "green" : "red",
        chartValues,
        subStats: [
          { ...card.subStats[0], value: formatCurrency(bestDayPnl, currency), tone: valueTone(bestDayPnl) },
          {
            ...card.subStats[1],
            value: formatCurrency(avgDayPnl, currency),
            tone: valueTone(avgDayPnl),
          },
        ],
      };
    }

    if (card.id === "win-rate" && card.variant === "gauge-progress") {
      return {
        ...card,
        value: formatPercent(overview.trades.winRate),
        subtitle: `${overview.trades.total} trades analyzed`,
        gaugeValue: overview.trades.winRate,
        progressValue: overview.trades.winRate,
        progressRightLabel: `${winRateTarget.toFixed(winRateTarget % 1 === 0 ? 0 : 1)}%+`,
      };
    }

    if (card.id === "profit-factor" && card.variant === "icon-stats") {
      return {
        ...card,
        value: profitFactor.toFixed(2),
        subtitle: isAboveProfitFactorTarget
          ? `Target ${profitFactorTarget.toFixed(1)}+`
          : `Below ${profitFactorTarget.toFixed(1)} target`,
        subtitleTone: isAboveProfitFactorTarget ? "positive" : "negative",
        iconTone: isAboveProfitFactorTarget ? "green" : profitFactor >= 1 ? "orange" : "red",
        subStats: [
          { ...card.subStats[0], value: formatCurrency(overview.trades.grossProfit, currency) },
          { ...card.subStats[1], value: formatCurrency(Math.abs(overview.trades.grossLoss), currency) },
        ],
      };
    }

    if (card.id === "max-drawdown" && card.variant === "icon-stats") {
      return {
        ...card,
        value: formatCurrency(maxDrawdownUsed, currency),
        valueTone: maxDrawdownUsed > 0 ? "negative" : "default",
        subtitle: formatPercent(maxDrawdownUsedPercent),
        subtitleTone: maxDrawdownUsed > 0 ? "negative" : "default",
        iconTone: maxDrawdownUsedPercent >= 10 ? "red" : maxDrawdownUsedPercent >= 5 ? "orange" : "blue",
        subStats: [
          {
            ...card.subStats[0],
            value: maxDrawdown ? formatCurrency(maxDrawdown.amount, currency) : "N/A",
          },
          {
            ...card.subStats[1],
            value: maxDrawdown ? formatCurrency(maxDrawdownRemaining, currency) : "N/A",
            tone: maxDrawdownRemaining > 0 ? "positive" : "default",
          },
        ],
      };
    }

    if (card.id === "consistency" && card.variant === "icon-stats") {
      return {
        ...card,
        value: `${consistencyScore.toFixed(1)}/10`,
        subtitle: isAboveWinRateTarget ? "Stable" : "Needs improvement",
        subtitleTone: isAboveWinRateTarget ? "positive" : "negative",
        subStats: [
          { ...card.subStats[0], value: String(overview.days?.greenDays ?? overview.trades.wins), tone: "positive" },
          { ...card.subStats[1], value: `${overview.days?.currentStreak ?? 0} day${(overview.days?.currentStreak ?? 0) === 1 ? "" : "s"}` },
        ],
      };
    }

    if (card.id === "payout" && card.variant === "icon-stats") {
      return {
        ...card,
        value: String(breachCount),
        valueTone: breachCount === 0 ? "positive" : "negative",
        subtitle: breachCount === 0 ? "Clear risk signals" : "Partner breach recorded",
        subtitleTone: breachCount === 0 ? "positive" : "negative",
        subStats: [
          { ...card.subStats[0], value: formatPercent(maxDrawdownUsedPercent) },
          { ...card.subStats[1], value: breachCount === 0 ? "Active" : "Review", tone: breachCount === 0 ? "positive" : "negative" },
        ],
      };
    }

    return card;
  });
}

function buildChallengeProgress(overview: V2AnalyticsOverviewResponse): AnalyticsOverviewResponse["challengeProgress"] {
  const challenge = overview.challenge;
  const currency = overview.currency || "USD";

  if (!challenge) {
    return {
      statusLabel: overview.trades.open > 0 ? "Active" : "Ready",
      progress: 0,
      progressLabel: "Progress",
      stats: [
        {
          id: "equity",
          label: "Equity",
          valuePrimary: formatCurrency(overview.equity, currency),
          valueSecondary: "Current value",
          tone: "completed",
        },
        {
          id: "drawdown",
          label: "Drawdown",
          valuePrimary: formatCurrency(overview.drawdown.current, currency),
          valueSecondary: formatPercent(overview.drawdown.currentPercent),
          tone: "remaining",
        },
      ],
      message: "No challenge plan is attached to this account yet.",
      accountStatus: "ACTIVE",
    };
  }

  return {
    statusLabel: challenge.breaches.count > 0 ? "Review" : challenge.profitTarget.reached ? "Target Reached" : "On Track",
    progress: challenge.profitTarget.progressPercent,
    progressLabel: "Progress",
    stats: [
      {
        id: "profit-target",
        label: "Profit Target",
        valuePrimary: formatCurrency(challenge.profitTarget.current, currency),
        valueSecondary: `${formatCurrency(challenge.profitTarget.remaining, currency)} left`,
        tone: challenge.profitTarget.reached ? "completed" : "remaining",
      },
      {
        id: "max-drawdown",
        label: "Max Drawdown",
        valuePrimary: formatCurrency(challenge.maxDrawdown.used, currency),
        valueSecondary: `${formatCurrency(challenge.maxDrawdown.remaining, currency)} left`,
        tone: challenge.maxDrawdown.usedPercent > 0 ? "remaining" : "completed",
      },
      {
        id: "daily-loss",
        label: "Daily Loss",
        valuePrimary: challenge.dailyLoss ? formatCurrency(challenge.dailyLoss.used, currency) : "N/A",
        valueSecondary: challenge.dailyLoss ? `${formatCurrency(challenge.dailyLoss.remaining, currency)} left` : "No daily cap",
        tone: challenge.dailyLoss?.used ? "remaining" : "completed",
      },
    ],
    message: challenge.breaches.count > 0
      ? "This account has a recorded challenge breach from the partner system."
      : "Stay consistent to maintain your evaluation progress.",
    accountStatus: challenge.breaches.count > 0 ? "FAILED" : "ACTIVE",
    plan: {
      planKey: challenge.plan,
      planLabel: challenge.label,
      leverage: null,
      balanceK: challenge.baseBalance / 1000,
      priceUsd: null,
      baseBalance: challenge.baseBalance,
      targetAmount: challenge.profitTarget.amount,
      source: "backend-v2",
    },
  };
}

export function mapV2AnalyticsPerformancePoints(response: V2AnalyticsPerformanceResponse): PortfolioValuePoint[] {
  return response.points.map((point) => {
    return {
      timestamp: timestampForCalendarDate(point.at),
      label: point.at,
      value: point.equity,
    };
  });
}

function buildCalendar(
  performance: V2AnalyticsPerformanceResponse,
  overview: V2AnalyticsOverviewResponse,
): TradingCalendarCardProps {
  const pnlByDay = new Map<string, { pnl: number; trades: number }>();

  for (const point of performance.points) {
    const key = dateKey(point.at);
    if (!key) continue;

    const current = pnlByDay.get(key) ?? { pnl: 0, trades: 0 };
    pnlByDay.set(key, {
      pnl: current.pnl + point.realizedPnl,
      trades: current.trades + point.trades,
    });
  }

  const referencePoint = performance.points.at(-1)?.at ?? new Date().toISOString();
  const parsedReferenceDate = new Date(timestampForCalendarDate(referencePoint));
  const referenceDate = Number.isNaN(parsedReferenceDate.getTime()) ? new Date() : parsedReferenceDate;
  const gridStart = startOfCalendarGrid(referenceDate);
  const days: TradingCalendarDay[] = [];

  for (let index = 0; index < 35; index += 1) {
    const date = new Date(gridStart);
    date.setUTCDate(gridStart.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    const summary = pnlByDay.get(key);
    const absolutePnl = Math.abs(summary?.pnl ?? 0);

    days.push({
      id: key,
      day: date.getUTCDate(),
      tone: !summary || summary.trades === 0 ? "neutral" : summary.pnl >= 0 ? "win" : "loss",
      intensity: absolutePnl >= 100 ? "light" : "dark",
      strength: Math.min(1, absolutePnl / 500),
      isOutsideMonth: date.getUTCMonth() !== referenceDate.getUTCMonth(),
    });
  }

  const sessions = overview.days?.tradingDays ?? performance.points.reduce((total, point) => total + point.trades, 0);

  return {
    sessionsLabel: `${sessions} session${sessions === 1 ? "" : "s"}`,
    days,
  };
}

function buildStrategyRows(
  overview: V2AnalyticsOverviewResponse,
  pricesBySymbol: Record<string, number | null>,
): StrategyPerformanceRow[] {
  return overview.bySymbol.map((row) => ({
    id: row.symbol,
    symbol: row.symbol,
    price: row.avgEntryPrice ?? pricesBySymbol[row.symbol] ?? null,
    pnl: row.netPnl,
    pnlTone: pnlTone(row.netPnl),
    winRate: row.winRate,
    profitFactor: row.profitFactor,
  }));
}

export function mapV2AnalyticsOverview(params: {
  overview: V2AnalyticsOverviewResponse;
  performanceByRange: Partial<Record<V2AnalyticsPerformanceRange, V2AnalyticsPerformanceResponse>>;
  pricesBySymbol?: Record<string, number | null>;
}): AnalyticsOverviewResponse {
  const performance = params.performanceByRange["1M"] ?? params.performanceByRange["1W"] ?? params.performanceByRange["3M"] ?? {
    accountId: params.overview.accountId,
    range: "1M",
    from: new Date().toISOString(),
    to: new Date().toISOString(),
    points: [],
  };
  const dataByTimeframe = Object.fromEntries(
    ANALYTICS_RANGES.flatMap((range) => {
      const rangePerformance = params.performanceByRange[range];
      return rangePerformance ? [[range, mapV2AnalyticsPerformancePoints(rangePerformance)]] : [];
    }),
  );

  return {
    account: {
      id: params.overview.accountId,
      userId: "",
      accountNumber: params.overview.accountNumber,
      fundingType: params.overview.challenge?.plan ?? null,
      name: params.overview.accountNumber,
      type: "DEMO",
      status: params.overview.challenge?.breaches.count ? "FAILED" : "ACTIVE",
      balance: String(params.overview.balance),
      equity: String(params.overview.equity),
      floatingPnl: String(params.overview.floatingPnl),
      marginUsed: String(params.overview.marginUsed),
      currency: params.overview.currency,
      openPositionsCount: params.overview.trades.open,
      createdAt: new Date().toISOString(),
    },
    statsCards: buildStatsCards(params.overview, performance),
    challengeProgress: buildChallengeProgress(params.overview),
    equityCurve: {
      defaultTimeframe: "1M",
      dataByTimeframe,
    },
    calendar: buildCalendar(performance, params.overview),
    strategyPerformance: {
      total: params.overview.bySymbol.length,
      rows: buildStrategyRows(params.overview, params.pricesBySymbol ?? {}),
    },
    generatedAt: new Date().toISOString(),
  };
}
