"use client";

import { useState, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/section-card";
import { useSymbols, useQuotes } from "@/hooks/use-market";

type SymbolSearchProps = {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
};

export function SymbolSearch({ selectedSymbol, onSelectSymbol }: SymbolSearchProps) {
  const [search, setSearch] = useState("");
  const { data: symbols } = useSymbols();
  const { data: quotes } = useQuotes();

  const filteredSymbols = useMemo(() => {
    if (!symbols) return [];
    if (!search.trim()) return symbols;
    const q = search.toLowerCase();
    return symbols.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q),
    );
  }, [symbols, search]);

  const currentQuote = quotes?.[selectedSymbol];

  return (
    <SectionCard title="Symbol">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search symbol..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedSymbol} onValueChange={(value) => onSelectSymbol(value ?? selectedSymbol)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>
            <SelectContent>
              {filteredSymbols.map((s) => (
                <SelectItem key={s.symbol} value={s.symbol}>
                  {s.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentQuote && (
            <div className="flex items-center gap-4 text-2xl font-bold tracking-tight">
              <span>{selectedSymbol}</span>
              <span
                className={
                  currentQuote.change >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }
              >
                {currentQuote.bid.toFixed(4)}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentQuote.change >= 0 ? "+" : ""}
                {currentQuote.change.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
