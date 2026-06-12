"use client";

import { useState, useMemo } from "react";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "@/components/section-card";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { mockPositions } from "@/lib/mock-data/positions";
import type { OpenPositionsTableProps } from "@/types";
import type { Position } from "@/types/trade";

export function OpenPositionsTable({ positions, onClosePosition }: OpenPositionsTableProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const sourcePositions = positions?.length ? positions : mockPositions;

  const sortedPositions = useMemo(() => {
    let result = [...sourcePositions];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.symbol.toLowerCase().includes(q) || p.ticket.toLowerCase().includes(q)
      );
    }

    if (actionFilter !== "All") {
      result = result.filter((p) => p.type === actionFilter);
    }

    return result;
  }, [actionFilter, search, sourcePositions]);

  const pageCount = Math.ceil(sortedPositions.length / PAGE_SIZE);
  const paginated = sortedPositions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: ColumnDef<Position>[] = [
    {
      accessorKey: "ticket",
      header: "Ticket",
    },
    {
      accessorKey: "symbol",
      header: ({ column }) => <SortableColumnHeader column={column} label="Symbol" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("symbol")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return <div className={type === "Buy" ? "text-emerald-600" : "text-rose-600"}>{type}</div>
      },
    },
    {
      accessorKey: "volume",
      header: ({ column }) => <SortableColumnHeader column={column} label="Volume" />,
    },
    {
      accessorKey: "openPrice",
      header: ({ column }) => <SortableColumnHeader column={column} label="Open Price" />,
    },
    {
      accessorKey: "sl",
      header: "S/L",
      cell: ({ row }) => <div>{row.getValue("sl") ?? "-"}</div>,
    },
    {
      accessorKey: "tp",
      header: "T/P",
      cell: ({ row }) => <div>{row.getValue("tp") ?? "-"}</div>,
    },
    {
      accessorKey: "current",
      header: ({ column }) => <SortableColumnHeader column={column} label="Current" />,
    },
    {
      accessorKey: "profit",
      header: ({ column }) => <SortableColumnHeader column={column} label="Profit" />,
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
          className="h-7 text-xs"
          disabled={!onClosePosition}
          onClick={() => onClosePosition?.(row.original)}
        >
          Close
        </Button>
      ),
    },
  ];

  return (
    <SectionCard title="Open Positions">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Filter positions..." 
            className="pl-8" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={actionFilter} onValueChange={(value) => setActionFilter(value ?? "All")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Actions</SelectItem>
              <SelectItem value="Buy">Buy</SelectItem>
              <SelectItem value="Sell">Sell</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[300px] min-h-[200px]">
        <DataTable
          columns={columns}
          data={paginated}
          serverPagination={{ page, pageCount, onPageChange: setPage }}
        />
      </div>
    </SectionCard>
  );
}
