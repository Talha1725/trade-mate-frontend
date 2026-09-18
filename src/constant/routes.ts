const API_PREFIX = "/api/v2";

export const ROUTES = {
  /** Auth Module */
  AUTH: {
    LOGIN:           `${API_PREFIX}/auth/login`,
    ME:              `${API_PREFIX}/auth/me`,
    FORGOT_PASSWORD: `${API_PREFIX}/auth/forgot-password`,
    RESET_PASSWORD:  `${API_PREFIX}/auth/reset-password`,
    LOGOUT:          `${API_PREFIX}/auth/logout`,
  },

  /** Market Module */
  MARKET: {
    HISTORY:        `${API_PREFIX}/market/candles`,
    CHART_DATA:     `${API_PREFIX}/market/candles`,
    SYMBOLS:        `${API_PREFIX}/assets`,
    SNAPSHOT:       `${API_PREFIX}/market/snapshot`,
    MOVERS:         `${API_PREFIX}/market/movers`,
    BY_SYMBOL: (s: string) => `${API_PREFIX}/market/snapshot?symbol=${encodeURIComponent(s)}`,
    CHART:    (s: string) => `${API_PREFIX}/market/candles?symbol=${encodeURIComponent(s)}`,
  },

  /** Trade Module */
  TRADE: {
    LIST:           `${API_PREFIX}/trades`,
    OPEN:           `${API_PREFIX}/trades`,
    CLOSE:          `${API_PREFIX}/trades`,
    MODIFY:         `${API_PREFIX}/trades`,
    ACCOUNT: (id: string) => `${API_PREFIX}/trades?accountId=${encodeURIComponent(id)}`,
    BY_ID:  (id: string) => `${API_PREFIX}/trades/${encodeURIComponent(id)}`,
    CREATE:         `${API_PREFIX}/trades`,
    HISTORY:        `${API_PREFIX}/trades`,
  },

  /** Position Module */
  POSITION: {
    LIST:           `${API_PREFIX}/trades?status=OPEN`,
    BY_ID:  (id: string) => `${API_PREFIX}/trades/${encodeURIComponent(id)}`,
    CLOSE:  (id: string) => `${API_PREFIX}/trades/${encodeURIComponent(id)}/close`,
  },

  /** Account Module */
  ACCOUNT: {
    SUMMARY:        `${API_PREFIX}/dashboard/overview`,
    BY_ID:  (id: string) => `${API_PREFIX}/admin/accounts/${encodeURIComponent(id)}`,
    LIST:           `${API_PREFIX}/accounts`,
    WISHLIST: (accountNumber: string) =>
      `${API_PREFIX}/wishlist/${encodeURIComponent(accountNumber)}`,
    WISHLIST_ITEM: (accountNumber: string, assetId: string) =>
      `${API_PREFIX}/wishlist/${encodeURIComponent(accountNumber)}/${encodeURIComponent(assetId)}`,
  },

  /** Dashboard Module */
  DASHBOARD: {
    OVERVIEW:       `${API_PREFIX}/dashboard/overview`,
    SUMMARY:        `${API_PREFIX}/dashboard/overview`,
    EQUITY_CURVE:   `${API_PREFIX}/portfolio/chart`,
    BREAKDOWN:      `${API_PREFIX}/portfolio/allocation`,
    RECENT_ACTIVITY:`${API_PREFIX}/admin/audit-logs`,
    STAT_CARDS:     `${API_PREFIX}/dashboard/overview`,
  },

  /** Analytics Module */
  ANALYTICS: {
    OVERVIEW:       `${API_PREFIX}/analytics/overview`,
    PERFORMANCE:    `${API_PREFIX}/analytics/performance`,
  },

  /** Portfolio Module */
  PORTFOLIO: {
    SUMMARY:        `${API_PREFIX}/portfolio/summary`,
    CHART:          `${API_PREFIX}/portfolio/chart`,
    ALLOCATION:     `${API_PREFIX}/portfolio/allocation`,
  },

  /** Settings Module */
  SETTINGS: {
    OVERVIEW:       `${API_PREFIX}/settings/overview`,
    PROFILE:        `${API_PREFIX}/settings/profile`,
    PASSWORD:       `${API_PREFIX}/settings/password`,
    AVATAR:         `${API_PREFIX}/settings/avatar`,
    AVATAR_PRESIGN: `${API_PREFIX}/settings/avatar/presign`,
  },

  /** Orders Module */
  ORDERS: {
    OVERVIEW:       `${API_PREFIX}/trades`,
  },

  /** Assets Module */
  ASSETS: {
    LIST:           `${API_PREFIX}/assets`,
  },

  /** Desktop Module */
  DESKTOP_RELEASES: {
    LATEST:         `${API_PREFIX}/desktop-releases/latest`,
  },

  /** Integrations Module */
  INTEGRATIONS: {
    URFX_PRICING_RULES: (planKey: string) =>
      `${API_PREFIX}/partner/pricing-rules/${encodeURIComponent(planKey)}`,
  },

  /** Admin Module */
  ADMIN: {
    ACCOUNTS:        `${API_PREFIX}/admin/accounts`,
    TRADES:          `${API_PREFIX}/admin/trades`,
    TRADE_BY_ID: (id: string) => `${API_PREFIX}/admin/trades/${encodeURIComponent(id)}`,
    USERS:           `${API_PREFIX}/admin/users`,
    INJECT_PREVIEW:  `${API_PREFIX}/admin/injections/preview`,
    INJECT:          `${API_PREFIX}/admin/injections`,
    BULK_PUSH:       `${API_PREFIX}/admin/trades`,
    AUDIT:           `${API_PREFIX}/admin/audit-logs`,
  },
} as const

export const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/logout",
  "/forgot-password",
  "/reset-password",
])


export default ROUTES
