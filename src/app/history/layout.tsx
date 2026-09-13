import { RouteGuard } from "@/components/auth/route-guard";
import type { HistoryLayoutProps } from "./types";

export default function HistoryLayout({ children }: HistoryLayoutProps) {
  return <RouteGuard>{children}</RouteGuard>;
}
