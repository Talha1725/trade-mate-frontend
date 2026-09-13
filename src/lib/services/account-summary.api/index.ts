import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import { buildAccountMetricsSummaryFromV2 } from "@/lib/utils/live-account-summary";
import type { AccountMetricsSummary } from "@/types";
import type { V2DashboardOverview } from "@/types/v2-dashboard";

export const accountSummaryApi = {
  async getAccountSummary(authToken?: string, accountId?: string): Promise<AccountMetricsSummary> {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    const overview = await get<V2DashboardOverview>(ROUTES.DASHBOARD.SUMMARY, {
      params: accountId ? { accountId } : undefined,
      headers,
    });

    return buildAccountMetricsSummaryFromV2(overview);
  },
};
