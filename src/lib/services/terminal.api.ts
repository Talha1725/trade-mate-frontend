import { ROUTES } from "@/constant/routes";
import { get, post } from "@/lib/utils/api";
import {
  getTradesFromV2Response,
  mapV2AccountToPortfolioSnapshot,
  mapV2CloseResponse,
  mapV2OpenResponse,
} from "@/lib/utils/v2-dashboard-adapters";
import type {
  AccountLedgerResponse,
  TradeCloseResponse,
  TradeOpenResponse,
  UserPortfolioResponse,
} from "@/types/dashboard";
import type { MarketHistoryResponse, MarketQuoteResponse, MarketSymbolResponse } from "@/types/market";
import type { TradeClosePayload, TradeOpenPayload } from "@/types";
import type {
  V2AccountListResponse,
  V2CloseTradeResponse,
  V2OpenTradeResponse,
  V2TradeListResponse,
} from "@/types/v2-dashboard";
import type { V2MarketSnapshot } from "@/types/v2-market";

function resolveAccount(response: V2AccountListResponse, accountId?: string) {
  const accounts = Array.isArray(response) ? response : response.accounts;
  return accountId ? accounts.find((account) => account.id === accountId) : accounts[0];
}

export const terminalApi = {
  async getMarketQuotes(symbols: string[], authToken?: string): Promise<MarketQuoteResponse> {
    const snapshots = await Promise.all(
      symbols.map((symbol) =>
        get<V2MarketSnapshot>(ROUTES.MARKET.SNAPSHOT, {
          params: { symbol, interval: "M1", limit: 1 },
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
        }).catch(() => null),
      ),
    );

    return {
      quotes: snapshots.flatMap((snapshot) => {
        if (!snapshot) {
          return [];
        }

        const latest = snapshot.candles.at(-1);
        const price = snapshot.quote?.last ?? latest?.close;

        if (price == null) {
          return [];
        }

        return [{
          symbol: snapshot.symbol,
          price,
          bid: snapshot.quote?.bid ?? price,
          ask: snapshot.quote?.ask ?? price,
          change: snapshot.day?.change ?? 0,
          changePercent: snapshot.day?.changePercent ?? 0,
          timestamp: latest?.openTime ?? new Date().toISOString(),
          source: snapshot.quote ? "eodhd-ws" : "eodhd-db",
        }];
      }),
    };
  },

  getMarketHistory(symbol: string, interval: "1m" | "5m" | "15m" | "1h" | "1d" = "1d", limit = 120): Promise<MarketHistoryResponse> {
    return get(ROUTES.MARKET.HISTORY, { params: { symbol, interval, limit } });
  },

  getMarketSymbols(): Promise<MarketSymbolResponse> {
    return get(ROUTES.MARKET.SYMBOLS);
  },

  async getOpenPositions(authToken?: string, accountId?: string): Promise<UserPortfolioResponse> {
    const response = await get<V2AccountListResponse>(ROUTES.ACCOUNT.LIST, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });
    const account = resolveAccount(response, accountId);

    if (!account) {
      throw new Error("Account not found.");
    }

    return mapV2AccountToPortfolioSnapshot(account);
  },

  async getAccountLedger(accountId: string, authToken?: string): Promise<AccountLedgerResponse> {
    const [accountsResponse, tradesResponse] = await Promise.all([
      get<V2AccountListResponse>(ROUTES.ACCOUNT.LIST, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      }),
      get<V2TradeListResponse>(ROUTES.TRADE.LIST, {
        params: { accountId, limit: 100 },
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      }),
    ]);
    const account = resolveAccount(accountsResponse, accountId);
    const mapped = getTradesFromV2Response(tradesResponse);

    if (!account) {
      throw new Error("Account not found.");
    }

    return {
      account,
      positions: mapped.positions,
      trades: mapped.trades,
      tradePagination: mapped.tradePagination,
    };
  },

  async placeOrder(order: TradeOpenPayload, authToken?: string): Promise<TradeOpenResponse> {
    const response = await post<V2OpenTradeResponse>(ROUTES.TRADE.LIST, order, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });

    return mapV2OpenResponse(response);
  },

  async closeTrade(payload: TradeClosePayload, authToken?: string): Promise<TradeCloseResponse> {
    const response = await post<V2CloseTradeResponse>(`${ROUTES.TRADE.LIST}/${encodeURIComponent(payload.positionId)}/close`, {}, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });

    return mapV2CloseResponse(response);
  },
};
