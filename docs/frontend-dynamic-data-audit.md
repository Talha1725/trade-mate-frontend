# Trade Mate Frontend Dynamic Data Audit

Date: June 29, 2026

This audit reviews the `trade-mate-frontend` only. The backend is assumed to stay mostly as-is for now, except where new endpoints are needed to replace mock data in the UI.

## What Is Already Backed By The Backend

These areas already have real API support or are close to it:

- Authentication
- User session restore / logout
- Dashboard account snapshot and ledger
- Terminal market symbols, quotes, history, open positions
- Trade open / close
- History ledger view
- Admin account/trade/audit tooling
- Admin AI injection
- Live price websocket stream

These do not need a new frontend architecture. They mainly need cleanup, better endpoint coverage, or removal of fallback mock values.

## Pages Still Relying On Dummy Or Fallback Data

### 1. Dashboard

Current mock sources:

- `src/lib/mock-data/trading-filter-bar.ts`
- `src/lib/mock-data/market-watch-card.ts`
- `src/lib/mock-data/open-positions-strip.ts`
- `src/components/common/live-trading-view.tsx` fallback mock data

What is still not fully dynamic:

- market filter bar assets
- quote + OHLCV summary shown in the filter bar
- market watch list
- open positions strip
- compare asset list
- some dashboard visual widgets still expect fallback data when the backend payload is missing

Recommended backend endpoints:

- `GET /api/dashboard/overview`
- `GET /api/market/watchlist`
- `GET /api/market/summary?symbol=...`
- `GET /api/dashboard/open-positions-strip`
- `GET /api/dashboard/compare-assets`

Priority: high

### 2. Analytics

Current mock sources:

- `src/lib/mock-data/analytics-metrics.ts`
- `src/lib/mock-data/equity-curve-chart.ts`
- `src/lib/mock-data/strategy-performance.ts`
- `src/lib/mock-data/trading-calendar.ts`
- `src/lib/mock-data/challenge-progress.ts`
- `src/lib/mock-data/performance-insights.ts`

What is still not fully dynamic:

- metric cards
- equity curve chart
- strategy performance table
- trading calendar
- challenge progress block
- performance insights

Recommended backend endpoints:

- `GET /api/analytics/overview`
- `GET /api/analytics/equity-curve?timeframe=...`
- `GET /api/analytics/strategy-performance`
- `GET /api/analytics/trading-calendar`
- `GET /api/analytics/challenge-progress`
- `GET /api/analytics/performance-insights`

Priority: high

### 3. Orders

Current mock sources:

- `src/lib/mock-data/orders-metrics.ts`
- `src/lib/mock-data/order-book.ts`
- `src/lib/mock-data/orders-depth-chart.ts`
- `src/lib/mock-data/orders-recent-trades.ts`

What is still not fully dynamic:

- order metrics cards
- order book snapshot
- depth chart
- recent trades table in the orders page

Recommended backend endpoints:

- `GET /api/orders/overview`
- `GET /api/orders/book?symbol=...`
- `GET /api/orders/depth?symbol=...`
- `GET /api/orders/recent-trades?accountId=...`

Priority: medium-high

### 4. Portfolio

Current mock sources:

- `src/lib/mock-data/portfolio-metrics.ts`
- `src/lib/mock-data/portfolio-value-chart.ts`
- `src/lib/mock-data/portfolio-allocation.ts`
- `src/lib/mock-data/portfolio-exposure-breakdown.ts`
- `src/lib/mock-data/portfolio-top-movers.ts`
- `src/lib/mock-data/portfolio-open-positions.ts`

What is still not fully dynamic:

- portfolio metric cards
- portfolio value chart
- allocation chart
- exposure breakdown
- top movers
- open positions table if the backend does not supply a fresh snapshot

Recommended backend endpoints:

