"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { AssetIcon } from "@/components/shared/asset-icon";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAssets } from "@/hooks/use-assets";
import { useSelectedSymbol, useSetSelectedSymbol } from "@/hooks/use-selected-symbol";
import { useSyncedTradingAssets } from "@/hooks/use-synced-trading-assets";
import { cn } from "@/lib/utils";
import type { AssetCategory } from "@/types/asset";
import type { TradingFilterBarAsset } from "@/types/trading-filter-bar";

const CATEGORY_ORDER: AssetCategory[] = ["CRYPTO", "FOREX", "COMMODITIES", "INDICES", "STOCK"];
const CATEGORY_LABELS: Record<AssetCategory, string> = {
  CRYPTO: "Crypto",
  FOREX: "Forex",
  COMMODITIES: "Commodities",
  INDICES: "Indices",
  STOCK: "Stocks",
};

/**
 * Searchable, category-grouped symbol selector backed by the shared
 * market-selection store — one selection across the whole app. Styled to match
 * the asset selector in the chart filter bar.
 */
export function SymbolSelector({ className }: { className?: string }) {
  // Keep the store's known assets in sync wherever this selector is mounted.
  useSyncedTradingAssets();
  const { data: assets = [] } = useAssets();
  const selectedSymbol = useSelectedSymbol();
  const setSelectedSymbol = useSetSelectedSymbol();
  const [open, setOpen] = React.useState(false);

  const selectedAsset = assets.find((asset) => asset.symbol === selectedSymbol);

  const groups = React.useMemo(() => {
    const byCategory = new Map<AssetCategory, TradingFilterBarAsset[]>();

    for (const asset of assets) {
      const list = byCategory.get(asset.category) ?? [];
      list.push(asset);
      byCategory.set(asset.category, list);
    }

    return CATEGORY_ORDER.filter((category) => byCategory.has(category)).map((category) => ({
      category,
      items: byCategory.get(category)!,
    }));
  }, [assets]);

  if (assets.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-9 cursor-pointer justify-between rounded-lg border border-white/20 bg-neutral-900 bg-linear-to-b from-[#6E6E6E1A] to-[#13131505] px-3 text-sm font-medium text-white shadow-none hover:border-primary hover:bg-white/15 hover:text-white",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {selectedAsset ? (
              <AssetIcon symbol={selectedAsset.symbol} label={selectedAsset.label} size={20} />
            ) : null}
            <span className="truncate">
              {selectedAsset?.label ?? selectedSymbol ?? "Select symbol"}
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[260px] rounded-lg border border-white/20 bg-[#0d0d0d] p-0 text-white"
      >
        <Command className="bg-transparent">
          <CommandInput placeholder="Search symbol..." className="text-white" />
          <CommandList className="max-h-[250px]">
            <CommandEmpty>No symbol found.</CommandEmpty>
            {groups.map(({ category, items }) => (
              <CommandGroup key={category} heading={CATEGORY_LABELS[category]}>
                {items.map((asset) => (
                  <CommandItem
                    key={asset.id}
                    value={`${asset.label} ${asset.symbol}`}
                    onSelect={() => {
                      setSelectedSymbol(asset.symbol);
                      setOpen(false);
                    }}
                    className="cursor-pointer text-white data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                  >
                    <AssetIcon symbol={asset.symbol} label={asset.label} size={20} />
                    <span className="min-w-0 flex-1 truncate">{asset.label}</span>
                    <span className="shrink-0 text-xs text-white/50">{asset.symbol}</span>
                    <Check
                      className={cn(
                        "ml-1 size-4 text-primary",
                        asset.symbol === selectedSymbol ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
