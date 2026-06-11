import { mockAccounts } from "@/lib/mock-data/accounts";
import type { InjectionPreview, LiveTradeShortcut, TradeInjectionTargetOption } from "@/types/admin";

export const allActiveAccountsTarget = "All Active Accounts";

export const mockInjectionTargetOptions: TradeInjectionTargetOption[] = [
  {
    value: allActiveAccountsTarget,
    label: allActiveAccountsTarget,
  },
  ...mockAccounts
    .filter((account) => account.status === "Active")
    .map((account) => ({
      value: account.id,
      label: account.name,
    })),
];

export const mockInjectionPreview: InjectionPreview = {
  target: "All Active Accounts (2 accounts)",
  actions: [
    {
      action: "CLOSE",
      symbol: "EURUSD",
      details: "All EURUSD Buy positions",
    },
    {
      action: "SELL",
      symbol: "GBPUSD",
      details: "2.0 lots GBPUSD @ Market",
    },
  ],
};

export const mockLiveTradeShortcuts: LiveTradeShortcut[] = [
  { label: "Buy 1.0 EURUSD", tone: "buy" },
  { label: "Sell 1.0 EURUSD", tone: "sell" },
  { label: "Buy 0.1 XAUUSD", tone: "buy" },
  { label: "Close All Profits", tone: "sell" },
];
