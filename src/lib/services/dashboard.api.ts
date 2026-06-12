import { ROUTES } from "@/constant/routes"
import { get } from "@/lib/utils/api"
import type {
  EquityCurveDatum,
  UserPortfolioResponse,
  RecentActivityItem,
  StatCardDatum,
  SymbolBreakdownDatum,
} from "@/types/dashboard"

export const dashboardApi = {
  getSummary(): Promise<{
    balance: number
    equity: number
    floatingPnl: number
    winRate: number
  }> {
    return get(ROUTES.DASHBOARD.SUMMARY)
  },

  getEquityCurve(): Promise<EquityCurveDatum[]> {
    return get(ROUTES.DASHBOARD.EQUITY_CURVE)
  },

  getSymbolBreakdown(): Promise<SymbolBreakdownDatum[]> {
    return get(ROUTES.DASHBOARD.BREAKDOWN)
  },

  getRecentActivity(): Promise<RecentActivityItem[]> {
    return get(ROUTES.DASHBOARD.RECENT_ACTIVITY)
  },

  getStatCards(): Promise<StatCardDatum[]> {
    return get(ROUTES.DASHBOARD.STAT_CARDS)
  },

  getUserPortfolio(): Promise<UserPortfolioResponse> {
    return get(ROUTES.POSITION.LIST)
  },
}
