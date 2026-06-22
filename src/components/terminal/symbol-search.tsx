"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/section-card";
import { formatMarketPrice } from "@/lib/utils/market-price";
import type { SymbolSearchProps } from "@/types";

export function SymbolSearch({ symbol = "EURUSD", price, symbols, onSymbolChange }: SymbolSearchProps) {
  const [query, setQuery] = useState("");

  const filteredSymbols = useMemo(() => {
    const resolvedSymbols = symbols?.length ? symbols : [symbol];
    const normalizedQuery = query.trim().toUpperCase();

    if (!normalizedQuery) {
      return resolvedSymbols;
    }

    return resolvedSymbols.filter((item) => item.toUpperCase().includes(normalizedQuery));
  }, [query, symbols, symbol]);

  return (
    <SectionCard title="Symbol">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search symbol..."
              className="pl-8"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 text-2xl font-bold tracking-tight">
            <span>{symbol}</span>
            <span className="text-emerald-600">{formatMarketPrice(price, symbol)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filteredSymbols.slice(0, 8).map((item) => (
            <Button
              key={item}
              type="button"
              variant={item === symbol ? "default" : "outline"}
              size="sm"
              className="h-8 rounded-full"
              onClick={() => onSymbolChange?.(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
