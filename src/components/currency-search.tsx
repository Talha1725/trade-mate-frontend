"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { AssetIcon } from "@/components/shared/asset-icon";
import { mockTradingFilterAssets } from "@/lib/mock-data/trading-filter-bar";
import { useMarketSelectionStore } from "@/lib/stores/market-selection-store";
import { filterTradingAssets } from "@/lib/utils/filter-trading-assets";
import { cn } from "@/lib/utils";
import type { CurrencySearchProps } from "@/types/currency-search";
import type { TradingFilterBarAsset } from "@/types/trading-filter-bar";

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

function getDropdownPosition(element: HTMLElement): DropdownPosition {
  const rect = element.getBoundingClientRect();

  return {
    top: rect.bottom + 8,
    left: rect.left,
    width: rect.width,
  };
}

export function CurrencySearch({ className }: CurrencySearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState<DropdownPosition | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const setSelectedMarketId = useMarketSelectionStore((state) => state.setSelectedMarketId);
  const selectedMarketId = useMarketSelectionStore((state) => state.selectedMarketId);

  const selectedAsset = React.useMemo(
    () => mockTradingFilterAssets.find((asset) => asset.id === selectedMarketId),
    [selectedMarketId],
  );

  const results = React.useMemo(
    () => filterTradingAssets(mockTradingFilterAssets, query),
    [query],
  );

  const showResults = isOpen && query.trim().length > 0;

  const updateDropdownPosition = React.useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    setDropdownPosition(getDropdownPosition(containerRef.current));
  }, []);

  const handleSelect = React.useCallback(
    (asset: TradingFilterBarAsset) => {
      setSelectedMarketId(asset.id);
      setQuery(asset.label);
      setIsOpen(false);
      inputRef.current?.blur();

      if (pathname !== "/dashboard") {
        router.push("/dashboard");
      }
    },
    [pathname, router, setSelectedMarketId],
  );

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!showResults || !containerRef.current) {
      return;
    }

    updateDropdownPosition();

    const resizeObserver = new ResizeObserver(() => {
      updateDropdownPosition();
    });

    resizeObserver.observe(containerRef.current);

    const handleReposition = () => updateDropdownPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [showResults, query, updateDropdownPosition]);

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  React.useEffect(() => {
    if (!selectedAsset || document.activeElement === inputRef.current) {
      return;
    }

    setQuery(selectedAsset.label);
  }, [selectedAsset]);

  const dropdown =
    showResults && dropdownPosition && isMounted
      ? createPortal(
          <div
            ref={dropdownRef}
            data-slot="currency-search-results"
            className="fixed z-200 max-h-[280px] overflow-y-auto rounded-lg border border-white/20 bg-[#0d0d0d] p-1 shadow-2xl"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              minWidth: dropdownPosition.width,
              maxWidth: dropdownPosition.width,
            }}
          >
            {results.length > 0 ? (
              results.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(asset)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10",
                    asset.id === selectedMarketId && "bg-white/5",
                  )}
                >
                  <AssetIcon symbol={asset.symbol} label={asset.label} size={20} />
                  <span className="min-w-0 flex-1 truncate">{asset.label}</span>
                  <span className="shrink-0 text-xs text-white/60">{asset.symbol}</span>
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-center text-sm text-white/60">
                No currencies match your search.
              </p>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div ref={containerRef} className={cn("relative w-full min-w-0", className)}>
        <div className="flex w-full items-center gap-2 rounded-lg border border-border/20 bg-neutral-900 px-4 py-2">
          <Search className="size-4 shrink-0 text-white/60" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search Currencies"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60"
            onFocus={(event) => {
              setIsOpen(true);
              updateDropdownPosition();
              event.currentTarget.select();
            }}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
              updateDropdownPosition();
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setIsOpen(false);
                inputRef.current?.blur();
              }

              if (event.key === "Enter" && results[0]) {
                event.preventDefault();
                handleSelect(results[0]);
              }
            }}
          />
        </div>
      </div>
      {dropdown}
    </>
  );
}
