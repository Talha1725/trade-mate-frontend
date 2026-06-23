import type React from "react";

export interface AccountSummary {
  id: string;
  name: string;
  email: string;
  balance: number;
  equity: number;
  openPositionsCount: number;
  status: "Active" | "Suspended" | "Pending";
}

export type AdminAccountPageProps = {
  params: Promise<{ id: string }>;
};

export type AdminLayoutProps = {
  children: React.ReactNode;
};

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

export type TradeInjectionTargetOption = {
  value: string;
  label: string;
};

export interface TradeInjectionMarketSnapshot {
  symbol: string;
  price: number;
  bid: number | null;
  ask: number | null;
  change: number | null;
  changePercent: number | null;
  trend: "UP" | "DOWN" | "FLAT";
  rangeHigh: number;
  rangeLow: number;
  source: string;
}

export type PreviewAction = {
  action: string;
  symbol?: string;
  details: string;
};

export type InjectionPreview = {
  target: string;
  actions: PreviewAction[];
};

export interface TradePreviewData {
  symbol: string;
  direction: "Buy" | "Sell";
  entry: number;
  exit: number;
  lotSize: number;
  profit: number;
  confidence?: number;
  rationale?: string[];
  timeframe?: string;
  stopLoss?: number | null;
  takeProfit?: number | null;
  openedAt?: string | null;
  closedAt?: string | null;
  recommendedScope?: "SINGLE" | "BULK";
  source?: string;
  marketContext?: TradeInjectionMarketSnapshot[];
}

export interface TradeInjectionExecuteResult {
  trade?: {
    id: string;
    pnl?: string;
  };
  pushedCount?: number;
  results?: Array<{
    accountId: string;
    trade?: { id: string; pnl?: string };
  }>;
}

export interface TradeInjectionExecuteResponse {
  preview: TradePreviewData & { recommendedScope: "SINGLE" | "BULK" };
  result: TradeInjectionExecuteResult | Record<string, unknown>;
  targetAccountIds: string[];
}

export interface InjectTradeFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  selectedTargets: string[];
  onToggleTarget: (value: string) => void;
  onSelectAllActive: () => void;
  onClearTargets: () => void;
  onPreview: () => void;
  onInject: () => void;
  isInjecting?: boolean;
  options: TradeInjectionTargetOption[];
}

export interface PreviewPanelProps {
  preview: TradePreviewData | null;
  targetAccountLabel?: string;
}

// --- API types (lib/services) ---

export type AccountsApiOptions = {
  page?: number;
  limit?: number;
  search?: string;
  status?: AccountSummary["status"] | "ACTIVE" | "SUSPENDED" | "CLOSED" | "All";
};

export type PaginatedAccountsResponse = {
  items: AccountSummary[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
};

export type AdminTradesQuery = {
  page?: number;
  limit?: number;
  accountId?: string;
  status?: "OPEN" | "CLOSED" | "All";
  search?: string;
};

export type AuditApiQuery = {
  page?: number;
  limit?: number;
  action?: string;
  search?: string;
  adminId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type PaginatedAuditResponse = {
  items: AuditLogEntry[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
};

export type PaginatedTradesResponse = {
  items: import("@/types/trade").Trade[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
};
