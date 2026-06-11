"use client";

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SortableColumnHeaderProps } from "@/types";

export function SortableColumnHeader<TData, TValue = unknown>({
  column,
  label,
  className,
}: SortableColumnHeaderProps<TData, TValue>) {
  const sortDirection = column.getIsSorted();
  const SortIcon =
    sortDirection === "asc"
      ? ArrowUpIcon
      : sortDirection === "desc"
        ? ArrowDownIcon
        : ArrowUpDownIcon;

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sortDirection === "asc")}
      className={cn("h-auto px-0 font-medium", className)}
    >
      {label}
      <SortIcon className="ml-2 h-4 w-4" />
    </Button>
  );
}
