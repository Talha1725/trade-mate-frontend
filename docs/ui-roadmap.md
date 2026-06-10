# Trade Mate UI Roadmap

This file is the UI-only checklist for the first implementation pass.

## Shared UI Foundations

- `AppShell`
- `TopBar`
- `SidebarNav`
- `PageHeader`
- `LoadingState`
- `EmptyState`

These should be the shared shell pieces that every route reuses.

## Shared Primitives

- `MetricCard`
- `SectionCard`
- `DataTable`
- `StatusBadge`
- `SearchInput`
- `FilterBar`
- `DrawerPanel`

These primitives should be reused across dashboard, terminal, history, and admin screens instead of inventing one-off variants.

## Route UI Checklist

### `/`

- login card
- brand panel
- feature overview

## Auth Pages Roadmap

### MVP

- Use `/` as the landing and login entry point.
- Keep the first version focused on a single login card instead of separate auth screens.
- Do not add signup unless the product explicitly needs self-service registration.

### Optional Later Pages

- `/login` for a dedicated login form
- `/forgot-password` for password recovery
- `/reset-password` for password reset

### Auth UI Rules

- Auth screens should stay minimal and branded.
- Auth UI should reuse shared shadcn components.
- Keep auth state and redirects consistent with the App Router structure.

### `/dashboard`

- metric cards
- equity chart
- recent trades
- breakdown widgets
- open positions summary

### `/terminal`

- symbol search
- chart area
- order ticket
- open positions
- close position actions

### `/history`

- filters
- trade table
- detail drawer

### `/admin`

- admin nav
- account selector
- audit summary
- live trade / push shortcuts

### `/admin/accounts/[id]`

- account overview
- trade editor
- action buttons
- trade history context

### `/admin/inject`

- natural language input
- target account selector
- preview panel
- submit action

### Shared Backend-Driven UI Expectations

- Every trade row should be traceable to the account and source that produced it.
- Open positions should update in near real time when the price feed changes.
- Admin actions should be visible in an audit log.
- Dashboard widgets should be data-focused, not decorative.
