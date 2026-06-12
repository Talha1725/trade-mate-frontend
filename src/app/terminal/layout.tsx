import * as React from "react";
import { RouteGuard } from "@/components/auth/route-guard";

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  // Any authenticated user can visit /terminal — no role restriction
  return <RouteGuard>{children}</RouteGuard>;
}
