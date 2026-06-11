import type { AuditLogEntry } from "@/types/admin";

export const auditActionTypes = ["All", "Inject Trade", "Close Position", "Account Update"];

export const mockAudits: AuditLogEntry[] = [
  {
    id: "LOG-01",
    timestamp: "2023-10-25 14:30",
    adminId: "ADM-1",
    adminEmail: "admin@trademate.app",
    action: "Inject Trade",
    targetAccountId: "ACC-1001",
    details: "Injected BUY 1.0 EURUSD @ Market",
  },
  {
    id: "LOG-02",
    timestamp: "2023-10-25 13:15",
    adminId: "ADM-1",
    adminEmail: "admin@trademate.app",
    action: "Close Position",
    targetAccountId: "ACC-1002",
    details: "Closed ticket #10246",
  },
  {
    id: "LOG-03",
    timestamp: "2023-10-24 09:00",
    adminId: "ADM-2",
    adminEmail: "support@trademate.app",
    action: "Account Update",
    targetAccountId: "ACC-1003",
    details: "Suspended account due to margin call",
  },
];
