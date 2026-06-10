<!-- BEGIN:trade-mate-agent-rules -->
# Trade Mate Project Rules

This repository uses Next.js App Router with a `src/`-first structure and shadcn/ui.
Any AI agent working in this project must follow these rules.

## Folder Structure

- Keep the application inside `src/`.
- Put all routes, layouts, and route handlers in `src/app`.
- Put shared UI in `src/components`.
- Put shadcn primitives and base UI components in `src/components/ui`.
- Put feature-specific workflows in `src/features/<feature-name>`.
- Put shared hooks in `src/hooks`.
- Put shared helpers, wrappers, and integrations in `src/lib`.
- Put all shared TypeScript types in `src/types`.
- Do not create random top-level folders unless they have a clear project purpose.

## Type Rules

- Do not define shared `type` or `interface` blocks inline in app, component, feature, hook, or lib files.
- If a file needs a shape, move that shape into `src/types` first and import it.
- Prefer domain-based type files when the area grows, such as `agent.ts`, `call-session.ts`, or `trade.ts`.
- Keep reusable types exported from `src/types/index.ts` when helpful.
- If a type is truly temporary and local, still prefer extracting it into `src/types` rather than leaving it in the same file.

## Naming Conventions

- Folders must use `kebab-case`.
- React components must use `PascalCase.tsx`.
- Non-component TypeScript files must use `kebab-case.ts`.
- Route files must use Next.js route names: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`.

## Code Organization

- Reuse existing components, hooks, helpers, and types before creating new ones.
- Keep logic close to the owning feature unless it is shared.
- If multiple files need the same shape or helper, move it to `src/types` or `src/lib`.
- Avoid duplicating UI patterns when a shared component already exists.
- Favor small, focused files over large mixed-purpose files.

## Agent Behavior

- Before adding new folders or files, check whether an existing folder or type already fits.
- When adding a new type, create or update the matching file in `src/types`.
- When refactoring, preserve current behavior unless the user explicitly requests a change.
- Keep changes consistent with the current app router and shadcn setup.

## Current Standard Layout

- `src/app` for routes and API handlers
- `src/components` for shared UI
- `src/components/ui` for shadcn components
- `src/features` for feature workflows
- `src/hooks` for hooks
- `src/lib` for utilities and integrations
- `src/types` for all shared types

<!-- END:trade-mate-agent-rules -->
