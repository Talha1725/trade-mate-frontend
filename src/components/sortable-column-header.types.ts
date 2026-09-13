import type { Column } from "@tanstack/react-table";

export type SortableColumnHeaderProps<TData, TValue = unknown> = {
  column: Column<TData, TValue>;
  label: string;
  className?: string;
};
