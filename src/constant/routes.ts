const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export const ROUTES = {
  /** Auth Module */
  AUTH: {
    LOGIN:           `${BASE}/api/auth/login`,
    LOGOUT:          `${BASE}/api/auth/logout`,
    REGISTER:        `${BASE}/api/auth/register`,
    REFRESH:         `${BASE}/api/auth/refresh`,
    FORGOT_PASSWORD: `${BASE}/api/auth/forgot-password`,
    RESET_PASSWORD:  `${BASE}/api/auth/reset-password`,
  },

  /** Market Module */
  MARKET: {
    QUOTES:         `${BASE}/api/market/quotes`,
    HISTORY:        `${BASE}/api/market/history`,
    SYMBOLS:        `${BASE}/api/market/symbols`,
    BY_SYMBOL: (s: string) => `${BASE}/api/market/${s}`,
    CHART:    (s: string) => `${BASE}/api/market/${s}/chart`,
  },

  /** Trade Module */
  TRADE: {
    LIST:           `${BASE}/api/trades`,
    OPEN:           `${BASE}/api/trades/open`,
    CLOSE:          `${BASE}/api/trades/close`,
    BY_ID:  (id: string) => `${BASE}/api/trades/${id}`,
    CREATE:         `${BASE}/api/trades/create`,
    HISTORY:        `${BASE}/api/trades/history`,
  },

  /** Position Module */
  POSITION: {
    LIST:           `${BASE}/api/positions`,
    BY_ID:  (id: string) => `${BASE}/api/positions/${id}`,
    CLOSE:  (id: string) => `${BASE}/api/positions/${id}/close`,
  },

  /** Account Module */
  ACCOUNT: {
    SUMMARY:        `${BASE}/api/account/summary`,
    BY_ID:  (id: string) => `${BASE}/api/account/${id}`,
  },

  /** Dashboard Module */
  DASHBOARD: {
    SUMMARY:        `${BASE}/api/dashboard/summary`,
    EQUITY_CURVE:   `${BASE}/api/dashboard/equity-curve`,
    BREAKDOWN:      `${BASE}/api/dashboard/breakdown`,
    RECENT_ACTIVITY:`${BASE}/api/dashboard/recent-activity`,
    STAT_CARDS:     `${BASE}/api/dashboard/stat-cards`,
  },

  /** Admin Module */
  ADMIN: {
    TRADES:          `${BASE}/api/admin/trades`,
    ACCOUNTS:        `${BASE}/api/admin/accounts`,
    ACCOUNT_BY_ID: (id: string) => `${BASE}/api/admin/accounts/${id}`,
    ACCOUNT_TRADES:(id: string) => `${BASE}/api/admin/accounts/${id}/trades`,
    INJECT:          `${BASE}/api/admin/inject`,
    BULK_PUSH:       `${BASE}/api/admin/bulk-push`,
    AUDIT:           `${BASE}/api/admin/audit`,
  },
} as const

export type RoutesType = typeof ROUTES

export default ROUTES
