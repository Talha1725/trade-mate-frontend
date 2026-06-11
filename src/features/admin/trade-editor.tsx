"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { SectionCard } from "@/components/section-card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { mockAccountTrades } from "@/lib/mock-data/trades";
import type { Trade, TradeEditorProps } from "@/types/trade";

const columns: ColumnDef<Trade>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableColumnHeader column={column} label="Ticket" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => <SortableColumnHeader column={column} label="Symbol" />,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortableColumnHeader column={column} label="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as Trade["type"];
      return <div className={type === "Buy" ? "text-emerald-600" : "text-rose-600"}>{type}</div>;
    },
  },
  {
    accessorKey: "vol",
    header: ({ column }) => <SortableColumnHeader column={column} label="Volume" />,
  },
  {
    accessorKey: "openP",
    header: ({ column }) => <SortableColumnHeader column={column} label="Open" />,
    cell: ({ row }) => <div>{parseFloat(row.getValue("openP")).toFixed(4)}</div>,
  },
  {
    accessorKey: "closeP",
    header: ({ column }) => <SortableColumnHeader column={column} label="Close" />,
    cell: ({ row }) => <div>{parseFloat(row.getValue("closeP")).toFixed(4)}</div>,
  },
  {
    accessorKey: "profit",
    header: ({ column }) => <SortableColumnHeader column={column} label="Profit" className="w-full justify-end" />,
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue("profit"));
      return (
        <div className={`text-right font-medium ${profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
          {profit > 0 ? "+" : ""}${profit.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: () => (
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-600">
          <Edit2Icon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-600">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export function TradeEditor({ accountId }: TradeEditorProps) {
  return (
    <SectionCard title={`Trade Editor for ${accountId}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Manage historical and active trades for this account.</p>
        <Button size="sm">Add Trade manually</Button>
      </div>
      <DataTable columns={columns} data={mockAccountTrades} pageSize={100} />
    </SectionCard>
  );
}
