# Trade Mate Project Plan

Trade Mate is a simulated brokerage / trading terminal built with Next.js and shadcn/ui.
The goal is to let users place real-feeling trades against live market data while the backend can fully control and customize account history and trades.

## Product Goal

Build a trading terminal where users can:

- browse market data
- place and manage trades
- monitor open positions and account performance
- review history
- let admins manage trades, inject trades, and audit activity

The platform should feel like MetaTrader on the front end, but the backend must be able to edit history, inject trades, and shape what each account shows.

## Frontend Plan

### Stack

- Next.js App Router
- shadcn/ui
- TradingView Charting Library
- Zustand
- TanStack Query
- WebSocket live feed
- EODHD market-data relay

### Routes

| Route | Purpose |
|---|---|
| `/` | Landing / login |
| `/dashboard` | Equity curve, stat cards, summary widgets |
| `/terminal` | Trading terminal with chart, order ticket, and positions |
| `/history` | Trade history with filters |
| `/admin` | Admin control panel |
| `/admin/accounts/[id]` | Per-account trade editor |
| `/admin/inject` | Trade-injection agent UI |

### UI Components to Build

Build these reusable pieces first so pages can be composed quickly:

- `AppShell`
- `TopBar`
- `SidebarNav`
- `TradingViewChart`
- `SymbolSearch`
- `OrderTicket`
- `OpenPositionsTable`
- `TradeHistoryTable`
- `EquityCurveChart`
- `StatCards`
- `RecentTrades`
- `BreakdownWidgets`
- `AdminTradeEditor`
- `InjectTradeForm`
- `AuditLogTable`
- `BulkPushModal`

These are the core UI building blocks for the brokerage experience:

- `TradingViewChart` must consume the same symbol mapping used by the market-data layer.
- `OrderTicket` must support market buy/sell, SL/TP, and lot sizing.
- `OpenPositionsTable` must show floating P/L and close actions.
- `TradeHistoryTable` must support filters and readable account history.
- `AuditLogTable` must surface every admin mutation.

## Backend Plan

### API Routes

```txt
/api/auth/[...nextauth]
/api/market/quotes
/api/market/history
/api/market/symbols
/api/trades/open
/api/trades/close
/api/trades/[id]
/api/positions
/api/account/[id]
/api/admin/trades
/api/admin/inject
/api/admin/bulk-push
/api/admin/audit
```

### Core Services

- Market Data Service with EODHD relay, symbol normalization, caching, and rate-limit handling
- Order Engine with market orders, SL/TP, floating P/L, partial/full close, and pending-order-ready model design
- WebSocket Price Server for live updates and SL/TP checks
- Trade-Injection Agent for natural-language trade creation with validation

### Admin Layer

Every admin mutation must go through one shared `AdminTradeService` so we can:

1. Validate the requester is an admin
2. Create, update, or delete trades
3. Push a trade to one account or many accounts
4. Log every action in `AuditLog`
5. Open a live trade so it appears in the trader terminal like a self-placed trade

Bulk push should be all-or-nothing across the selected accounts.

## Database Schema

- `User`
- `Account`
- `Position`
- `Trade`
- `AuditLog`
- `PriceCache` in Redis

## UI Build Order

### Phase 1

1. Global app shell
2. Landing/login screen
3. Dashboard skeleton
4. Terminal layout
5. Shared tables and cards

### Phase 2

1. TradingView integration
2. Order ticket
3. Open positions table
4. Trade history table
5. Symbol search

### Phase 3

1. Admin control panel shell
2. Trade editor
3. Bulk push modal
4. Audit log
5. Inject trade UI

## UI Definition

Use this as the contract for what the first UI should contain:

### Landing Page

- Brand header
- Short value proposition
- Login area or CTA
- Minimal navigation

### Auth Direction

- The current MVP starts with `/` as the landing and login entry screen.
- Do not add a separate signup page unless the product later requires self-service registration.
- If we add dedicated auth flows later, keep them as separate App Router pages and follow the same project structure rules.

### Dashboard

- Account balance card
- Equity card
- Floating P/L card
- Win rate card
- Equity curve chart
- Recent trades list
- P/L breakdown widgets
- Open positions summary panel

### Terminal

- Symbol search panel
- TradingView chart
- Order ticket with buy/sell, lot size, SL, TP
- Open positions table
- Close position actions

### History

- Filter controls
- Search
- Trade history table
- Trade detail drawer or modal

### Admin

- Account picker
- Trade editor table
- Inline edit actions
- Bulk push modal
- Inject trade form
- Audit log table

## Implementation Rule

- Put shared types in `src/types`
- Put shared UI in `src/components`
- Put feature-specific logic in `src/features`
- Keep new work aligned with the folder rules in `AGENTS.md`
