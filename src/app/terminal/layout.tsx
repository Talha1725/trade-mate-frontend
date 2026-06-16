import * as React from "react";
import { RouteGuard } from "@/components/auth/route-guard";

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard>{children}</RouteGuard>;
}
