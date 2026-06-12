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
}

