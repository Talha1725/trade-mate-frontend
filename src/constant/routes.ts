export const ROUTES = {
  /** Auth Module */
  AUTH: {
    LOGIN:           `/api/auth/login`,
    ME:              `/api/auth/me`,
  },

  /** Market Module */
  MARKET: {
    QUOTES:         `/api/market/quotes`,
    HISTORY:        `/api/market/history`,
    SYMBOLS:        `/api/market/symbols`,
    BY_SYMBOL: (s: string) => `/api/market/${s}`,
    CHART:    (s: string) => `/api/market/${s}/chart`,
  },

  /** Trade Module */
  TRADE: {
    LIST:           `/api/trades`,
    OPEN:           `/api/trades/open`,
    CLOSE:          `/api/trades/close`,
    ACCOUNT: (id: string) => `/api/trades/account/${id}`,
    BY_ID:  (id: string) => `/api/trades/${id}`,
    CREATE:         `/api/trades/create`,
    HISTORY:        `/api/trades/history`,
  },

  /** Position Module */
  POSITION: {
    LIST:           `/api/positions`,
    BY_ID:  (id: string) => `/api/positions/${id}`,
    CLOSE:  (id: string) => `/api/positions/${id}/close`,
  },

  /** Account Module */
  ACCOUNT: {
    SUMMARY:        `/api/account/summary`,
    BY_ID:  (id: string) => `/api/account/${id}`,
  },

  /** Dashboard Module */
  DASHBOARD: {
    SUMMARY:        `/api/dashboard/summary`,
    EQUITY_CURVE:   `/api/dashboard/equity-curve`,
    BREAKDOWN:      `/api/dashboard/breakdown`,
    RECENT_ACTIVITY:`/api/dashboard/recent-activity`,
    STAT_CARDS:     `/api/dashboard/stat-cards`,
  },

  /** Admin Module */
  ADMIN: {
    ACCOUNTS:        `/api/admin/accounts`,
    TRADES:          `/api/admin/trades`,
    TRADE_BY_ID: (id: string) => `/api/admin/trades/${id}`,
    USERS:           `/api/admin/users`,
    INJECT_PREVIEW:  `/api/admin/inject/preview`,
    INJECT:          `/api/admin/inject`,
    BULK_PUSH:       `/api/admin/bulk-push`,
    AUDIT:           `/api/admin/audit`,
  },
} as const

export type RoutesType = typeof ROUTES

export default ROUTES
