"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { ClockIcon } from "lucide-react";
import { PiDownloadFill } from "react-icons/pi";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { TradingSymbolCell } from "@/components/shared/trading-symbol-cell";
import { ResponsiveTableScroll } from "@/components/shared/responsive-table-scroll";
import {
  formatTradingPrice,
  formatTradingQty,
  TRADING_TABLE_ROW_CLASS,
  TradingOrderStatusBadge,
  TradingPnlValue,
  TradingSideBadge,
} from "@/components/shared/trading-table-cells";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { Spinner } from "@/components/ui/spinner";
import { mockTrades } from "@/lib/mock-data/trades";
import { SIDEBAR_ICONS } from "@/lib/mock-data/sidebar-icons";
import { formatDateTimeLabel } from "@/lib/utils/trader-data";
import { cn } from "@/lib/utils";
import type { TradeHistoryTableProps } from "@/types/trade-history";
import type { Trade } from "@/types/trade";

function formatTradeDateTime(trade: Trade) {
  if (trade.time) {
    return trade.time;
  }

  if (trade.openedAt || trade.closedAt) {
    return formatDateTimeLabel(trade.closedAt ?? trade.openedAt);
  }

  return "-";
}

function HeaderStatPill({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-white/5 bg-linear-to-b from-white/7 to-white/3  px-4 py-2 text-sm font-medium text-white/60">
      {icon}
      <span className="text-white">{label}</span>
    </div>
  );
}

function TradeHistoryRowCells({ trade }: { trade: Trade }) {
  const isClosed = !trade.status || trade.status === "Closed";

  return (
    <TableRow className={TRADING_TABLE_ROW_CLASS}>
      <TableCell className="px-4 py-2 text-sm text-white/60">
        {formatTradeDateTime(trade)}
      </TableCell>
      <TableCell className="px-4 py-2">
        <TradingSymbolCell symbol={trade.symbol} />
      </TableCell>
      <TableCell className="px-4 py-2">
        <TradingSideBadge side={trade.type} />
      </TableCell>
      <TableCell className="px-4 py-2 text-sm font-medium text-white/60">
        {trade.executionType ?? "Market"}
      </TableCell>
      <TableCell className="px-4 py-2 text-sm font-medium text-white/60">
        {formatTradingQty(trade.vol)}
      </TableCell>
      <TableCell className="px-4 py-2 text-sm font-medium text-white/60">
        {formatTradingPrice(trade.openP)}
      </TableCell>
      <TableCell className="px-4 py-2 text-sm font-medium text-white/60">
        {formatTradingPrice(trade.closeP)}
      </TableCell>
      <TableCell className="px-4 py-2">
        <TradingPnlValue value={trade.profit} />
      </TableCell>
      <TableCell className="px-4 py-2">
        <TradingOrderStatusBadge
          label={isClosed ? "Closed" : "Open"}
          tone={isClosed ? "primary" : "orange"}
        />
      </TableCell>
    </TableRow>
  );
}

const tradeHistoryColumns: ColumnDef<Trade>[] = [
  {
    accessorKey: "time",
    header: ({ column }) => <SortableColumnHeader column={column} label="Date/Time" />,
    cell: ({ row }) => <span>{formatTradeDateTime(row.original)}</span>,
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => <SortableColumnHeader column={column} label="Symbol" />,
    cell: ({ row }) => <TradingSymbolCell symbol={row.original.symbol} />,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortableColumnHeader column={column} label="Side" />,
    cell: ({ row }) => <TradingSideBadge side={row.original.type} />,
  },
  {
    accessorKey: "executionType",
    header: ({ column }) => <SortableColumnHeader column={column} label="Type" />,
    cell: ({ row }) => <span>{row.original.executionType ?? "Market"}</span>,
  },
  {
    accessorKey: "vol",
    header: ({ column }) => <SortableColumnHeader column={column} label="Qty" />,
    cell: ({ row }) => <span>{formatTradingQty(row.original.vol)}</span>,
  },
  {
    accessorKey: "openP",
    header: ({ column }) => <SortableColumnHeader column={column} label="Entry" />,
    cell: ({ row }) => <span>{formatTradingPrice(row.original.openP)}</span>,
  },
  {
    accessorKey: "closeP",
    header: ({ column }) => <SortableColumnHeader column={column} label="Exit" />,
    cell: ({ row }) => <span>{formatTradingPrice(row.original.closeP)}</span>,
  },
  {
    accessorKey: "profit",
    header: ({ column }) => <SortableColumnHeader column={column} label="P&L" />,
    cell: ({ row }) => <TradingPnlValue value={row.original.profit} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableColumnHeader column={column} label="Status" />,
    cell: ({ row }) => {
      const isClosed = !row.original.status || row.original.status === "Closed";
      return (
        <TradingOrderStatusBadge
          label={isClosed ? "Closed" : "Open"}
          tone={isClosed ? "primary" : "orange"}
        />
      );
    },
  },
];

export function TradeHistoryTable({
  trades = mockTrades,
  isLoading = false,
  className,
}: TradeHistoryTableProps) {
  const stats = useMemo(() => {
    const total = trades.length;
    const winning = trades.filter((trade) => trade.profit > 0).length;
    const winRate = total > 0 ? Math.round((winning / total) * 100) : 0;

    return { total, winRate };
  }, [trades]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: trades,
    columns: tradeHistoryColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleExport = useCallback(() => {
    if (trades.length === 0) {
      return;
    }

    const headers = [
      "Date/Time",
      "Symbol",
      "Side",
      "Type",
      "Qty",
      "Entry",
      "Exit",
      "P&L",
      "Status",
    ];
    const rows = trades.map((trade) => [
      formatTradeDateTime(trade),
      trade.symbol,
      trade.type,
      trade.executionType ?? "Market",
      trade.vol,
      trade.openP,
      trade.closeP,
      trade.profit.toFixed(2),
      trade.status ?? "Closed",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "trade-history.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [trades]);

  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">Trade History</h3>

        <div className="flex flex-wrap items-center gap-3">
          <HeaderStatPill
            icon={<ClockIcon className="size-4 text-white" />}
            label={`${stats.total} trades`}
          />
          <HeaderStatPill
            icon={
              <Image
                src={SIDEBAR_ICONS.cupStar}
                alt="win rate"
                width={16}
                height={16}
                className="text-white"
              />
            }
            label={`${stats.winRate}% win rate`}
          />
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-white/5 bg-linear-to-b from-white/7 to-white/3 px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10"
          >
            <PiDownloadFill className="size-4 text-white" />
            <span className="text-white">Export</span>
          </button>
        </div>
      </div>

      {isLoading && trades.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-white/10">
          <div className="flex flex-col items-center gap-3 text-sm text-white/50">
            <Spinner className="size-5" />
            <span>Loading trade history...</span>
          </div>
        </div>
      ) : trades.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-white/10">
          <p className="text-sm text-white/40">No trades found.</p>
        </div>
      ) : (
        <ResponsiveTableScroll>
          <Table className="min-w-[980px]">
            <TableHeader variant="gradient">
              <TableRow className="hover:bg-transparent">
                {table.getHeaderGroups()[0]?.headers.map((header) => (
                  <TableHead key={header.id} className="h-11 px-4 text-sm font-medium text-white/60">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TradeHistoryRowCells key={row.original.id} trade={row.original} />
              ))}
            </TableBody>
          </Table>
        </ResponsiveTableScroll>
      )}
    </section>
  );
}
