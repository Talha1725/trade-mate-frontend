import type { AccountActivityRow } from "@/types/account-activity-card";

export const mockAccountActivityRows: AccountActivityRow[] = [
  {
    id: "last-login",
    label: "Last Login",
    value: "May 21, 2026 06:15 AM",
    variant: "text",
  },
  {
    id: "last-password-change",
    label: "Last Password Change",
    value: "April 10, 2025",
    variant: "text",
  },
  {
    id: "active-sessions",
    label: "Active Sessions",
    value: "3 active sessions",
    variant: "sessions",
  },
  {
    id: "account-region",
    label: "Account Region",
    value: "United States (NY)",
    variant: "region",
    regionLabel: "United States (NY)",
    flagEmoji: "🇺🇸",
  },
];
