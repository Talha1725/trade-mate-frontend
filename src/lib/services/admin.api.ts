import { ROUTES } from "@/constant/routes"
import { get } from "@/lib/utils/api"
import type { Trade } from "@/types/trade"

export const adminApi = {
  getAdminTrades(): Promise<Trade[]> {
    return get(ROUTES.ADMIN.TRADES)
  },

  getAdminStats(): Promise<{
    totalAccounts: number
    totalTrades: number
    totalProfit: number
    activePositions: number
  }> {
    return get(ROUTES.DASHBOARD.SUMMARY)
  },
}