- `GET /api/portfolio/overview`
- `GET /api/portfolio/value-curve?timeframe=...`
- `GET /api/portfolio/allocation`
- `GET /api/portfolio/exposure-breakdown`
- `GET /api/portfolio/top-movers`
- `GET /api/portfolio/open-positions`

Priority: medium-high

### 5. Settings

Current mock sources:

- `src/lib/mock-data/account-information.ts`
- `src/lib/mock-data/account-activity.ts`
- `src/lib/mock-data/security-overview.ts`
- `src/lib/mock-data/subscription-plan.ts`
- `src/lib/mock-data/account-actions.ts`

What is still not fully dynamic:

- account details panel
- security overview rows
- active sessions / login activity
- subscription plan and billing state
- account actions list

Recommended backend endpoints:

- `GET /api/settings/account`
- `GET /api/settings/security`
- `GET /api/settings/activity`
- `GET /api/settings/subscription`
- `GET /api/settings/actions`

Priority: medium

### 6. Alerts

Current state:

- `src/app/alerts/page.tsx` is still a placeholder / not found screen.

Recommended backend and frontend work:

- build a real alerts page
- add alert CRUD endpoints

Recommended backend endpoints:

- `GET /api/alerts`
- `POST /api/alerts`
- `PATCH /api/alerts/:id`
- `DELETE /api/alerts/:id`

Priority: medium

### 7. History

Current state:

- The page is already mostly dynamic.
- It still has a mock fallback in the table component, so if the page stops passing data or a fetch fails unexpectedly, it can still fall back to mock rows.

Current source:

- `src/components/history/trade-history-table.tsx`

Recommended backend work:

- keep the existing ledger endpoint
- make sure the ledger API always returns the full account trade history with stable pagination/filter support
- remove any remaining mock fallback behavior once the backend responses are fully trusted

Priority: high

## Shared UI Still Using Mock Or Fallback Data

These are not page-specific, but they are still important because they keep parts of the UI looking “real” even when backend data is absent:

- `src/components/dashboard/trading-filter-bar.tsx`
- `src/components/common/live-trading-view.tsx`
- `src/components/dashboard/market-watch-card.tsx`
- `src/components/dashboard/market-snapshot-card.tsx`
- `src/components/dashboard/open-positions-strip-card.tsx`
- `src/components/orders/order-book-card.tsx`
- `src/components/orders/depth-chart-card.tsx`
- `src/components/orders/recent-trades-table.tsx`
- `src/components/portfolio/portfolio-metric-cards.tsx`
- `src/components/portfolio/portfolio-value-chart.tsx`
- `src/components/portfolio/portfolio-allocation-card.tsx`
- `src/components/portfolio/portfolio-exposure-breakdown-card.tsx`
- `src/components/portfolio/portfolio-top-movers-card.tsx`
- `src/components/settings/*`
- `src/components/analytics/*`

Most of these can be made fully dynamic once the endpoint coverage above exists.

## Suggested Backend Build Order

### Phase 1: Core product data

1. Dashboard overview endpoint
2. Market watchlist / filter data endpoint
3. Portfolio overview endpoint
4. Analytics overview endpoint
5. Orders overview endpoint

### Phase 2: Charts and breakdown widgets

1. Equity / portfolio curve endpoint
2. Allocation endpoint
3. Exposure breakdown endpoint
4. Top movers endpoint
5. Trading calendar endpoint
6. Challenge progress endpoint

### Phase 3: Secondary product surfaces

1. Settings endpoints
2. Alerts CRUD endpoints
3. Better recent-trades and order-book endpoints

### Phase 4: Cleanup

1. Remove mock fallbacks from page components
2. Remove fallback rows from tables that now have reliable backend data
3. Add proper loading / empty / error states for each page

## Recommended Next Step

Before adding more backend endpoints, lock the frontend contract for each page:

- required fields
- pagination expectations
- date ranges
- numeric precision
- account scoping rules
- empty-state behavior

That will keep the backend endpoints small and predictable instead of over-engineered.
