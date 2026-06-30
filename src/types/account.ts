import type { ID, ISODateString } from "@/types";

export type UserAccountSummary = {
  id: ID;
  userId: ID;
  accountNumber: string | null;
  fundingType: string | null;
  name: string;
  type: string;
  status: string;
  balance: string;
  equity: string;
  floatingPnl: string;
  marginUsed: string;
  currency: string;
  openPositionsCount: number;
  createdAt: ISODateString;
};

export type UserAccountListResponse = {
  accounts: UserAccountSummary[];
};

