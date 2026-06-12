import * as React from "react";
import { RouteGuard } from "@/components/auth/route-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Any authenticated user can visit /dashboard — no role restriction
  return <RouteGuard>{children}</RouteGuard>;
}
