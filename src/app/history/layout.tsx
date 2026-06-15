import * as React from "react";

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  // Any user can visit /history without login
  return <>{children}</>;
}
