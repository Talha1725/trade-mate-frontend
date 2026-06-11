"use client";

import { useState, useMemo } from "react";
import { FilterIcon, SearchIcon, ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react";

import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Trade } from "@/types/trade";

const TRADES: Trade[] = [
  { id: "10244", symbol: "EURUSD", type: "Buy", vol: 1.0, openP: 1.0800, closeP: 1.0850, profit: 50.00, time: "2023-10-25 10:20" },
  { id: "10243", symbol: "GBPUSD", type: "Sell", vol: 0.5, openP: 1.2700, closeP: 1.2750, profit: -25.00, time: "2023-10-24 14:15" },
  { id: "10242", symbol: "XAUUSD", type: "Buy", vol: 0.1, openP: 2000.00, closeP: 2050.00, profit: 500.00, time: "2023-10-23 09:30" },
  { id: "10241", symbol: "USDJPY", type: "Buy", vol: 2.0, openP: 150.00, closeP: 151.00, profit: 200.00, time: "2023-10-22 16:45" },
  { id: "10240", symbol: "EURGBP", type: "Sell", vol: 1.0, openP: 0.8700, closeP: 0.8650, profit: 50.00, time: "2023-10-21 11:10" },
];

type SortKey = keyof Trade;
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
        {children}
        <Icon className={`h-3 w-3 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
      </span>
    </TableHead>
  );
}

export function TradeHistoryTable() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("30 Days");
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
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

  const filteredAndSorted = useMemo(() => {
    let result = [...TRADES];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.symbol.toLowerCase().includes(q) || t.id.includes(q)
      );
    }

    // Action filter
    if (actionFilter !== "All") {
      result = result.filter((t) => t.type === actionFilter);
    }

    // Time filter (simple approximation on index for demo data)
    if (timeFilter === "7 Days") {
      result = result.slice(0, 2);
    } else if (timeFilter === "YTD") {
      result = result; // all for demo
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const cmp =
          typeof aVal === "number" && typeof bVal === "number"
            ? aVal - bVal
            : String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [search, actionFilter, timeFilter, sortKey, sortDir]);

  const sortProps = { currentKey: sortKey, currentDir: sortDir, onSort: handleSort };

  return (
    <SectionCard className="p-4">
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
          <Select value={timeFilter} onValueChange={setTimeFilter}>
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead sortKey="id" {...sortProps} className="w-20">Ticket</SortableHead>
              <SortableHead sortKey="time" {...sortProps} className="w-36">Open Time</SortableHead>
              <SortableHead sortKey="symbol" {...sortProps} className="w-24">Symbol</SortableHead>
              <TableHead className="w-16">Type</TableHead>
              <SortableHead sortKey="vol" {...sortProps} className="w-20">Volume</SortableHead>
              <SortableHead sortKey="openP" {...sortProps} className="w-24">Open Price</SortableHead>
              <TableHead className="w-36">Close Time</TableHead>
              <SortableHead sortKey="closeP" {...sortProps} className="w-24">Close Price</SortableHead>
              <SortableHead sortKey="profit" className="w-24 text-right" align="right" {...sortProps}>Profit</SortableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                  No trades match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="w-20">{trade.id}</TableCell>
                  <TableCell className="w-36 text-muted-foreground">{trade.time}</TableCell>
                  <TableCell className="w-24 font-medium">{trade.symbol}</TableCell>
                  <TableCell className={`w-16 ${trade.type === "Buy" ? "text-emerald-600" : "text-rose-600"}`}>
                    {trade.type}
                  </TableCell>
                  <TableCell className="w-20">{trade.vol}</TableCell>
                  <TableCell className="w-24">{trade.openP.toFixed(4)}</TableCell>
                  <TableCell className="w-36 text-muted-foreground">{trade.time}</TableCell>
                  <TableCell className="w-24">{trade.closeP.toFixed(4)}</TableCell>
                  <TableCell className={`w-24 text-right font-medium ${trade.profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {trade.profit > 0 ? "+" : ""}${trade.profit.toFixed(2)}
                  </TableCell>
                  <TableCell className="w-20">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-medium"
                      onClick={() => setSelectedTrade(trade)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Centered Trade Detail Dialog — no close button */}
      <Dialog open={!!selectedTrade} onOpenChange={(open) => !open && setSelectedTrade(null)}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
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
