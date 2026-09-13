import { RouteGuard } from "@/components/auth/route-guard";
import type { AlertsLayoutProps } from "./types";

export default function TerminalLayout({ children }: AlertsLayoutProps) {
  return <RouteGuard>{children}</RouteGuard>;
}
