import { ROUTES } from "@/constant/routes"
import { get } from "@/lib/utils/api"
import type { AuditLogEntry } from "@/types/admin"

export const auditApi = {
  async getAuditLogs(filters?: {
    action?: string
    adminId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<AuditLogEntry[]> {
    // The backend audit endpoint supports only `limit` (max 100), with no
    // offset/page param — so we request the max and paginate on the client.
    // True offset-based server pagination would require a backend change.
    const res = await get<{ auditLogs: any[] }>(ROUTES.ADMIN.AUDIT, { params: { limit: 100, ...filters } })
    return res.auditLogs.map((log: any): AuditLogEntry => {
      let actionMapped: AuditLogEntry["action"] = "Account Update"
      if (log.action === "admin.trade_create") {
        actionMapped = "Inject Trade"
      } else if (log.action === "admin.trade_bulk_push") {
        actionMapped = "Bulk Push"
      } else if (log.action === "admin.trade_update") {
        actionMapped = "Modify Trade"
      } else if (log.action === "admin.trade_delete") {
        actionMapped = "Close Position"
      } else if (log.action === "admin.provision_user") {
        actionMapped = "Account Update"
      }

      let details = ""
      if (log.payload) {
        if (log.action === "admin.provision_user") {
          details = `user: ${log.payload.user?.email || ""} | name: ${log.payload.user?.name || ""}`
        } else if (log.action === "admin.trade_create") {
          details = `Injected ${log.payload.trade?.direction || ""} trade of ${log.payload.trade?.lots || ""} lot(s) on ${log.payload.trade?.symbol || ""}`
        } else if (log.action === "admin.trade_update") {
          details = `Updated trade ${log.payload.after?.tradeId || ""} (P&L: $${log.payload.after?.pnl || "0"})`
        } else if (log.action === "admin.trade_delete") {
          details = `Deleted trade ${log.payload.tradeId || ""} (P&L was $${log.payload.pnl || "0"})`
        } else if (log.action === "admin.trade_bulk_push") {
          details = `Bulk pushed ${log.payload.direction || ""} trade of ${log.payload.lots || ""} lot(s) on ${log.payload.symbol || ""} to ${log.payload.pushedCount || 0} accounts`
        }
      }

      return {
        id: log.id,
        timestamp: new Date(log.createdAt).toLocaleString(),
        adminId: log.adminId || "",
        adminEmail: log.admin?.email || "System",
        action: actionMapped,
        targetAccountId: log.targetAccountId || (log.action === "admin.trade_bulk_push" ? "Multiple" : "N/A"),
        details: details || `Performed action ${log.action}`,
      }
    })
  },
}
