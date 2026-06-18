"use client";

import Image from "next/image";
import { ArrowLeftRightIcon, Trash2Icon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropDown";
import { MARKET_WATCH_ICON_IMAGES } from "@/lib/mock-data/market-watch-card";
import { cn } from "@/lib/utils";
import type {
  CompareAssetItem,
  CompareAssetsDropdownProps,
} from "@/types/trading-compare-assets";
import type { MarketWatchIcon } from "@/types/market-watch-card";
import { FaTrash } from "react-icons/fa6";

function CompareAssetIcon({ icon, name }: { icon: MarketWatchIcon; name: string }) {
  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
      <Image
        src={MARKET_WATCH_ICON_IMAGES[icon]}
        alt={name}
        width={32}
        height={32}
        unoptimized
        className="object-contain"
      />
    </span>
  );
}

function CompareAssetRow({
  item,
  isActive,
  onSelect,
}: {
  item: CompareAssetItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        onSelect();
      }}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors",
        isActive
          ? "btn-green"
          : "border border-transparent hover:bg-white/5",
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <CompareAssetIcon icon={item.icon} name={item.name} />
        <span className="min-w-0">
          <p className="truncate text-sm font-medium text-white md:text-base">{item.symbol}</p>
          <p className="truncate text-xs text-white/60 md:text-sm">
            {item.name} / US Dollar
          </p>
        </span>
      </span>

      <span
        className={cn(
          "shrink-0 text-sm font-medium",
          isActive ? "text-primary" : "text-white/50",
        )}
      >
        {isActive ? "Active" : "Add"}
      </span>
    </button>
  );
}

function RemoveComparisonRow({ onRemove }: { onRemove: () => void }) {
  return (
    <div
      onClick={(event) => {
        event.preventDefault();
        onRemove();
      }}
      className="flex w-full items-center justify-between gap-3 py-2.5 text-left transition-colors hover:opacity-90"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-white md:text-base">Remove Comparison</p>
        <p className="text-xs text-white/60 md:text-sm">Clear secondary line</p>
      </div>
      <button className="flex rounded-full hover:bg-white/10 transition-colors p-1.5 cursor-pointer shrink-0 items-center justify-center text-white/80">
        <FaTrash color="white" className="size-4" />
      </button>
    </div>
  );
}

export function CompareAssetsDropdown({
  items,
  primaryAssetId,
  compareAssetId = null,
  onCompareChange,
  className,
}: CompareAssetsDropdownProps) {
  const compareOptions = items.filter((item) => item.id !== primaryAssetId);

  const handleSelect = (assetId: string) => {
    if (compareAssetId === assetId) {
      onCompareChange?.(null);
      return;
    }

    onCompareChange?.(assetId);
  };

  const handleRemove = () => {
    onCompareChange?.(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 bg-linear-to-r from-white/5 to-white/7 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10",
            compareAssetId && "border-primary/40 text-primary",
            className,
          )}
        >
          <ArrowLeftRightIcon className="size-3.5" />
          Compare
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[333px] max-w-[333px] max-h-[615px] overflow-y-auto rounded-xl border border-white/20 bg-black/50 p-0 py-6 text-white backdrop-blur-sm"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div className="sticky top-0 z-10 px-4 pb-3 md:px-6">
          <h4 className="text-base font-medium text-white/80 md:text-lg">Compare Asset</h4>
        </div>

        <div className="space-y-2 px-4 md:px-6">
          {compareOptions.map((item) => (
            <CompareAssetRow
              key={item.id}
              item={item}
              isActive={compareAssetId === item.id}
              onSelect={() => handleSelect(item.id)}
            />
          ))}
        </div>

        <div className="sticky bottom-0 mt-2 px-4 md:px-6">
          <RemoveComparisonRow onRemove={handleRemove} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
