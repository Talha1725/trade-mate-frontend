import { ROUTES } from "@/constant/routes"
import { get, post } from "@/lib/utils/api"
import type {
  TradeInjectionTargetOption,
  TradePreviewData,
} from "@/types/admin"
import { accountsApi } from "./accounts.api"

export const injectApi = {
  async getInjectionTargets(): Promise<TradeInjectionTargetOption[]> {
    const { items: accounts } = await accountsApi.getAccounts({ limit: 1000 })
    return accounts.map((a) => ({
      value: a.id,
      label: `${a.name} (${a.id}) - $${a.balance.toLocaleString()}`,
    }))
  },

  async executeInjection(accountId: string, trade: TradePreviewData): Promise<{ success: boolean; message: string }> {
    const payload = {
      accountId,
      symbol: trade.symbol,
      direction: trade.direction.toUpperCase() as "BUY" | "SELL",
      lots: trade.lotSize,
      entryPrice: trade.entry,
      exitPrice: trade.exit,
      openedAt: new Date(),
      closedAt: new Date(),
      notes: "Simulated trade injected by Admin",
      source: "ADMIN",
    }
    await post(ROUTES.ADMIN.TRADES, payload)
    return { success: true, message: "Trade successfully injected." }
  },

  async bulkPush(accountIds: string[], trade: TradePreviewData): Promise<{ success: boolean; affectedAccounts: number }> {
    const payload = {
      accountIds,
      symbol: trade.symbol,
      direction: trade.direction.toUpperCase() as "BUY" | "SELL",
      lots: trade.lotSize,
      entryPrice: trade.entry,
      exitPrice: trade.exit,
      openedAt: new Date(),
      closedAt: new Date(),
      notes: "Simulated trade bulk pushed by Admin",
      source: "ADMIN",
    }
    const res = await post<{ pushedCount: number }>(ROUTES.ADMIN.BULK_PUSH, payload)
    return { success: true, affectedAccounts: res.pushedCount }
  },
}
