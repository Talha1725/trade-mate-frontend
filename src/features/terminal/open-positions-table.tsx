"use client";

import { useState, useMemo } from "react";
import { SearchIcon, FilterIcon, ArrowUpDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "@/components/section-card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Position {
  ticket: string;
  symbol: string;
  type: "Buy" | "Sell";
  volume: number;
  openPrice: number;
  sl: number | null;
  tp: number | null;
  current: number;
  profit: number;
}

const POSITIONS: Position[] = [
  { ticket: "#10245", symbol: "EURUSD", type: "Buy", volume: 1.0, openPrice: 1.0845, sl: 1.0800, tp: 1.0900, current: 1.0850, profit: 50.00 },
  { ticket: "#10246", symbol: "GBPUSD", type: "Sell", volume: 0.5, openPrice: 1.2650, sl: null, tp: null, current: 1.2660, profit: -50.00 },
  { ticket: "#10247", symbol: "XAUUSD", type: "Buy", volume: 0.1, openPrice: 2040.50, sl: 2000.00, tp: 2100.00, current: 2045.00, profit: 45.00 },
  { ticket: "#10248", symbol: "USDJPY", type: "Buy", volume: 2.0, openPrice: 150.20, sl: 149.00, tp: 152.00, current: 150.50, profit: 60.00 },
];

export function OpenPositionsTable() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");

  const sortedPositions = useMemo(() => {
    let result = [...POSITIONS];

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
  }, [actionFilter, search]);

  const columns: ColumnDef<Position>[] = [
    {
      accessorKey: "ticket",
      header: "Ticket",
    },
    {
      accessorKey: "symbol",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Symbol
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Volume
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "openPrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Open Price
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Current
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "profit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Profit
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
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
      cell: () => (
        <Button variant="outline" size="sm" className="h-7 text-xs">
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
          <Select value={actionFilter} onValueChange={setActionFilter}>
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
        <DataTable columns={columns} data={sortedPositions} />
      </div>
    </SectionCard>
  );
}
