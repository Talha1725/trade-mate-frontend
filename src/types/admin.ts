export interface AccountSummary {
  id: string;
  name: string;
  email: string;
  balance: number;
  equity: number;
  openPositionsCount: number;
  status: "Active" | "Suspended" | "Pending";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminEmail: string;
  action: "Inject Trade" | "Close Position" | "Modify Trade" | "Bulk Push" | "Account Update";
  targetAccountId: string | "Multiple";
  details: string;
}

export interface TradeInjectionPayload {
  prompt: string;
  targetAccountIds: string[];
  parsedResult?: {
    symbol: string;
    type: "Buy" | "Sell";
    volume: number;
    openPrice?: number;
    sl?: number;
    tp?: number;
    action: "Open" | "Close" | "Modify";
  };
}
