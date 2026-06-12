import { ROUTES } from "@/constant/routes"
import { get } from "@/lib/utils/api"
import type { AuditLogEntry } from "@/types/admin"

export const auditApi = {
  getAuditLogs(filters?: {
    action?: string
    adminId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<AuditLogEntry[]> {
    return get(ROUTES.ADMIN.AUDIT, { params: filters })
  },
}
