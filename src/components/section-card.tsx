import * as React from "react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  className,
  contentClassName,
  children,
}: SectionCardProps) {
  return (
    <Card className={cn("h-full rounded-2xl border border-gray-200 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)]", className)}>
      <CardHeader>
        <div className="flex items-start gap-3">
          {Icon ? (
            <span className="mt-0.5 grid size-9 place-items-center rounded-xl bg-[#eff3f8] text-gray-500">
              <Icon className="size-4" />
            </span>
          ) : null}
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="text-base font-semibold text-[#1a1a1a]">{title}</CardTitle>
            {description ? (
              <CardDescription className="text-gray-500">{description}</CardDescription>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
