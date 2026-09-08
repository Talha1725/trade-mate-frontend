import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import type { ApiAccount, UserAccountListResponse, UserAccountSummary } from "@/types/account";

function mapAccount(account: ApiAccount): UserAccountSummary {
  return {
    id: account.id,
    userId: account.userId,
    accountNumber: account.accountNumber,
    fundingType: account.fundingType,
    name: account.name,
    type: account.type,
    status: account.status,
    balance: account.balance,
    equity: account.equity,
    floatingPnl: account.floatingPnl,
    marginUsed: account.marginUsed,
    currency: account.currency,
    openPositionsCount:
      account.openPositionsCount ??
      account.trades?.filter((trade) => trade.status === "OPEN").length ??
      0,
    createdAt: account.createdAt,
  };
}

export const userAccountsApi = {
  async getAccounts(authToken?: string): Promise<UserAccountListResponse> {
    const response = await get<UserAccountListResponse | ApiAccount[]>(ROUTES.ACCOUNT.LIST, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });

    const accounts = Array.isArray(response) ? response : response.accounts;

    return {
      accounts: (accounts ?? []).map(mapAccount),
    };
  },

  async getAccountById(accountId: string, authToken?: string): Promise<UserAccountSummary | null> {
    const response = await this.getAccounts(authToken);
    return response.accounts.find((account) => account.id === accountId) ?? null;
  },
};
