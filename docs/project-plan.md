# Trade Mate Project Plan

Trade Mate is a brokerage-style trading platform built with Next.js and shadcn/ui.
This document is the working blueprint for the frontend, backend, and the UI that we will build first.

## Product Goal

Build a trading terminal where users can:

- browse market data
- place and manage trades
- monitor open positions and account performance
- review history
- let admins manage trades, inject trades, and audit activity

## Frontend Plan

### Stack

- Next.js App Router
- shadcn/ui
- TradingView Charting Library
- Zustand
- TanStack Query
- WebSocket live feed

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

- Market Data Service
- Order Engine
- WebSocket Price Server
- Trade-Injection Agent

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

### Dashboard

- Account balance card
- Equity card
- Floating P/L card
- Win rate card
- Equity curve chart
- Recent trades list
- P/L breakdown widgets

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

