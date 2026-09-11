import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import {
  mapV2AnalyticsOverview,
  mapV2AnalyticsPerformancePoints,
} from "@/lib/utils/v2-analytics-adapters";
import type {
  AnalyticsOverviewResponse,
  V2AnalyticsOverviewResponse,
  V2AnalyticsPerformanceRange,
  V2AnalyticsPerformanceResponse,
} from "@/types/analytics";
import type { PortfolioValuePoint } from "@/types/portfolio-value-chart";

export const analyticsApi = {
  async getOverview(
    accountId: string,
    authToken?: string,
    range: V2AnalyticsPerformanceRange = "1M",
  ): Promise<AnalyticsOverviewResponse> {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    const [overview, performance] = await Promise.all([
      get<V2AnalyticsOverviewResponse>(ROUTES.ANALYTICS.OVERVIEW, {
        params: { accountId },
        headers,
      }),
      get<V2AnalyticsPerformanceResponse>(ROUTES.ANALYTICS.PERFORMANCE, {
        params: { accountId, range },
        headers,
      }).catch(() => null),
    ]);

    return mapV2AnalyticsOverview({
      overview,
      performanceByRange: performance ? { [range]: performance } : {},
    });
  },

  async getPerformance(
    accountId: string,
    range: V2AnalyticsPerformanceRange,
    authToken?: string,
  ): Promise<PortfolioValuePoint[]> {
    const performance = await get<V2AnalyticsPerformanceResponse>(ROUTES.ANALYTICS.PERFORMANCE, {
      params: { accountId, range },
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });

    return mapV2AnalyticsPerformancePoints(performance);
  },
};
