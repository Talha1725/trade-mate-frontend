import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ResponsiveTableScrollProps } from "@/types/responsive-table-scroll";

export function ResponsiveTableScroll({
  children,
  className,
}: ResponsiveTableScrollProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}
