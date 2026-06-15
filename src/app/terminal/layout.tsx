import * as React from "react";

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  // Any user can visit /terminal without login
  return <>{children}</>;
}
