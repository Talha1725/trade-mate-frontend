"use client";

import { useState, useMemo, useCallback } from "react";
import { FilterIcon, SearchIcon } from "lucide-react";

import { SectionCard } from "@/components/section-card";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { mockTrades } from "@/lib/mock-data/trades";
import { useTableQuery } from "@/hooks/use-table-query";
import type { TradeHistoryTableProps } from "@/types";
import type { Trade } from "@/types/trade";

export function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  const [timeFilter, setTimeFilter] = useState("30 Days");
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const sourceTrades = trades?.length ? trades : mockTrades;

  // Time is a positional "scope" (not a per-row predicate), so it's applied
  // before handing the rows to the shared search/filter/pagination hook.
  const timeScoped = useMemo(() => {
    if (timeFilter === "7 Days") {
      return sourceTrades.slice(0, 2);
    }
    return sourceTrades;
  }, [sourceTrades, timeFilter]);

  const searchText = useCallback((t: Trade) => `${t.symbol} ${t.id}`, []);
  const filterFn = useCallback(
    (t: Trade, f: Record<string, string>) =>
      !f.action || f.action === "All" || t.type === f.action,
    [],
  );
  const { search, setSearch, filters, setFilter, page, setPage, pageCount, rows } =
    useTableQuery({ rows: timeScoped, searchText, filterFn });

  const columns: ColumnDef<Trade>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <SortableColumnHeader column={column} label="Ticket" className="w-full justify-start" />,
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "time",
      header: ({ column }) => <SortableColumnHeader column={column} label="Open Time" className="w-full justify-start" />,
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("time")}</div>,
    },
    {
      accessorKey: "symbol",
      header: ({ column }) => <SortableColumnHeader column={column} label="Symbol" className="w-full justify-start" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("symbol")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return <div className={type === "Buy" ? "text-emerald-600" : "text-rose-600"}>{type}</div>;
      },
    },
    {
      accessorKey: "vol",
      header: ({ column }) => <SortableColumnHeader column={column} label="Volume" className="w-full justify-start" />,
      cell: ({ row }) => <div>{row.getValue("vol")}</div>,
    },
    {
      accessorKey: "openP",
      header: ({ column }) => <SortableColumnHeader column={column} label="Open Price" className="w-full justify-start" />,
      cell: ({ row }) => <div>{parseFloat(row.getValue("openP")).toFixed(4)}</div>,
    },
    {
      id: "closeTime",
      header: "Close Time",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("time")}</div>,
    },
    {
      accessorKey: "closeP",
      header: ({ column }) => <SortableColumnHeader column={column} label="Close Price" className="w-full justify-start" />,
      cell: ({ row }) => <div>{parseFloat(row.getValue("closeP")).toFixed(4)}</div>,
    },
    {
      accessorKey: "profit",
      header: ({ column }) => <SortableColumnHeader column={column} label="Profit" className="w-full justify-start" />,
      cell: ({ row }) => {
        const profit = parseFloat(row.getValue("profit"));
        return (
          <div className={`font-medium ${profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {profit > 0 ? "+" : ""}${profit.toFixed(2)}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs font-medium"
          onClick={() => setSelectedTrade(row.original)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <SectionCard title="Trade History" className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-1 items-center max-w-sm relative">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by symbol or ticket..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filters.action ?? "All"} onValueChange={(value) => setFilter("action", value ?? "All")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Actions</SelectItem>
              <SelectItem value="Buy">Buy</SelectItem>
              <SelectItem value="Sell">Sell</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value ?? "30 Days")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7 Days">7 Days</SelectItem>
              <SelectItem value="30 Days">30 Days</SelectItem>
              <SelectItem value="YTD">YTD</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        serverPagination={{ page, pageCount, onPageChange: setPage }}
      />

      {/* Centered Trade Detail Dialog */}
      <Dialog open={!!selectedTrade} onOpenChange={(open) => !open && setSelectedTrade(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Trade Details #{selectedTrade?.id}</DialogTitle>
            <DialogDescription>
              {selectedTrade?.symbol} — {selectedTrade?.type} {selectedTrade?.vol} Lots
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm py-2">
            <div className="flex flex-col gap-1 items-center text-center">
              <span className="text-muted-foreground">Open Price</span>
              <span className="font-semibold">{selectedTrade?.openP.toFixed(4)}</span>
            </div>
            <div className="flex flex-col gap-1 items-center text-center">
              <span className="text-muted-foreground">Close Price</span>
              <span className="font-semibold">{selectedTrade?.closeP.toFixed(4)}</span>
            </div>
            <div className="flex flex-col gap-1 items-center text-center">
              <span className="text-muted-foreground">Stop Loss</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="flex flex-col gap-1 items-center text-center">
              <span className="text-muted-foreground">Take Profit</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="flex flex-col gap-1 items-center text-center">
              <span className="text-muted-foreground">Commission</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex flex-col gap-1 items-center text-center">
              <span className="text-muted-foreground">Swap</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1 items-center text-center border-t pt-3">
              <span className="text-muted-foreground">Net Profit</span>
              <span className={`text-lg font-bold ${selectedTrade && selectedTrade.profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {selectedTrade && selectedTrade.profit > 0 ? "+" : ""}${selectedTrade?.profit.toFixed(2)}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}
