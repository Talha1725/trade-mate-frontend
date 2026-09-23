export const ROUTES = {
  /** Auth Module */
  AUTH: {
    LOGIN:           "/auth/login",
    ME:              "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD:  "/auth/reset-password",
    LOGOUT:          "/auth/logout",
  },

  /** Market Module */
  MARKET: {
    HISTORY:        "/market/candles",
    CHART_DATA:     "/market/candles",
    SYMBOLS:        "/assets",
    SNAPSHOT:       "/market/snapshot",
    MOVERS:         "/market/movers",
    BY_SYMBOL: (s: string) => `/market/snapshot?symbol=${encodeURIComponent(s)}`,
    CHART:    (s: string) => `/market/candles?symbol=${encodeURIComponent(s)}`,
  },

  /** Trade Module */
  TRADE: {
    LIST:           "/trades",
    OPEN:           "/trades",
    CLOSE:          "/trades",
    MODIFY:         "/trades",
    ACCOUNT: (id: string) => `/trades?accountId=${encodeURIComponent(id)}`,
    BY_ID:  (id: string) => `/trades/${encodeURIComponent(id)}`,
    CREATE:         "/trades",
    HISTORY:        "/trades",
  },

  /** Position Module */
  POSITION: {
    LIST:           "/trades?status=OPEN",
    BY_ID:  (id: string) => `/trades/${encodeURIComponent(id)}`,
    CLOSE:  (id: string) => `/trades/${encodeURIComponent(id)}/close`,
  },

  /** Account Module */
  ACCOUNT: {
    SUMMARY:        "/dashboard/overview",
    BY_ID:  (id: string) => `/admin/accounts/${encodeURIComponent(id)}`,
    LIST:           "/accounts",
    WISHLIST: (accountNumber: string) =>
      `/wishlist/${encodeURIComponent(accountNumber)}`,
    WISHLIST_ITEM: (accountNumber: string, assetId: string) =>
      `/wishlist/${encodeURIComponent(accountNumber)}/${encodeURIComponent(assetId)}`,
  },

  /** Dashboard Module */
  DASHBOARD: {
    OVERVIEW:       "/dashboard/overview",
    SUMMARY:        "/dashboard/overview",
    EQUITY_CURVE:   "/portfolio/chart",
    BREAKDOWN:      "/portfolio/allocation",
    RECENT_ACTIVITY:"/admin/audit-logs",
    STAT_CARDS:     "/dashboard/overview",
  },

  /** Analytics Module */
  ANALYTICS: {
    OVERVIEW:       "/analytics/overview",
    PERFORMANCE:    "/analytics/performance",
  },

  /** Portfolio Module */
  PORTFOLIO: {
    SUMMARY:        "/portfolio/summary",
    CHART:          "/portfolio/chart",
    ALLOCATION:     "/portfolio/allocation",
  },

  /** Settings Module */
  SETTINGS: {
    OVERVIEW:       "/settings/overview",
    PROFILE:        "/settings/profile",
    PASSWORD:       "/settings/password",
    AVATAR:         "/settings/avatar",
    AVATAR_PRESIGN: "/settings/avatar/presign",
  },

  /** Orders Module */
  ORDERS: {
    OVERVIEW:       "/trades",
  },

  /** Assets Module */
  ASSETS: {
    LIST:           "/assets",
  },

  /** Desktop Module */
  DESKTOP_RELEASES: {
    LATEST:         "/desktop-releases/latest",
  },

  /** Integrations Module */
  INTEGRATIONS: {
    URFX_PRICING_RULES: (planKey: string) =>
      `/partner/pricing-rules/${encodeURIComponent(planKey)}`,
  },

  /** Admin Module */
  ADMIN: {
    ACCOUNTS:        "/admin/accounts",
    TRADES:          "/admin/trades",
    TRADE_BY_ID: (id: string) => `/admin/trades/${encodeURIComponent(id)}`,
    USERS:           "/admin/users",
    INJECT_PREVIEW:  "/admin/injections/preview",
    INJECT:          "/admin/injections",
    BULK_PUSH:       "/admin/trades",
    AUDIT:           "/admin/audit-logs",
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
