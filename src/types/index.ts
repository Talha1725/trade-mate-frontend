export type ID = string;

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
  RouteGuardProps,
  UserRole,
} from "@/types/auth";

export type { NavItem } from "@/types/nav";
export type { RootLayoutProps } from "@/types/layout";

export type * from "@/types/components";
export type * from "@/types/dashboard";
export type * from "@/types/market";
export type * from "@/types/price";
export type * from "@/types/trading-view";
export type * from "@/types/trading-filter-bar";
export type { TradeClosePayload, TradeOpenPayload, TradeOrderDirection } from "@/types/trade";
