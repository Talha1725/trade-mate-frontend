import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import { getTradesFromV2Response, mapV2Account } from "@/lib/utils/v2-dashboard-adapters";
import type { AccountLedgerResponse } from "@/types/dashboard";
import type { V2AccountListResponse, V2TradeListResponse } from "@/types/v2-dashboard";

function resolveAccount(response: V2AccountListResponse, accountId: string) {
  const accounts = Array.isArray(response) ? response : response.accounts;
  return accounts.find((account) => account.id === accountId);
}

export const historyApi = {
  async getAccountLedger(
    accountId: string,
    authToken?: string,
    query?: { page?: number; limit?: number },
  ): Promise<AccountLedgerResponse> {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    const [accountsResponse, tradesResponse] = await Promise.all([
      get<V2AccountListResponse>(ROUTES.ACCOUNT.LIST, { headers }),
      get<V2TradeListResponse>(ROUTES.TRADE.LIST, {
        params: {
          accountId,
          status: "CLOSED",
          page: query?.page,
          limit: query?.limit,
          sortBy: "closedAt",
          sortDir: "desc",
        },
        headers,
      }),
    ]);

    const account = resolveAccount(accountsResponse, accountId);

    if (!account) {
      throw new Error("Account not found.");
    }

    const mapped = getTradesFromV2Response(tradesResponse);

    return {
      account: mapV2Account(account),
      positions: [],
      trades: mapped.trades,
      tradePagination: mapped.tradePagination,
    };
  },
};
