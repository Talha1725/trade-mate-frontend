import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import type { OrderOverviewResponse } from "@/types/orders";

export const ordersApi = {
  getOverview(
    authToken?: string,
    params?: {
      accountId?: string;
      symbol: string;
      interval?: string;
      historyLimit?: number;
    },
  ): Promise<OrderOverviewResponse> {
    return get<OrderOverviewResponse>(ROUTES.ORDERS.OVERVIEW, {
      params,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });
  },
};
