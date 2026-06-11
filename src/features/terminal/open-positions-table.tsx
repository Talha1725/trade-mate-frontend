"use client";

import { useState, useMemo } from "react";
import { SearchIcon, FilterIcon, ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "@/components/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type SortKey = keyof Position;
type SortDir = "asc" | "desc";

function SortableHead({
  children,
  className,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  sortKey: SortKey;
  currentKey: SortKey | null;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right" | "center";
}) {
  const isActive = currentKey === sortKey;
  const Icon = isActive ? (currentDir === "asc" ? ArrowUpIcon : ArrowDownIcon) : ArrowUpDownIcon;
  return (
    <TableHead className={className}>
      <span
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1 cursor-pointer select-none hover:text-foreground transition-colors ${
          align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start"
        }`}
      >
        {align === "right" && <Icon className={`h-3 w-3 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />}
        {children}
        {align !== "right" && <Icon className={`h-3 w-3 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />}
      </span>
    </TableHead>
  );
}

export function OpenPositionsTable() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

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

    if (!sortKey) return result;
    return result.sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      const cmp = typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir, actionFilter, search]);

  const sortProps = { currentKey: sortKey, currentDir: sortDir, onSort: handleSort };

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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Ticket</TableHead>
                <SortableHead sortKey="symbol" className="w-24" {...sortProps}>Symbol</SortableHead>
                <TableHead className="w-16">Type</TableHead>
                <SortableHead sortKey="volume" className="w-20" {...sortProps}>Volume</SortableHead>
                <SortableHead sortKey="openPrice" className="w-24" {...sortProps}>Open Price</SortableHead>
                <TableHead className="w-20">S/L</TableHead>
                <TableHead className="w-20">T/P</TableHead>
                <SortableHead sortKey="current" className="w-24" {...sortProps}>Current</SortableHead>
                <SortableHead sortKey="profit" className="w-24 text-right" align="right" {...sortProps}>Profit</SortableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPositions.map((pos) => (
                <TableRow key={pos.ticket}>
                  <TableCell className="w-20">{pos.ticket}</TableCell>
                  <TableCell className="w-24 font-medium">{pos.symbol}</TableCell>
                  <TableCell className={`w-16 ${pos.type === "Buy" ? "text-emerald-600" : "text-rose-600"}`}>{pos.type}</TableCell>
                  <TableCell className="w-20">{pos.volume}</TableCell>
                  <TableCell className="w-24">{pos.openPrice}</TableCell>
                  <TableCell className="w-20">{pos.sl ?? "-"}</TableCell>
                  <TableCell className="w-20">{pos.tp ?? "-"}</TableCell>
                  <TableCell className="w-24">{pos.current}</TableCell>
                  <TableCell className={`w-24 text-right ${pos.profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {pos.profit > 0 ? "+" : ""}${pos.profit.toFixed(2)}
                  </TableCell>
                  <TableCell className="w-16 text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Close
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SectionCard>
  );
}
