import { ROUTES } from "@/constant/routes"
import { get, post, put } from "@/lib/utils/api"
import type { AccountSummary } from "@/types/admin"
import type { Trade } from "@/types/trade"
import { useAuthStore } from "@/lib/stores/auth-store"
import { adminApi } from "./admin.api"
import { auditApi } from "./audit.api"

export const accountsApi = {
  async discoverAccountIds(): Promise<string[]> {
    const ids = new Set<string>()

    // 1. Logged in admin account
    const session = useAuthStore.getState().session
    if (session?.user?.id) {
      ids.add(`${session.user.id}-demo-account`)
    }

    // 2. Discover from admin trades
    try {
      const trades = await adminApi.getAdminTrades()
      for (const t of trades) {
        if (t.accountId) {
          ids.add(t.accountId)
        }
      }
    } catch (e) {
      console.error("Error discovering from trades", e)
    }

    // 3. Discover from audit logs
    try {
      const logs = await auditApi.getAuditLogs()
      for (const log of logs) {
        if (log.targetAccountId && log.targetAccountId !== "Multiple" && log.targetAccountId !== "N/A") {
          ids.add(log.targetAccountId)
        }
      }
    } catch (e) {
      console.error("Error discovering from audits", e)
    }

    // 4. Discover from localStorage of provisioned users
    try {
      const saved = localStorage.getItem("provisioned_accounts")
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        for (const id of parsed) {
          ids.add(id)
        }
      }
    } catch {}

    return Array.from(ids)
  },

  async getAccounts(opts?: { page?: number; limit?: number }): Promise<{ items: AccountSummary[]; total: number }> {
    const { page = 1, limit = 25 } = opts ?? {}
    const ids = await this.discoverAccountIds()
    const total = ids.length
    const paged = ids.slice((page - 1) * limit, page * limit)
    const accounts: AccountSummary[] = []

    await Promise.all(
      paged.map(async (id) => {
        try {
          const res = await get<{
            account: {
              id: string
              name: string
              balance: string
              equity: string
              status: string
            }
            positions: any[]
          }>(ROUTES.ACCOUNT.BY_ID(id))

          const statusMap: Record<string, AccountSummary["status"]> = {
            ACTIVE: "Active",
            SUSPENDED: "Suspended",
            CLOSED: "Suspended",
          }

          let email = "user@trademate.local"
          try {
            const logs = await auditApi.getAuditLogs()
            for (const log of logs) {
              if (log.targetAccountId === id && log.details.includes("user:")) {
                const parts = log.details.split("user: ")
                if (parts[1]) {
                  email = parts[1].trim()
                }
              }
            }
          } catch {}

          accounts.push({
            id: res.account.id,
            name: res.account.name || "Trader Account",
            email,
            balance: parseFloat(res.account.balance),
            equity: parseFloat(res.account.equity),
            openPositionsCount: res.positions.filter((p) => p.status === "OPEN").length,
            status: statusMap[res.account.status] || "Active",
          })
        } catch (e) {
          console.error(`Error fetching account ${id}`, e)
        }
      })
    )

    return { items: accounts, total }
  },

  async getAccountById(id: string): Promise<AccountSummary> {
    const res = await get<{
      account: {
        id: string
        name: string
        balance: string
        equity: string
        status: string
      }
      positions: any[]
    }>(ROUTES.ACCOUNT.BY_ID(id))

    const statusMap: Record<string, AccountSummary["status"]> = {
      ACTIVE: "Active",
      SUSPENDED: "Suspended",
      CLOSED: "Suspended",
    }

    let email = "user@trademate.local"
    try {
      const logs = await auditApi.getAuditLogs()
      for (const log of logs) {
        if (log.targetAccountId === id && log.details.includes("user:")) {
          const parts = log.details.split("user: ")
          if (parts[1]) {
            email = parts[1].trim()
          }
        }
      }
    } catch {}

    return {
      id: res.account.id,
      name: res.account.name || "Trader Account",
      email,
      balance: parseFloat(res.account.balance),
      equity: parseFloat(res.account.equity),
      openPositionsCount: res.positions.filter((p) => p.status === "OPEN").length,
      status: statusMap[res.account.status] || "Active",
    }
  },

  async getAccountTrades(id: string, opts?: { page?: number; limit?: number }): Promise<{ items: Trade[]; total: number }> {
    const { page = 1, limit = 25 } = opts ?? {}
    const res = await get<{ trades: any[] }>(ROUTES.ACCOUNT.BY_ID(id))
    const all = res.trades.map((t) => ({
      id: t.id,
      symbol: t.symbol,
      type: t.direction === "BUY" ? "Buy" : "Sell",
      vol: parseFloat(t.lots),
      openP: parseFloat(t.entryPrice),
      closeP: t.exitPrice ? parseFloat(t.exitPrice) : 0,
      profit: parseFloat(t.pnl),
      status: t.status === "OPEN" ? "Open" : "Closed",
      time: t.openedAt,
      stopLoss: t.stopLoss != null ? parseFloat(t.stopLoss) : null,
      takeProfit: t.takeProfit != null ? parseFloat(t.takeProfit) : null,
      notes: t.notes ?? null,
    })) as Trade[]
    return {
      items: all.slice((page - 1) * limit, page * limit),
      total: all.length,
    }
  },

  async updateAccount(id: string, data: Partial<AccountSummary>): Promise<AccountSummary> {
    const current = await this.getAccountById(id)
    return {
      ...current,
      ...data,
    }
  },

  async provisionUser(data: any): Promise<any> {
    const res = await post<{ user: any; account: any }>(ROUTES.ADMIN.USERS, data)
    try {
      if (res.account?.id) {
        const saved = localStorage.getItem("provisioned_accounts")
        const parsed = saved ? JSON.parse(saved) as string[] : []
        if (!parsed.includes(res.account.id)) {
          parsed.push(res.account.id)
          localStorage.setItem("provisioned_accounts", JSON.stringify(parsed))
        }
      }
    } catch {}
    return res
  },
}
