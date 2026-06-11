import { mockAccounts } from "@/lib/mock-data/accounts";
import type { InjectionPreview, TradeInjectionTargetOption } from "@/types/admin";

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
