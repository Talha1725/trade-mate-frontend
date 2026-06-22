"use client";

import { useState } from "react";
import { RotateCcwIcon, SlidersHorizontalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropDown";
import { Switch } from "@/components/ui/switch";
import { FaArrowsRotate } from "react-icons/fa6";

import {
  createDefaultIndicatorState,
  DEFAULT_INDICATOR_TEMPLATE_LABEL,
  mockTradingIndicators,
} from "@/lib/mock-data/trading-indicators";
import { cn } from "@/lib/utils";
import type {
  IndicatorsDropdownProps,
  TradingIndicatorItem,
} from "@/types/trading-indicators";
import Image from "next/image";

function IndicatorRow({
  item,
  onToggle,
}: {
  item: TradingIndicatorItem;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 ">
      <div className="min-w-0">
        <p className="text-sm md:text-base font-medium text-white">{item.title}</p>
        <p className="text-xs md:text-sm text-white/60">{item.description}</p>
      </div>
      <Switch
        checked={item.enabled}
        onCheckedChange={onToggle}
        size="default"
      />
    </div>
  );
}

function ResetTemplateRow({
  label,
  onReset,
}: {
  label: string;
  onReset: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="flex w-full items-center justify-between gap-3 py-2.5 text-left transition-colors hover:opacity-90"
    >
      <div className="min-w-0">
        <p className="text-sm md:text-base font-medium text-white">Reset Template</p>
        <p className="text-xs md:text-sm text-white/60">{label}</p>
      </div>
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/60 text-black">
        <FaArrowsRotate className="size-3" />
      </span>
    </button>
  );
}

export function IndicatorsDropdown({
  indicators = mockTradingIndicators,
  resetTemplateLabel = DEFAULT_INDICATOR_TEMPLATE_LABEL,
  onIndicatorChange,
  onResetTemplate,
  className,
}: IndicatorsDropdownProps) {
  const [indicatorState, setIndicatorState] = useState(indicators);

  const handleToggle = (id: string, enabled: boolean) => {
    setIndicatorState((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item)),
    );
    onIndicatorChange?.(id, enabled);
  };

  const handleReset = () => {
    const nextState = createDefaultIndicatorState();
    setIndicatorState(nextState);
    onResetTemplate?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center cursor-pointer gap-1.5 rounded-lg border border-white/20 bg-linear-to-r from-white/5 to-white/7 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10",
          className,
        )}
      >
        <Image src="/images/icons/setting.svg" alt="Indicators" width={16} height={16} />
        Indicators
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[333px] max-w-[333px] max-h-[615px] overflow-y-auto rounded-xl border border-white/20 bg-black/50 p-0 text-white backdrop-blur-sm py-6"
        finalFocus={false}
      >
        <div className="sticky top-0 z-10  md:px-6 px-4 pb-3">
          <h4 className="text-base md:text-lg font-medium text-white/80">Indicators</h4>
        </div>

        <div className="md:px-6 px-4 space-y-3">
          {indicatorState.map((item) => (
            <IndicatorRow
              key={item.id}
              item={item}
              onToggle={(enabled) => handleToggle(item.id, enabled)}
            />
          ))}
        </div>

        <div className="sticky bottom-0 md:px-6 px-4 ">
          <ResetTemplateRow label={resetTemplateLabel} onReset={handleReset} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
