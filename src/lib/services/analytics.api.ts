import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import { getV2MarketSnapshot } from "@/lib/services/v2-market-snapshot.api";
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

async function getSymbolPrices(symbols: string[], authToken?: string) {
  const entries = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const snapshot = await getV2MarketSnapshot({
          symbol,
          interval: "M1",
          limit: 1,
          authToken,
        });
        const latest = snapshot.candles.at(-1);
        return [symbol, snapshot.quote?.last ?? latest?.close ?? null] as const;
      } catch {
        return [symbol, null] as const;
      }
    }),
  );

  return Object.fromEntries(entries);
}

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
    const pricesBySymbol = await getSymbolPrices(
      overview.bySymbol.map((row) => row.symbol),
      authToken,
    );

    return mapV2AnalyticsOverview({
      overview,
      performanceByRange: performance ? { [range]: performance } : {},
      pricesBySymbol,
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
