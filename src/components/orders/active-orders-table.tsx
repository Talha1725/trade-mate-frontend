"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { IoCloseCircle } from "react-icons/io5";

import { TradingSymbolCell } from "@/components/shared/trading-symbol-cell";
import {
  formatTradingPrice,
  formatTradingQty,
  TRADING_TABLE_ROW_CLASS,
  TradingOrderStatusBadge,
  TradingSideBadge,
} from "@/components/shared/trading-table-cells";
import { TradingTableCard } from "@/components/shared/trading-table-card";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockActiveOrders } from "@/lib/mock-data/active-orders";
import type {
  ActiveOrderRow,
  ActiveOrdersTableProps,
  ActiveOrderStatus,
  ActiveOrderType,
} from "@/types/active-orders";

function formatTpSl(takeProfit: number | null, stopLoss: number | null, symbol: string) {
  if (takeProfit === null && stopLoss === null) {
    return "-";
  }

  const tp = takeProfit === null ? "-" : formatTradingPrice(takeProfit, symbol);
  const sl = stopLoss === null ? "-" : formatTradingPrice(stopLoss, symbol);
  return `${tp} / ${sl}`;
}

function formatOrderType(type: ActiveOrderType) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function OrderStatusBadge({ status }: { status: ActiveOrderStatus }) {
  return (
    <TradingOrderStatusBadge
      label={status === "new" ? "New" : "Partial"}
      tone={status === "new" ? "primary" : "orange"}
    />
  );
}

function CancelButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-destructive/10 bg-destructive/10 px-3.5 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
    >
      <IoCloseCircle className="size-4 text-destructive" />
      Cancel
    </button>
  );
}

export function ActiveOrdersTable({
  title = "Active Orders",
  orders = mockActiveOrders,
  onExport,
  onCloseAll,
  onCancel,
  className,
}: ActiveOrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<ActiveOrderRow>[]>(
    () => [
      {
        accessorKey: "displayId",
        header: ({ column }) => <SortableColumnHeader column={column} label="ID" />,
        cell: ({ row }) => <span className="text-sm text-white/60">{row.original.displayId}</span>,
      },
      {
        accessorKey: "symbol",
        header: ({ column }) => <SortableColumnHeader column={column} label="Symbol" />,
        cell: ({ row }) => <TradingSymbolCell symbol={row.original.symbol} />,
      },
      {
        accessorKey: "side",
        header: ({ column }) => <SortableColumnHeader column={column} label="Side" />,
        cell: ({ row }) => <TradingSideBadge side={row.original.side} />,
      },
      {
        accessorKey: "type",
        header: ({ column }) => <SortableColumnHeader column={column} label="Type" />,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-white/60">{formatOrderType(row.original.type)}</span>
        ),
      },
      {
        accessorKey: "qty",
        header: ({ column }) => <SortableColumnHeader column={column} label="Qty" />,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-white/60">{formatTradingQty(row.original.qty)}</span>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => <SortableColumnHeader column={column} label="Price" />,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-white/60">
            {formatTradingPrice(row.original.price, row.original.symbol)}
          </span>
        ),
      },
      {
        id: "tpSl",
        header: "TP / SL",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-white/60">
            {formatTpSl(row.original.takeProfit, row.original.stopLoss, row.original.symbol)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => <SortableColumnHeader column={column} label="Status" />,
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="text-right">
            <CancelButton onClick={() => onCancel?.(row.original.id)} />
          </div>
        ),
      },
    ],
    [onCancel],
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <TradingTableCard
      title={title}
      onExport={onExport}
      onCloseAll={onCloseAll}
      className={className}
      >
      <Table className="min-w-[1040px]">
        <TableHeader variant="gradient">
          <TableRow className="hover:bg-transparent">
            {table.getHeaderGroups()[0].headers.map((header) => (
              <TableHead
                key={header.id}
                className={header.column.id === "actions" ? "h-11 px-4 text-right text-sm font-medium text-white/60" : "h-11 px-4 text-sm font-medium text-white/60"}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className={TRADING_TABLE_ROW_CLASS}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cell.column.id === "actions" ? "px-4 py-[5px] text-right" : "px-4 py-[5px]"}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TradingTableCard>
  );
}
