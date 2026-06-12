import { ROUTES } from "@/constant/routes"
import { get, post } from "@/lib/utils/api"
import type { Position } from "@/types/trade"

export const terminalApi = {
  getMarketQuotes(): Promise<Record<string, { bid: number; ask: number; change: number }>> {
    return get(ROUTES.MARKET.QUOTES)
  },

  getMarketHistory(symbol: string, timeframe?: string): Promise<{ time: number; open: number; high: number; low: number; close: number }[]> {
    return get(ROUTES.MARKET.HISTORY, { params: { symbol, timeframe } })
  },

  getMarketSymbols(): Promise<{ symbol: string; description: string }[]> {
    return get(ROUTES.MARKET.SYMBOLS)
  },

  getOpenPositions(): Promise<Position[]> {
    return get(ROUTES.POSITION.LIST)
  },

  placeOrder(order: {
    symbol: string
    type: "Buy" | "Sell"
    volume: number
    sl?: number
    tp?: number
  }): Promise<{ ticket: string }> {
    return post(ROUTES.TRADE.OPEN, order)
  },

  closePosition(ticket: string): Promise<void> {
    return post(ROUTES.POSITION.CLOSE(ticket))
  },
}
