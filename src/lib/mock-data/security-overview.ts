import type { SecurityOverviewRow } from "@/types/security-overview-card";

export const mockSecurityOverviewRows: SecurityOverviewRow[] = [
  {
    id: "password",
    label: "Password",
    value: "••••••••••",
    valueTone: "masked",
    actionLabel: "Change",
  },
  {
    id: "two-factor",
    label: "Two Factor Authentication",
    value: "Enabled",
    valueTone: "positive",
  },
  {
    id: "email-verification",
    label: "Email Verification",
    value: "Verified",
    valueTone: "positive",
    showVerifiedIcon: true,
    actionLabel: "Manage",
  },
  {
    id: "login-alerts",
    label: "Login Alerts",
    value: "Enabled",
    valueTone: "positive",
    actionLabel: "Manage",
  },
];
