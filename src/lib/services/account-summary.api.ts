import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import { buildAccountMetricsSummaryFromV2 } from "@/lib/utils/live-account-summary";
import type { AccountMetricsSummary } from "@/types";
import type { V2DashboardOverview, V2TradeListResponse } from "@/types/v2-dashboard";

const CLOSED_TRADE_PAGE_SIZE = 100;

function getTradeItems(response: V2TradeListResponse) {
  return Array.isArray(response) ? response : response.items;
}

function getTradeTotal(response: V2TradeListResponse, fallback: number) {
  return Array.isArray(response) ? response.length : response.total ?? fallback;
}

async function getClosedTrades(authToken?: string, accountId?: string) {
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
  const firstPage = await get<V2TradeListResponse>(ROUTES.TRADE.LIST, {
    params: {
      accountId,
      status: "CLOSED",
      sortBy: "closedAt",
      sortDir: "desc",
      page: 1,
      limit: CLOSED_TRADE_PAGE_SIZE,
    },
    headers,
  });

  const trades = [...getTradeItems(firstPage)];
  const total = getTradeTotal(firstPage, trades.length);
  const pageCount = Math.ceil(total / CLOSED_TRADE_PAGE_SIZE);

  for (let page = 2; page <= pageCount; page += 1) {
    const response = await get<V2TradeListResponse>(ROUTES.TRADE.LIST, {
      params: {
        accountId,
        status: "CLOSED",
        sortBy: "closedAt",
        sortDir: "desc",
        page,
        limit: CLOSED_TRADE_PAGE_SIZE,
      },
      headers,
    });

    trades.push(...getTradeItems(response));
  }

  return trades;
}

export const accountSummaryApi = {
  async getAccountSummary(authToken?: string, accountId?: string): Promise<AccountMetricsSummary> {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    const [overview, closedTrades] = await Promise.all([
      get<V2DashboardOverview>(ROUTES.DASHBOARD.SUMMARY, {
        params: accountId ? { accountId } : undefined,
        headers,
      }),
      getClosedTrades(authToken, accountId),
    ]);

    return buildAccountMetricsSummaryFromV2(overview, closedTrades);
  },
};
