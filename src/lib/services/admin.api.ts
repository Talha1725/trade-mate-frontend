import { ROUTES } from "@/constant/routes"
import { get, patch, del } from "@/lib/utils/api"
import type { Trade } from "@/types/trade"
import { useAuthStore } from "@/lib/stores/auth-store"

export const adminApi = {
  async getAdminTrades(): Promise<Trade[]> {
    const res = await get<{ trades: any[] }>(ROUTES.ADMIN.TRADES)
    return res.trades.map((t) => ({
      id: t.id,
      accountId: t.accountId,
      symbol: t.symbol,
      type: t.direction === "BUY" ? "Buy" : "Sell",
      vol: parseFloat(t.lots),
      openP: parseFloat(t.entryPrice),
      closeP: t.exitPrice ? parseFloat(t.exitPrice) : 0,
      profit: parseFloat(t.pnl),
      status: t.status === "OPEN" ? "Open" : "Closed",
      time: t.openedAt,
    }))
  },

  async updateAdminTrade(id: string, data: any): Promise<void> {
    await patch(ROUTES.ADMIN.TRADE_BY_ID(id), data)
  },

  async deleteAdminTrade(id: string): Promise<void> {
    await del(ROUTES.ADMIN.TRADE_BY_ID(id))
  },

  async getAdminStats(): Promise<{
    totalAccounts: number
    totalTrades: number
    totalProfit: number
    activePositions: number
  }> {
    try {
      const trades = await this.getAdminTrades()
      const uniqueAccounts = new Set<string>()

      for (const t of trades) {
        if (t.accountId) {
          uniqueAccounts.add(t.accountId)
        }
      }

      const session = useAuthStore.getState().session
      if (session?.user?.id) {
        uniqueAccounts.add(`${session.user.id}-demo-account`)
      }

      let totalProfit = 0
      for (const t of trades) {
        totalProfit += t.profit
      }

      const accountPromises = Array.from(uniqueAccounts).map(async (id) => {
        try {
          const res = await get<{ positions: any[] }>(ROUTES.ACCOUNT.BY_ID(id))
          return res.positions.filter((p) => p.status === "OPEN").length
        } catch {
          return 0
        }
      })

      const openPositionsPerAccount = await Promise.all(accountPromises)
      const activePositions = openPositionsPerAccount.reduce((sum, count) => sum + count, 0)

      return {
        totalAccounts: uniqueAccounts.size,
        totalTrades: trades.length,
        totalProfit,
        activePositions,
      }
    } catch (e) {
      console.error("Error fetching admin stats", e)
      return {
        totalAccounts: 0,
        totalTrades: 0,
        totalProfit: 0,
        activePositions: 0,
      }
    }
  },
}
