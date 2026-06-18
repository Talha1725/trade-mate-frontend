import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { SectionCardProps } from "@/types";

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
    <Card className={cn("p-0 px-0! border-none flex flex-col", className)}>
      <CardContent className={`${contentClassName} p-0 px-0! border-none`}>{children}</CardContent>
    </Card>
  );
}
