"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon, SparklesIcon, SendIcon, XIcon } from "lucide-react";

import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TradeInjectionTargetOption, InjectTradeFormProps } from "@/types/admin";
import { Textarea } from "@/components/ui/textarea";
function getSelectionLabel(options: TradeInjectionTargetOption[], selectedTargets: string[]) {
  const getNameOnly = (value: string) => {
    const label = options.find((option) => option.value === value)?.label ?? value;
    return label.split(" (")[0]?.trim() || label;
  };

  if (selectedTargets.length === 0) {
    return "Select accounts";
  }

  if (selectedTargets.length === 1) {
    return getNameOnly(selectedTargets[0]);
  }

  return `${getNameOnly(selectedTargets[0])} + ${selectedTargets.length - 1} more`;
}

export function InjectTradeForm({
  prompt,
  setPrompt,
  selectedTargets,
  onToggleTarget,
  onSelectAllActive,
  onClearTargets,
  onPreview,
  onInject,
  isInjecting = false,
  options,
}: InjectTradeFormProps) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) {
      return options;
    }

    const query = search.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query));
  }, [options, search]);

  const selectedCountLabel = selectedTargets.length > 0 ? `${selectedTargets.length} selected` : null;
  const triggerLabel = getSelectionLabel(options, selectedTargets);
  const hasAllActiveShortcut = selectedTargets.includes("All Active Accounts");

  const handleToggle = (value: string) => {
    if (value === "All Active Accounts") {
      onSelectAllActive();
      return;
    }

    onToggleTarget(value);
  };

  return (
    <SectionCard
      title="Natural Language Injection"
      description="Select one or more target accounts, describe the trade in plain English, and let the backend generate a validated preview."
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-foreground">Select Accounts</label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onSelectAllActive} className="gap-2">
                <ChevronDownIcon className="h-4 w-4" />
                All Active
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onClearTargets} disabled={selectedTargets.length === 0}>
                Clear
              </Button>
            </div>
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full max-w-full justify-between gap-3 px-4"
                />
              }
            >
              <span className={cn("min-w-0 flex-1 truncate text-left", selectedTargets.length === 0 && "text-muted-foreground")}>{triggerLabel}</span>
              <span className="flex shrink-0 items-center gap-2">
                {selectedCountLabel ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {selectedCountLabel}
                  </span>
                ) : null}
                <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              </span>
            </PopoverTrigger>

            <PopoverContent className="w-[min(36rem,calc(100vw-2rem))] p-0" align="start" sideOffset={8}>
              <div className="flex flex-col gap-3 p-3">
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search accounts..."
                    className="pl-9"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Select one or more accounts</span>
                  <button
                    type="button"
                    className="font-medium text-foreground hover:underline"
                    onClick={() => {
                      onSelectAllActive();
                      setOpen(false);
                    }}
                  >
                    Use all active
                  </button>
                </div>

                <ScrollArea className="h-72 rounded-lg border">
                  <div className="p-2">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => {
                        const isSelected = selectedTargets.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleToggle(option.value)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/70",
                              isSelected && "bg-muted/70",
                            )}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleToggle(option.value)}
                              aria-label={option.label}
                              className="pointer-events-none"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-foreground">{option.label}</span>
                              {option.value === "All Active Accounts" ? (
                                <span className="block text-xs text-muted-foreground">Bulk push to every active account</span>
                              ) : null}
                            </span>
                            {isSelected ? <CheckIcon className="h-4 w-4 text-emerald-600" /> : null}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-8 text-center text-sm text-muted-foreground">No matching accounts found.</div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between gap-2 border-t pt-3">
                  <div className="text-xs text-muted-foreground">
                    {hasAllActiveShortcut ? "All active accounts is selected." : `${selectedTargets.length} account(s) selected.`}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                      Done
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        onClearTargets();
                        setSearch("");
                      }}
                      variant="ghost"
                    >
                      Clear all
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <p className="text-xs text-muted-foreground">
            You can select multiple accounts for one injected trade. If you pick more than one account, the backend will bulk push the generated trade to all selected targets.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">Instruction</label>
          <Textarea
            id="instruction-textarea"
            placeholder="e.g., Add a buy trade on EURUSD opened this morning and closed for $126 profit"
            className="min-h-[120px] resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Describe the trade in plain English and the preview panel will infer the symbol, direction, size, and prices.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onPreview}
            disabled={!prompt.trim()}
            className="gap-2"
            id="btn-preview-trade"
          >
            <SparklesIcon className="h-4 w-4 text-amber-500" />
            Preview Trade
          </Button>
          <Button
            type="button"
            onClick={onInject}
            disabled={!prompt.trim() || isInjecting}
            className="gap-2"
            id="btn-inject-trade"
          >
            <SendIcon className="h-4 w-4" />
            {isInjecting ? "Injecting..." : "Inject Trade"}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
