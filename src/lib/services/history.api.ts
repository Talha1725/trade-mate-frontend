import { ROUTES } from "@/constant/routes"
import { get } from "@/lib/utils/api"
import type { Trade } from "@/types/trade"

export const historyApi = {
  getTradeHistory(filters?: {
    symbol?: string
    type?: "Buy" | "Sell"
    dateFrom?: string
    dateTo?: string
  }): Promise<Trade[]> {
    return get(ROUTES.TRADE.HISTORY, { params: filters })
  },

  getTradeById(id: string): Promise<Trade> {
    return get(ROUTES.TRADE.BY_ID(id))
  },
}
