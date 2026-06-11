import * as React from "react";
import { RouteGuard } from "@/components/auth/route-guard";

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  // Any authenticated user can visit /history — no role restriction
  return <RouteGuard>{children}</RouteGuard>;
}
