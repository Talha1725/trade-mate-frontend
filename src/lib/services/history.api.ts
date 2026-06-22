import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import type { AccountLedgerResponse } from "@/types/dashboard";

export const historyApi = {
  getAccountLedger(accountId: string, authToken?: string): Promise<AccountLedgerResponse> {
    return get(ROUTES.TRADE.ACCOUNT(accountId), {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });
  },
};
