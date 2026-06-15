import * as React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Any user can visit /dashboard without login
  return <>{children}</>;
}
