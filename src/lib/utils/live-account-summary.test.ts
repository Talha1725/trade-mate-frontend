import { describe, expect, it } from "vitest";

import { buildAccountMetricsSummaryFromV2 } from "@/lib/utils/live-account-summary";
import type { V2DashboardOverview, V2Trade } from "@/types/v2-dashboard";

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
  symbols: [],
};

function closedTrade(id: string, symbol: string, pnl: string, closedAt: string): V2Trade {
  return {
    id,
    accountId: "account-1",
    userId: "user-1",
    symbol,
    internalSymbol: symbol,
    direction: "BUY",
    lots: "1",
    entryPrice: "100",
    exitPrice: "110",
    stopLoss: null,
    takeProfit: null,
    currentPrice: "110",
    floatingPnl: "0",
    pnl,
    status: "CLOSED",
    exitStatus: "MANUAL",
    source: "USER",
    notes: null,
    openedAt: "2026-09-08T12:00:00.000Z",
    closedAt,
  };
}

describe("buildAccountMetricsSummaryFromV2", () => {
  it("maps v2 dashboard summary and derives closed-trade metrics for the sidebar", () => {
    const summary = buildAccountMetricsSummaryFromV2(
      overview,
      [
        closedTrade("trade-1", "XAUUSD", "400", "2026-09-09T01:00:00.000Z"),
        closedTrade("trade-2", "EURUSD", "-100", "2026-09-09T03:00:00.000Z"),
        closedTrade("trade-3", "XAUUSD", "250", "2026-09-01T03:00:00.000Z"),
        closedTrade("trade-4", "BTCUSD", "999", "2026-07-01T03:00:00.000Z"),
      ],
      new Date("2026-09-09T12:00:00.000Z"),
    );

    expect(summary).toMatchObject({
      accountId: "account-1",
      accountNumber: "TM-1001",
      fundingType: "100K_EVAL",
      balance: 101250,
      equity: 101900,
      floatingPnl: 650,
      dailyPnl: 300,
      winRate: 66.67,
      bestAsset: {
        symbol: "XAUUSD",
        pnl: 650,
        tradeCount: 2,
      },
    });
  });
});
