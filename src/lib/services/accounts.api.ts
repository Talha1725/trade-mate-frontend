import { ROUTES } from "@/constant/routes"
import { get, put } from "@/lib/utils/api"
import type { AccountSummary } from "@/types/admin"
import type { Trade } from "@/types/trade"

export const accountsApi = {
  getAccounts(): Promise<AccountSummary[]> {
    return get(ROUTES.ADMIN.ACCOUNTS)
  },

  getAccountById(id: string): Promise<AccountSummary> {
    return get(ROUTES.ADMIN.ACCOUNT_BY_ID(id))
  },

  getAccountTrades(id: string): Promise<Trade[]> {
    return get(ROUTES.ADMIN.ACCOUNT_TRADES(id))
  },

  updateAccount(id: string, data: Partial<AccountSummary>): Promise<AccountSummary> {
    return put(ROUTES.ADMIN.ACCOUNT_BY_ID(id), data)
  },
}
