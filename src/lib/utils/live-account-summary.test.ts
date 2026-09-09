import { describe, expect, it } from "vitest";

import { buildAccountMetricsSummaryFromV2 } from "@/lib/utils/live-account-summary";
import type { V2DashboardOverview } from "@/types/v2-dashboard";

const overview: V2DashboardOverview = {
  account: {
    id: "account-1",
    accountNumber: "TM-1001",
    name: "Funded Account",
    type: "FUNDED",
    status: "ACTIVE",
    currency: "USD",
  },
  summary: {
    accountId: "account-1",
    currency: "USD",
    accountSize: 100000,
    challenge: {
      plan: "100K_EVAL",
      label: "100K Evaluation",
      profitTargetPercent: 8,
      progressPercent: 25,
      reached: false,
    },
    balance: 101250,
    equity: 101900,
    floatingPnl: 650,
    marginUsed: 1200,
    availableMargin: 100700,
    marginUsagePercent: 1.18,
    riskLevel: "LOW",
    openTrades: 2,
    winningTrades: 1,
    losingTrades: 1,
    closedTrades: 3,
    realizedPnl: 1250,
    winRate: 66.67,
  },
  openTrades: [],
  recentTrades: [],
  watchlist: [],
  dailyPnl: 300,
  dailyTrades: 2,
  winRate30d: 75,
  bestAsset30d: {
    symbol: "XAUUSD",
    pnl: 650,
    tradeCount: 2,
  },
  symbols: [],
};

describe("buildAccountMetricsSummaryFromV2", () => {
  it("maps v2 dashboard overview metrics for the sidebar", () => {
    const summary = buildAccountMetricsSummaryFromV2(overview);

    expect(summary).toMatchObject({
      accountId: "account-1",
      accountNumber: "TM-1001",
      fundingType: "100K_EVAL",
      balance: 101250,
      equity: 101900,
      floatingPnl: 650,
      dailyPnl: 300,
      dailyTrades: 2,
      winRate: 75,
      bestAsset: {
        symbol: "XAUUSD",
        pnl: 650,
        tradeCount: 2,
      },
    });
  });
});
