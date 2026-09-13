import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ResponsiveTableScrollProps } from "@/components/shared/types";

export function ResponsiveTableScroll({
  children,
  className,
}: ResponsiveTableScrollProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full overflow-x-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}
