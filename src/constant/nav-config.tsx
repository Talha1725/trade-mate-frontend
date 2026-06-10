import {
  HistoryIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  TerminalIcon,
  type LucideIcon,
} from "lucide-react";

import type { NavItem } from "@/types";

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    description: "Account overview and equity curve",
  },
  {
    id: "terminal",
    label: "Terminal",
    href: "/terminal",
    description: "Chart, order ticket, and positions",
  },
  {
    id: "history",
    label: "History",
    href: "/history",
    description: "Closed trades and account activity",
  },
  {
    id: "admin",
    label: "Admin",
    href: "/admin",
    description: "Account controls and trade injection",
  },
];

export const PRIMARY_NAV_ICON_MAP: Record<string, LucideIcon> = {
  dashboard: LayoutDashboardIcon,
  terminal: TerminalIcon,
  history: HistoryIcon,
  admin: ShieldCheckIcon,
};
