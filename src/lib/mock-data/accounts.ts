import type { AccountSummary } from "@/types/admin";

export const mockAccounts: AccountSummary[] = [
  {
    id: "ACC-1001",
    name: "Alice Smith",
    email: "alice@example.com",
    balance: 10000,
    equity: 10250,
    openPositionsCount: 2,
    status: "Active",
  },
  {
    id: "ACC-1002",
    name: "Bob Jones",
    email: "bob@example.com",
    balance: 5000,
    equity: 4800,
    openPositionsCount: 1,
    status: "Active",
  },
  {
    id: "ACC-1003",
    name: "Charlie Day",
    email: "charlie@example.com",
    balance: 25000,
    equity: 25000,
    openPositionsCount: 0,
    status: "Suspended",
  },
];
