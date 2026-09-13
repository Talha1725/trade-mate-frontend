import type { ReactNode } from "react";

export type AppShellProps = {
  userLabel?: string;
  onSignOut?: () => void;
  children: ReactNode;
  className?: string;
};
