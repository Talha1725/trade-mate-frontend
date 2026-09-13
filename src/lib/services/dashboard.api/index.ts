import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import { mapV2DashboardOverview } from "@/lib/utils/v2-dashboard-adapters";
import type { AccountLedgerResponse, UserPortfolioResponse } from "@/types/dashboard";
import type { DashboardOverviewViewModel, V2DashboardOverview } from "@/types/v2-dashboard";

export const dashboardApi = {
  async getOverview(authToken?: string, accountId?: string): Promise<DashboardOverviewViewModel> {
    const response = await get<V2DashboardOverview>(ROUTES.DASHBOARD.SUMMARY, {
      params: accountId ? { accountId } : undefined,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });

    return mapV2DashboardOverview(response);
  },

  async getPortfolioSnapshot(authToken?: string, accountId?: string): Promise<UserPortfolioResponse> {
    return this.getOverview(authToken, accountId).then((overview) => overview.snapshot);
  },

  async getAccountLedger(accountId: string, authToken?: string): Promise<AccountLedgerResponse> {
    return this.getOverview(authToken, accountId).then((overview) => overview.ledger);
  },
};
