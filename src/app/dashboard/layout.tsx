import { RouteGuard } from "@/components/auth/route-guard";
import type { DashboardLayoutProps } from "./types";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <RouteGuard>{children}</RouteGuard>;
}
