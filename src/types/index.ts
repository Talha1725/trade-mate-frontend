export type ID = string;

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type ISODateString = string;

export type Nullable<T> = T | null;

export type {
  AuthSession,
  AuthSessionStatus,
  AuthStatus,
  AuthStore,
  AuthStoreActions,
  AuthStoreState,
  AuthUser,
  LoginCredentials,
  LoginFormValues,
  UserRole,
} from "@/types/auth";

export type { NavItem } from "@/types/nav";

export type * from "@/types/account";
export type * from "@/types/dashboard";
export type * from "@/types/market";
export type * from "@/types/asset";
export type * from "@/types/wishlist";
export type * from "@/types/wishlist-store";
export type * from "@/types/eodhd";
export type * from "@/types/lightweight-trading-chart";
export type * from "@/types/price";
export type * from "@/types/trading-view";
export type * from "@/types/asset-icon";
export type * from "@/types/market-selection-store";
export type * from "@/types/trading-filter-bar";
export type * from "@/types/market-watch-card";
export type * from "@/types/market-snapshot";
export type * from "@/components/dashboard/types";
export type * from "@/components/portfolio/types";
export type * from "@/types/portfolio-metric-card";
export type * from "@/types/portfolio-value-chart";
export type * from "@/types/portfolio-open-positions";
export type * from "@/components/orders/types";
export type * from "@/types/orders";
export type * from "@/types/strategy-performance";
export type * from "@/types/order-book";
export type * from "@/types/active-orders";
export type * from "@/components/shared/types";
export type * from "@/components/settings/types";
export type * from "@/components/analytics/types";
export type * from "@/types/analytics";
export type * from "@/types/instrument-spec";
export type * from "@/types/chart/chart-indicators";
export type {
  AccountMetricsSummary,
  TradeClosePayload,
  TradeOpenPayload,
  TradeOrderDirection,
} from "@/types/trade";
